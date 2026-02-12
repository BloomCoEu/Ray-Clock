# Appwrite Setup Guide for Ray Clock

This guide will help you set up Appwrite backend for the Ray Clock application.

## Prerequisites

- A free account at [https://cloud.appwrite.io](https://cloud.appwrite.io)
- Node.js and npm installed
- Expo CLI installed

## Step 1: Create Appwrite Account and Project

1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io) and create an account
2. Create a new project and give it a name (e.g., "Ray Clock")
3. Note down your **Project ID** from the Settings page

## Step 1.1: Enable Email/Password Auth

1. Go to **Auth > Settings**
2. Ensure **Email/Password** is enabled

## Step 1.2: Add a Platform

Add at least one platform so Appwrite accepts requests from your app:

- **Web**: Use your Expo web URL (e.g., `http://localhost:8081` when running `npm run web`)
- **Android/iOS**: Use your application identifier for production builds

## Step 2: Create Database and Collections

1. In your Appwrite project, navigate to **Databases**
2. Click **Create database** and name it "RayClock"
3. Note down the **Database ID**

### Create Collections

Create the following 4 collections with their attributes:

#### Collection 1: tasks

**Attributes:**
- `userId` (String, Required, Size: 255)
- `title` (String, Required, Size: 255)
- `emoji` (String, Optional, Size: 10)
- `plannedDuration` (Integer, Required)
- `actualDuration` (Integer, Optional, Default: 0)
- `completed` (Boolean, Required, Default: false)
- `order` (Integer, Required, Default: 0)

**Indexes:**
- Index 1: Key: `userId`, Type: fulltext, Attributes: [`userId`]
- Index 2: Key: `order`, Type: fulltext, Attributes: [`order`]

**Permissions:**
- Document Security: Enabled
- Create: Users
- Read: Users
- Update: Users
- Delete: Users

#### Collection 2: presets

**Attributes:**
- `userId` (String, Required, Size: 255)
- `name` (String, Required, Size: 255)
- `emoji` (String, Optional, Size: 10)
- `tasks` (String, Required, Size: 100000) - JSON array of preset tasks
- `totalTime` (Integer, Required, Default: 0)

**Indexes:**
- Index 1: Key: `userId`, Type: fulltext, Attributes: [`userId`]

**Permissions:**
- Document Security: Enabled
- Create: Users
- Read: Users
- Update: Users
- Delete: Users

#### Collection 3: settings

**Attributes:**
- `userId` (String, Required, Size: 255, Unique)
- `defaultTime` (Integer, Required, Default: 15)
- `accentColor` (String, Required, Size: 10, Default: "#10B981")
- `theme` (String, Required, Size: 10, Default: "auto")
- `smartTimeDetection` (Boolean, Required, Default: true)
- `pieTimerEnabled` (Boolean, Required, Default: false)

**Indexes:**
- Index 1: Key: `userId`, Type: unique, Attributes: [`userId`]

**Permissions:**
- Document Security: Enabled
- Create: Users
- Read: Users
- Update: Users
- Delete: Users

### Optional: Run the schema update script

If you already have collections created, you can use the helper script to add any missing
attributes that Ray Clock expects.

1. Create an API key in **Project Settings > API Keys** with Database permissions (required for this script only)
2. Add the key to your `.env` file:

```env
APPWRITE_API_KEY=your_server_api_key
```

3. Run the script:

```bash
npm run appwrite:add-properties
```

## Step 3: Configure Environment Variables

Create a `.env` file in the root of your project:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID=your_tasks_collection_id
EXPO_PUBLIC_APPWRITE_PRESETS_COLLECTION_ID=your_presets_collection_id
EXPO_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID=your_settings_collection_id
APPWRITE_API_KEY=your_server_api_key # Required for schema update script
```

Replace the placeholder values with your actual IDs from Appwrite.

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Run the App

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

For Web:
```bash
npm run web
```

Or start Expo:
```bash
npm start
```

Then scan the QR code with your Expo Go app (iOS) or camera (Android).

## Troubleshooting

### Authentication Issues
- Make sure your Appwrite project is set to allow email/password authentication
- Check that your environment variables are correctly set

### Database Connection Issues
- Verify all IDs in your `.env` file are correct
- Ensure collections have the proper permissions set

### Collection Permissions
For each collection, make sure to:
1. Enable Document Security
2. Set permissions to allow Users to Create, Read, Update, and Delete

## Additional Configuration

### Email Templates (Optional)
You can customize the email templates in Appwrite for:
- Verification emails
- Password reset emails
- Magic URL emails

Navigate to **Auth > Templates** in your Appwrite console.

### OAuth Providers (Optional)
You can enable OAuth providers (Google, Apple, etc.) in:
**Auth > Settings > OAuth2 Providers**

## Support

For issues related to Appwrite, check:
- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord](https://discord.gg/appwrite)
- [GitHub Issues](https://github.com/appwrite/appwrite/issues)
