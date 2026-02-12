import fs from 'node:fs';
import path from 'node:path';
import { Client, Databases } from 'appwrite';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContents = fs.readFileSync(envPath, 'utf8');
  envContents.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

const requiredEnvVars = [
  'EXPO_PUBLIC_APPWRITE_ENDPOINT',
  'EXPO_PUBLIC_APPWRITE_PROJECT_ID',
  'EXPO_PUBLIC_APPWRITE_DATABASE_ID',
  'EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_PRESETS_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID',
  'APPWRITE_API_KEY',
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach((key) => console.error(`   - ${key}`));
  console.error('\nPlease add them to your .env file or export them in your shell.');
  console.error('You can generate an API key in Appwrite under Project Settings > API Keys.');
  process.exit(1);
}

const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const APPWRITE_TASKS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID;
const APPWRITE_PRESETS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_PRESETS_COLLECTION_ID;
const APPWRITE_SETTINGS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

const collections = [
  {
    name: 'tasks',
    id: APPWRITE_TASKS_COLLECTION_ID,
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'emoji', type: 'string', size: 10, required: false },
      { key: 'plannedDuration', type: 'integer', required: true },
      { key: 'actualDuration', type: 'integer', required: false, default: 0 },
      { key: 'completed', type: 'boolean', required: true, default: false },
      { key: 'order', type: 'integer', required: true, default: 0 },
    ],
  },
  {
    name: 'presets',
    id: APPWRITE_PRESETS_COLLECTION_ID,
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'emoji', type: 'string', size: 10, required: false },
      { key: 'tasks', type: 'string', size: 100000, required: true },
      { key: 'totalTime', type: 'integer', required: true, default: 0 },
    ],
  },
  {
    name: 'settings',
    id: APPWRITE_SETTINGS_COLLECTION_ID,
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'defaultTime', type: 'integer', required: true, default: 15 },
      { key: 'accentColor', type: 'string', size: 10, required: true, default: '#10B981' },
      { key: 'theme', type: 'string', size: 10, required: true, default: 'auto' },
      { key: 'smartTimeDetection', type: 'boolean', required: true, default: true },
      { key: 'pieTimerEnabled', type: 'boolean', required: true, default: false },
    ],
  },
];

const formatDefault = (value) => {
  if (value === undefined) {
    return '';
  }
  return ` (default: ${JSON.stringify(value)})`;
};

const createAttribute = async (collectionId, attribute) => {
  if (attribute.type === 'string') {
    return databases.createStringAttribute(
      APPWRITE_DATABASE_ID,
      collectionId,
      attribute.key,
      attribute.size,
      attribute.required,
      attribute.default
    );
  }

  if (attribute.type === 'integer') {
    return databases.createIntegerAttribute(
      APPWRITE_DATABASE_ID,
      collectionId,
      attribute.key,
      attribute.required,
      attribute.min,
      attribute.max,
      attribute.default
    );
  }

  if (attribute.type === 'boolean') {
    return databases.createBooleanAttribute(
      APPWRITE_DATABASE_ID,
      collectionId,
      attribute.key,
      attribute.required,
      attribute.default
    );
  }

  throw new Error(`Unsupported attribute type: ${attribute.type}`);
};

const ensureCollectionAttributes = async (collection) => {
  console.log(`\n🔍 Checking ${collection.name} collection...`);

  const attributeList = await databases.listAttributes(
    APPWRITE_DATABASE_ID,
    collection.id
  );

  const existingAttributes = new Set(
    (attributeList.attributes || []).map((attribute) => attribute.key)
  );

  for (const attribute of collection.attributes) {
    if (existingAttributes.has(attribute.key)) {
      console.log(`✅ ${collection.name}.${attribute.key} already exists`);
      continue;
    }

    console.log(
      `➕ Creating ${collection.name}.${attribute.key}${formatDefault(
        attribute.default
      )}`
    );

    await createAttribute(collection.id, attribute);
  }
};

const run = async () => {
  try {
    for (const collection of collections) {
      await ensureCollectionAttributes(collection);
    }

    console.log('\n🎉 Appwrite schema check complete.');
  } catch (error) {
    console.error('\n❌ Failed to add missing Appwrite properties.');
    console.error(error);
    process.exitCode = 1;
  }
};

await run();
