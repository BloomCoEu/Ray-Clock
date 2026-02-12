# Ray Clock ⏰

A beautiful and intuitive time management app built with React Native and Expo.

## Features

- ✅ **Task Management**: Create, edit, and organize your tasks
- ⏱️ **Timer Functionality**: Track time spent on each task
- 📊 **Analytics & Reports**: View planned vs actual time spent
- 🎨 **Customizable**: Choose from 13 accent colors and theme options
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- ☁️ **Cloud Sync**: Powered by Appwrite for seamless data synchronization
- 🎯 **Preset Lists**: Save and reuse common task lists (SAVERS, Morning routine, etc.)

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- An Appwrite account (free at [cloud.appwrite.io](https://cloud.appwrite.io))

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/BloomCoEu/Ray-Clock.git
   cd Ray-Clock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Appwrite**
   
   Follow the detailed setup guide in [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) to:
   - Create an Appwrite project
   - Set up database and collections
   - Configure environment variables

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator, `a` for Android emulator, `w` for web

## Configuration

Create a `.env` file in the root directory with your Appwrite credentials:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID=your_tasks_collection_id
EXPO_PUBLIC_APPWRITE_PRESETS_COLLECTION_ID=your_presets_collection_id
EXPO_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID=your_settings_collection_id
APPWRITE_API_KEY=your_server_api_key # Optional: required for schema update script
```

See [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) for detailed instructions.

## Project Structure

```
Ray-Clock/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── index.tsx      # Main task list and timer
│   │   ├── presets.tsx    # Preset lists management
│   │   ├── settings.tsx   # App settings
│   │   ├── report.tsx     # Analytics and reports
│   │   └── explore.tsx    # Help and information
│   └── _layout.tsx        # Root layout with auth
├── components/            # Reusable UI components
│   ├── auth-screen.tsx   # Login/signup screen
│   ├── task-list.tsx     # Task list component
│   ├── task-modal.tsx    # Task creation/edit modal
│   ├── timer-display.tsx # Timer display component
│   └── timer-controls.tsx # Timer control buttons
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts       # Authentication logic
│   ├── use-timer.ts      # Timer functionality
│   └── use-task-completion.ts # Task completion handling
├── lib/                   # Core utilities and services
│   ├── appwrite-service.ts # Appwrite API integration
│   ├── store.ts          # Zustand state management
│   └── types.ts          # TypeScript type definitions
└── package.json
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run appwrite:add-properties` - Add missing Appwrite collection attributes

## Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Backend**: Appwrite
- **Navigation**: Expo Router
- **UI**: React Native components + Expo Vector Icons

## Features in Detail

### Timer Functionality
- Start/pause/resume timer for each task
- Adjust time with -5/+5 minute buttons
- Visual countdown display
- Haptic feedback on task completion
- Automatic progression to next task

### Task Management
- Create tasks with custom emojis and durations
- Edit and delete tasks
- Mark tasks as complete
- Track actual vs planned time
- Smart time detection from task titles

### Settings
- 13 customizable accent colors
- Theme selection (Auto, Light, Dark)
- Pie timer toggle for tasks ≤ 1 hour
- Smart time detection
- Default timer duration

### Preset Lists
- Create reusable task templates
- Load presets to main task list
- Duplicate and edit presets
- See total time and task count

### Reports & Analytics
- Planned vs spent time comparison
- Completed tasks history
- Remaining tasks overview
- Clear completed tasks

## Known Issues

- **expo-av dependency**: Audio feedback has been temporarily disabled to avoid Metro bundler issues in Codespace environments. Users can re-enable it after resolving the dependency issue.

## Roadmap

- [ ] Push notifications for task reminders
- [ ] Android platform testing and optimization
- [ ] Physical device testing via Expo Tunnel
- [ ] Additional preset templates
- [ ] Data export functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) for setup help

## Acknowledgments

Built with ❤️ using Expo and Appwrite
