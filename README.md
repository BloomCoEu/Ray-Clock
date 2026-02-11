# Ray Clock

A beautiful task timer application built with React Native, Expo, and Appwrite. Manage your tasks, track time, and stay productive with customizable presets and detailed reports.

## Features

✨ **Core Features**
- ⏱️ Task-based timer with pause/resume functionality
- 🎯 Preset task lists (Savers) for repeatable routines
- 📊 Detailed reports showing planned vs actual time spent
- 🎨 Customizable theme and accent colors
- ⚙️ Comprehensive settings for personalizing your experience

✨ **Task Management**
- ➕ Create, edit, and delete tasks
- 🎯 Assign emoji icons to tasks for easy identification
- ⏰ Set custom durations for each task
- 📋 View remaining tasks with durations
- ✅ Track completed tasks and their actual durations

✨ **Presets (Savers)**
- 💾 Create reusable task templates
- 📋 Duplicate existing presets
- 🚀 Quick load presets to main task list

✨ **Settings**
- 🎨 Choose from 13 different accent colors
- 🌙 Auto/Light/Dark theme support
- 🔔 Pie timer option (for <1 hour tasks)
- 🧠 Smart time detection (parse numbers from task names)
- ⏱️ Customizable default task duration

## Tech Stack

- **Frontend**: React Native + TypeScript
- **Framework**: Expo (for iOS/Android builds)
- **Backend**: Appwrite (self-hosted or cloud)
- **State Management**: Zustand
- **Navigation**: Expo Router

## Project Structure

```
ray-clock/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Main tab-based screens
│   │   ├── index.tsx      # Timer/Home screen
│   │   ├── presets.tsx    # Preset lists
│   │   ├── report.tsx     # Analytics/Report
│   │   └── settings.tsx   # App settings
│   └── _layout.tsx        # Root layout with auth
├── components/            # Reusable components
│   ├── auth-screen.tsx    # Login/Signup
│   ├── task-modal.tsx     # Task CRUD modal
│   ├── task-list.tsx      # Task list display
│   ├── timer-display.tsx  # Timer UI
│   └── timer-controls.tsx # Play/Pause controls
├── lib/                   # Core logic
│   ├── appwrite-client.ts # Appwrite setup
│   ├── appwrite-service.ts# Database operations
│   ├── store.ts           # Zustand store
│   └── types.ts           # TypeScript types
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts        # Authentication hook
│   ├── use-timer.ts       # Timer logic
│   └── use-task-completion.ts # Task completion
└── .env.example          # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Appwrite instance (cloud or self-hosted)
- iPhone with Expo Go app (for preview)

### 1. Setup Appwrite Backend

**Option A: Cloud Appwrite**
1. Go to https://cloud.appwrite.io and create a free account
2. Create a new project
3. Note your Project ID and Endpoint URL
4. Create a new database
5. Create 4 collections:
   - `users` - User data
   - `tasks` - Task items
   - `presets` - Preset lists
   - `settings` - User settings

**Option B: Self-Hosted Appwrite**
```bash
docker run -d \
  --name appwrite \
  -p 80:80 \
  -p 443:443 \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume appwrite-ssh:/home/appwrite/ssh \
  --volume appwrite-data:/home/appwrite/data \
  appwrite/appwrite:latest
```

### 2. Install Dependencies

```bash
cd ray-clock
npm install
```

### 3. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your Appwrite credentials:
```
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DB_ID=your_database_id
```

### 4. Run the App

```bash
# Start Expo development server
npm start

# For iOS on Expo Go
# Scan the QR code with your iPhone camera or use the Expo Go app
```

## Usage

### Creating Tasks

1. Tap the "+" button next to "Remaining Tasks"
2. Choose an emoji for the task
3. Enter task name
4. Set duration in minutes
5. Tap "Add Task"

### Starting the Timer

1. Current task displays at the top
2. Tap the play button to start
3. Use ±5 buttons to adjust time
4. Tap skip to move to next task

### Creating Presets

1. Navigate to "Presets" tab
2. Tap "Create Preset"
3. Enter preset name
4. Tasks can be added after creation
5. Tap "Load" on any preset to load tasks

### Viewing Reports

1. Go to "Report" tab
2. See planned vs spent time summary
3. View detailed breakdown of completed tasks
4. Clear history when needed

### Customizing Settings

1. Go to "Settings" tab
2. Choose accent color
3. Select theme (Auto/Light/Dark)
4. Toggle Smart Time Detection
5. Set default task duration

## API Documentation

### Appwrite Database Schema

**Users Collection**
```typescript
{
  email: string
  name: string
  preferences: {
    defaultTime: number
    accentColor: string
    theme: 'light' | 'dark' | 'auto'
    smartTimeDetection: boolean
    pieTimerEnabled: boolean
  }
}
```

**Tasks Collection**
```typescript
{
  userId: string
  title: string
  plannedDuration: number (minutes)
  actualDuration: number
  emoji: string
  completed: boolean
  completedAt?: string
  order: number
}
```

**Presets Collection**
```typescript
{
  userId: string
  name: string
  emoji: string
  tasks: Array<{
    title: string
    plannedDuration: number
    emoji: string
  }>
  totalTime: number
}
```

## Development

### Adding New Features

1. Create GitHub issue describing the feature
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and test
4. Commit with clear messages
5. Push and create Pull Request

### Code Style

- Use TypeScript for type safety
- Follow React hooks patterns
- Use Zustand for state management
- Keep components focused and reusable

### Debugging

```bash
# Open debugger menu
# iOS: Press Cmd + D in simulator
# Android: Press Cmd + M in emulator
```

## Troubleshooting

**Appwrite Connection Issues**
- Check endpoint URL and Project ID
- Ensure CORS is enabled in Appwrite
- Verify database collections exist

**Timer Not Working**
- Check if app has background execution permission
- On iOS: Settings > Ray Clock > Background App Refresh

**Tasks Not Saving**
- Verify user is authenticated
- Check Appwrite database permissions
- Ensure database ID is correct

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include screenshots or error logs

## Roadmap

- [ ] Offline mode support
- [ ] Cloud sync
- [ ] Apple Watch app
- [ ] Siri shortcuts
- [ ] Custom notification sounds
- [ ] Task categories/tags
- [ ] Team/shared presets
- [ ] Weekly statistics
- [ ] Export reports as PDF

---

**Made with ❤️ using React Native + Expo**