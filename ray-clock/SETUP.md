# Ray Clock - Setup Guide

## Quick Start (5 minutes)

### 1️⃣ Clone & Install
```bash
cd ray-clock
npm install
npx expo install
```

### 2️⃣ Create Appwrite Account
Visit https://cloud.appwrite.io (free tier available)
- Create a new project
- Note the Project ID and Endpoint

### 3️⃣ Create Database Collections
In Appwrite Console:
1. Go to Databases → Create Database (name: "ray_clock")
2. Create 4 collections with any attributes (Appwrite will auto-create):
   - `users`
   - `tasks`
   - `presets`
   - `settings`

### 4️⃣ Set Environment Variables
Create `ray-clock/.env`:
```
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_123
EXPO_PUBLIC_APPWRITE_DB_ID=ray_clock
```

### 5️⃣ Run the App
```bash
npm start

# iOS: Press 'i' or scan QR code with iPhone
# Android: Press 'a'
```

## Test Credentials (if using demo server)
- Email: `demo@example.com`
- Password: `demo123`

## Verify Setup

✅ App starts without errors
✅ Can see login screen
✅ Can create account
✅ Can create first task
✅ Timer counts down
✅ Can navigate all tabs

## Common Issues

### "Failed to connect to Appwrite"
- ❌ Wrong endpoint URL
- ❌ Appwrite server offline
- ✅ Solution: Check URL, restart server

### "Database not found"
- ❌ Wrong database ID
- ❌ Collections don't exist
- ✅ Solution: Create collections in Appwrite Console

### "Cannot create task"
- ❌ Not authenticated
- ❌ Collections missing
- ✅ Solution: Sign up first, check collections

## Next Steps

1. Customize accent color in Settings
2. Create your first preset
3. Start using the timer!
4. Check Report tab to see stats

---

Need help? Check the main [README.md](./README.md) for detailed documentation.
