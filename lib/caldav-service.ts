import type { CalendarEvent, Reminder } from './types';

const CALDAV_BASE_URL = 'https://caldav.icloud.com';

function encodeBase64(str: string): string {
  if (typeof btoa === 'function') {
    return btoa(str);
  }
  // Fallback for environments without btoa
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  for (let i = 0; i < str.length; i += 3) {
    const a = str.charCodeAt(i);
    const b = i + 1 < str.length ? str.charCodeAt(i + 1) : 0;
    const c = i + 2 < str.length ? str.charCodeAt(i + 2) : 0;
    output += chars[a >> 2];
    output += chars[((a & 3) << 4) | (b >> 4)];
    output += i + 1 < str.length ? chars[((b & 15) << 2) | (c >> 6)] : '=';
    output += i + 2 < str.length ? chars[c & 63] : '=';
  }
  return output;
}

function buildBasicAuth(appleId: string, appPassword: string): string {
  const encoded = encodeBase64(`${appleId}:${appPassword}`);
  return `Basic ${encoded}`;
}

function extractXmlValues(xml: string, tag: string): string[] {
  const regex = new RegExp(`<[^>]*:?${tag}[^>]*>([^<]*)<\\/[^>]*:?${tag}>`, 'gi');
  const results: string[] = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

function extractHrefs(xml: string): string[] {
  const regex = /<[^>]*href[^>]*>([^<]+)<\/[^>]*href[^>]*>/gi;
  const results: string[] = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

function extractCalendarData(xml: string): string[] {
  const regex = /<[^>]*calendar-data[^>]*>([\s\S]*?)<\/[^>]*calendar-data[^>]*>/gi;
  const results: string[] = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

function getICalField(icalText: string, field: string): string | undefined {
  const regex = new RegExp(`^${field}[;:](.*)`, 'mi');
  const match = icalText.match(regex);
  if (!match) return undefined;
  let value = match[1];
  // Handle properties with parameters (e.g., DTSTART;VALUE=DATE:20210101)
  if (value.includes(':')) {
    value = value.substring(value.lastIndexOf(':') + 1);
  }
  return value.trim();
}

function parseICalDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  // Handle YYYYMMDD format
  if (dateStr.length === 8) {
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}T00:00:00.000Z`;
  }
  // Handle YYYYMMDDTHHmmssZ format
  if (dateStr.length >= 15) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(9, 11);
    const min = dateStr.substring(11, 13);
    const sec = dateStr.substring(13, 15);
    return `${year}-${month}-${day}T${hour}:${min}:${sec}.000Z`;
  }
  return dateStr;
}

function parseVEvents(icalText: string, calendarName?: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const eventBlocks = icalText.split('BEGIN:VEVENT');

  for (let i = 1; i < eventBlocks.length; i++) {
    const block = eventBlocks[i].split('END:VEVENT')[0];
    const uid = getICalField(block, 'UID') || `event-${i}`;
    const summary = getICalField(block, 'SUMMARY');
    const dtstart = getICalField(block, 'DTSTART');
    const dtend = getICalField(block, 'DTEND');
    const description = getICalField(block, 'DESCRIPTION');
    const location = getICalField(block, 'LOCATION');

    if (summary) {
      events.push({
        uid,
        title: summary,
        startDate: parseICalDate(dtstart) || new Date().toISOString(),
        endDate: parseICalDate(dtend) || new Date().toISOString(),
        description,
        location,
        calendarName,
      });
    }
  }

  return events;
}

function parseVTodos(icalText: string, calendarName?: string): Reminder[] {
  const reminders: Reminder[] = [];
  const todoBlocks = icalText.split('BEGIN:VTODO');

  for (let i = 1; i < todoBlocks.length; i++) {
    const block = todoBlocks[i].split('END:VTODO')[0];
    const uid = getICalField(block, 'UID') || `todo-${i}`;
    const summary = getICalField(block, 'SUMMARY');
    const due = getICalField(block, 'DUE');
    const status = getICalField(block, 'STATUS');
    const priority = getICalField(block, 'PRIORITY');
    const description = getICalField(block, 'DESCRIPTION');

    if (summary) {
      reminders.push({
        uid,
        title: summary,
        dueDate: parseICalDate(due),
        completed: status === 'COMPLETED',
        priority: priority ? parseInt(priority, 10) : undefined,
        notes: description,
        calendarName,
      });
    }
  }

  return reminders;
}

async function caldavRequest(
  url: string,
  method: string,
  auth: string,
  body: string,
  depth: string = '1'
): Promise<string> {
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/xml; charset=utf-8',
      'Depth': depth,
    },
    body,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please verify your Apple ID and app-specific password. Note: app-specific passwords can be revoked — generate a new one at appleid.apple.com if needed.');
    }
    throw new Error(`CalDAV request failed: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function discoverPrincipal(auth: string): Promise<string> {
  const body = `<?xml version="1.0" encoding="utf-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:current-user-principal/>
  </d:prop>
</d:propfind>`;

  const xml = await caldavRequest(CALDAV_BASE_URL, 'PROPFIND', auth, body, '0');
  const hrefs = extractHrefs(xml);
  // Look for principal URL (usually contains a user-specific path)
  const principal = hrefs.find(h => h.includes('/principal/') || h.includes('/user/'));
  return principal || hrefs[0] || '/';
}

async function discoverCalendarHome(auth: string, principalUrl: string): Promise<string> {
  const body = `<?xml version="1.0" encoding="utf-8"?>
<d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop>
    <c:calendar-home-set/>
  </d:prop>
</d:propfind>`;

  const url = principalUrl.startsWith('http')
    ? principalUrl
    : `${CALDAV_BASE_URL}${principalUrl}`;

  const xml = await caldavRequest(url, 'PROPFIND', auth, body, '0');
  const hrefs = extractHrefs(xml);
  // Calendar home is usually a different path from the principal
  return hrefs.find(h => h !== principalUrl) || hrefs[0] || principalUrl;
}

interface CalendarInfo {
  href: string;
  displayName: string;
  isReminders: boolean;
}

async function listCalendars(auth: string, calendarHome: string): Promise<CalendarInfo[]> {
  const body = `<?xml version="1.0" encoding="utf-8"?>
<d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav" xmlns:cs="http://apple.com/ns/ical/" xmlns:x="http://apple.com/ns/ical/">
  <d:prop>
    <d:displayname/>
    <d:resourcetype/>
    <c:supported-calendar-component-set/>
  </d:prop>
</d:propfind>`;

  const url = calendarHome.startsWith('http')
    ? calendarHome
    : `${CALDAV_BASE_URL}${calendarHome}`;

  const xml = await caldavRequest(url, 'PROPFIND', auth, body, '1');

  const calendars: CalendarInfo[] = [];
  const responses = xml.split(/<[^>]*response[^>]*>/i);

  for (const response of responses) {
    // Skip responses that don't contain a calendar resource type
    if (!response.includes('calendar')) continue;

    const hrefMatch = response.match(/<[^>]*href[^>]*>([^<]+)<\/[^>]*href[^>]*>/i);
    const nameMatch = response.match(/<[^>]*displayname[^>]*>([^<]+)<\/[^>]*displayname[^>]*>/i);

    if (hrefMatch) {
      const href = hrefMatch[1].trim();
      const displayName = nameMatch ? nameMatch[1].trim() : 'Unnamed Calendar';
      const isReminders = response.includes('VTODO');

      // Skip the calendar home itself
      if (href !== calendarHome) {
        calendars.push({ href, displayName, isReminders });
      }
    }
  }

  return calendars;
}

async function fetchCalendarEvents(
  auth: string,
  calendarUrl: string,
  calendarName: string
): Promise<CalendarEvent[]> {
  // Fetch events from the last 30 days to the next 30 days
  const now = new Date();
  const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const startStr = start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endStr = end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const body = `<?xml version="1.0" encoding="utf-8"?>
<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop>
    <d:getetag/>
    <c:calendar-data/>
  </d:prop>
  <c:filter>
    <c:comp-filter name="VCALENDAR">
      <c:comp-filter name="VEVENT">
        <c:time-range start="${startStr}" end="${endStr}"/>
      </c:comp-filter>
    </c:comp-filter>
  </c:filter>
</c:calendar-query>`;

  const url = calendarUrl.startsWith('http')
    ? calendarUrl
    : `${CALDAV_BASE_URL}${calendarUrl}`;

  const xml = await caldavRequest(url, 'REPORT', auth, body, '1');
  const calendarDataBlocks = extractCalendarData(xml);

  const events: CalendarEvent[] = [];
  for (const icalText of calendarDataBlocks) {
    events.push(...parseVEvents(icalText, calendarName));
  }

  return events;
}

async function fetchReminders(
  auth: string,
  calendarUrl: string,
  calendarName: string
): Promise<Reminder[]> {
  const body = `<?xml version="1.0" encoding="utf-8"?>
<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
  <d:prop>
    <d:getetag/>
    <c:calendar-data/>
  </d:prop>
  <c:filter>
    <c:comp-filter name="VCALENDAR">
      <c:comp-filter name="VTODO"/>
    </c:comp-filter>
  </c:filter>
</c:calendar-query>`;

  const url = calendarUrl.startsWith('http')
    ? calendarUrl
    : `${CALDAV_BASE_URL}${calendarUrl}`;

  const xml = await caldavRequest(url, 'REPORT', auth, body, '1');
  const calendarDataBlocks = extractCalendarData(xml);

  const reminders: Reminder[] = [];
  for (const icalText of calendarDataBlocks) {
    reminders.push(...parseVTodos(icalText, calendarName));
  }

  return reminders;
}

export const caldavService = {
  async testConnection(appleId: string, appPassword: string): Promise<boolean> {
    const auth = buildBasicAuth(appleId, appPassword);
    // Will throw with a descriptive error if authentication fails
    await discoverPrincipal(auth);
    return true;
  },

  async fetchAllEvents(
    appleId: string,
    appPassword: string
  ): Promise<CalendarEvent[]> {
    const auth = buildBasicAuth(appleId, appPassword);
    const principal = await discoverPrincipal(auth);
    const calendarHome = await discoverCalendarHome(auth, principal);
    const calendars = await listCalendars(auth, calendarHome);

    const eventCalendars = calendars.filter(c => !c.isReminders);
    const allEvents: CalendarEvent[] = [];

    for (const cal of eventCalendars) {
      try {
        const events = await fetchCalendarEvents(auth, cal.href, cal.displayName);
        allEvents.push(...events);
      } catch (error) {
        console.warn(`Failed to fetch events from calendar "${cal.displayName}":`, error);
      }
    }

    // Sort by start date
    allEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return allEvents;
  },

  async fetchAllReminders(
    appleId: string,
    appPassword: string
  ): Promise<Reminder[]> {
    const auth = buildBasicAuth(appleId, appPassword);
    const principal = await discoverPrincipal(auth);
    const calendarHome = await discoverCalendarHome(auth, principal);
    const calendars = await listCalendars(auth, calendarHome);

    const reminderCalendars = calendars.filter(c => c.isReminders);
    const allReminders: Reminder[] = [];

    for (const cal of reminderCalendars) {
      try {
        const reminders = await fetchReminders(auth, cal.href, cal.displayName);
        allReminders.push(...reminders);
      } catch (error) {
        console.warn(`Failed to fetch reminders from list "${cal.displayName}":`, error);
      }
    }

    // Sort by due date (items without due date at the end)
    allReminders.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return allReminders;
  },
};
