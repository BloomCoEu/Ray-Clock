# Todoist Integration Setup Guide

This guide explains how to set up and use the Todoist integration in Ray Clock.

## Overview

The Todoist integration allows you to import tasks from your Todoist account into Ray Clock. This is useful if you use Todoist for task management but want to use Ray Clock's timer features to track your time.

## Features

- **One-way sync**: Import tasks from Todoist into Ray Clock
- **Smart mapping**: Task titles, durations (if set), and descriptions are imported
- **Selective sync**: Only active (incomplete) tasks are synced
- **Manual control**: Sync is triggered manually when you choose
- **Secure storage**: Your API key is stored securely in your settings

## Setup Instructions

### Step 1: Get Your Todoist API Key

1. Log in to [Todoist](https://todoist.com)
2. Click on your profile picture in the top right
3. Select **Settings**
4. Navigate to **Integrations**
5. Scroll down to **Developer** section
6. Copy your **API token**

**Important**: Keep your API token secure and never share it publicly.

### Step 2: Configure Ray Clock

1. Open the Ray Clock app
2. Navigate to the **Settings** tab
3. Scroll down to the **Todoist Integration** section
4. Paste your API token in the **Enter Todoist API Key** field
5. Click **Save API Key**
6. Toggle **Enable Todoist Sync** to ON

### Step 3: Sync Your Tasks

1. In the Todoist Integration section, click **Sync Now**
2. Wait for the sync to complete
3. You'll see a success message showing how many tasks were imported
4. Navigate to the main Tasks tab to see your imported tasks

## How It Works

### Task Mapping

When tasks are imported from Todoist to Ray Clock, they are mapped as follows:

| Todoist Field | Ray Clock Field | Notes |
|--------------|----------------|-------|
| Task content | Task title | The main task description |
| Task description | Emoji | Used as the emoji/icon for the task |
| Duration | Planned duration | If set in Todoist (in minutes) |
| Order | Order | Maintains task order from Todoist |

### Default Values

- **Duration**: If a task doesn't have a duration set in Todoist, it defaults to 15 minutes in Ray Clock
- **Status**: Only active (incomplete) tasks are synced. Completed tasks in Todoist are ignored.

### Duplicate Prevention

Ray Clock tracks which tasks have been synced from Todoist using a unique `todoistId` field. When you sync:

- Tasks that already exist (based on `todoistId`) are skipped
- Only new tasks are imported
- You'll see a summary showing how many tasks were imported vs. skipped

## Usage Tips

### When to Sync

- **After adding new tasks in Todoist**: Sync to import them into Ray Clock
- **Start of day**: Sync to get your current task list from Todoist
- **As needed**: Sync is manual, so you control when it happens

### Best Practices

1. **Use durations in Todoist**: Set task durations in Todoist for better time estimates in Ray Clock
2. **Keep API key secure**: Don't share your API key with anyone
3. **Regular syncs**: Sync regularly if you actively use Todoist
4. **Clean up**: If you delete tasks in Todoist, you may need to manually remove them from Ray Clock

### Working with Both Apps

- **Create in Todoist**: Create tasks in Todoist, then sync to Ray Clock
- **Track time in Ray Clock**: Use Ray Clock's timer to track actual time spent
- **Review in Ray Clock**: Use Ray Clock's reports to see planned vs. actual time

## Troubleshooting

### "Failed to sync from Todoist"

**Possible causes:**
- Invalid API key
- Network connection issues
- Todoist API is temporarily unavailable

**Solutions:**
1. Verify your API key is correct
2. Check your internet connection
3. Try again in a few minutes

### "Please configure your Todoist API key first"

**Solution:** You need to enter and save your Todoist API key before you can sync.

### "Please enable Todoist sync first"

**Solution:** Toggle the "Enable Todoist Sync" switch to ON in Settings.

### Tasks aren't importing

**Possible causes:**
- All tasks in Todoist are completed
- Tasks have already been imported (duplicate prevention)
- API key doesn't have proper permissions

**Solutions:**
1. Check that you have active tasks in Todoist
2. Check the sync message to see if tasks were skipped
3. Verify your API key is valid and has the correct permissions

### Wrong durations

**Solution:** Set task durations in Todoist before syncing. In Todoist, click a task and add a duration.

## Current Limitations

- **One-way sync only**: Tasks created in Ray Clock are not synced back to Todoist
- **No automatic sync**: Sync must be triggered manually
- **No update sync**: If you update a task in Todoist, re-syncing won't update it in Ray Clock (it will be skipped as a duplicate)
- **No deletion sync**: Deleting a task in Todoist doesn't delete it from Ray Clock

## Security & Privacy

- Your Todoist API key is stored locally in your Ray Clock settings
- API calls are made directly from your device to Todoist's API
- No intermediary servers are used
- Your API key is never shared with third parties

## API Rate Limits

Todoist has rate limits on their API. The current implementation:
- Makes one API call per sync operation
- Is well within Todoist's rate limits for normal use
- If you encounter rate limit errors, wait a few minutes before syncing again

## Future Enhancements

Potential future improvements:
- Two-way sync (Ray Clock → Todoist)
- Automatic background sync
- Update sync for existing tasks
- Sync specific projects only
- Sync task labels and priorities

## Support

If you encounter issues:
1. Check this guide first
2. Verify your Todoist API key is valid
3. Check the Todoist API status at [status.todoist.com](https://status.todoist.com)
4. Create an issue on the Ray Clock GitHub repository
