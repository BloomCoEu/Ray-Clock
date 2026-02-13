# Contributing to Ray Clock

Thank you for your interest in contributing to Ray Clock! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the Repository**
   - Fork the Ray Clock repository to your GitHub account
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR_USERNAME/Ray-Clock.git
     cd Ray-Clock
     ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/BloomCoEu/Ray-Clock.git
   ```

## Development Setup

1. **Prerequisites**
   - Node.js 18+ and npm
   - Expo CLI (`npm install -g expo-cli`)
   - An Appwrite account (free at [cloud.appwrite.io](https://cloud.appwrite.io))
   - iOS Simulator (Mac) or Android Emulator

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Follow [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) to configure Appwrite
   - Add your Appwrite credentials to `.env`

4. **Start Development Server**
   ```bash
   npm start
   ```

## Development Workflow

### Creating a New Feature

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, maintainable code
   - Follow the coding standards below
   - Test your changes thoroughly

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch and provide a clear description

### Commit Message Format

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat: add push notifications support
fix: resolve timer pause issue on iOS
docs: update APPWRITE_SETUP.md with new instructions
```

## Coding Standards

### TypeScript

- **Always use TypeScript** - No `any` types unless absolutely necessary
- Define interfaces and types in `lib/types.ts`
- Use strict mode for better type safety

### React Native & Expo

- **Use Functional Components** - Prefer hooks over class components
- **Use Tamagui** - For UI components, use Tamagui instead of React Native StyleSheet
- Follow the [Tamagui Migration Guide](./TAMAGUI_MIGRATION.md)

### Component Structure

```tsx
// components/example-component.tsx
import { YStack, Text } from 'tamagui';

interface ExampleComponentProps {
  title: string;
  onPress?: () => void;
}

export function ExampleComponent({ title, onPress }: ExampleComponentProps) {
  return (
    <YStack padding="$4" onPress={onPress}>
      <Text fontSize="$6" fontWeight="600">
        {title}
      </Text>
    </YStack>
  );
}
```

### State Management

- Use **Zustand** for global state
- Add state slices in `lib/store.ts`
- Use React hooks (`useState`, `useEffect`) for local component state

### File Organization

```
app/           # App screens and navigation
components/    # Reusable UI components
hooks/         # Custom React hooks
lib/           # Core utilities and services
  ├── store.ts           # Zustand state management
  ├── types.ts           # TypeScript type definitions
  └── appwrite-service.ts # Backend API integration
```

### Naming Conventions

- **Files**: kebab-case (`task-list.tsx`, `use-auth.ts`)
- **Components**: PascalCase (`TaskList`, `TimerDisplay`)
- **Functions/Variables**: camelCase (`handlePress`, `isRunning`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMER_DURATION`)

### Code Style

```typescript
// Good
const tasks = useTasks();
const handleDelete = (id: string) => {
  deleteTasks(id);
};

// Bad
const Tasks = useTasks();
const delete_task = (id: string) => {
  deleteTasks(id);
}
```

### Linting

Run ESLint before committing:
```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npm run lint -- --fix
```

## Submitting Changes

### Pull Request Guidelines

1. **Ensure Tests Pass**
   - Run `npm run lint` to check for linting errors
   - Test on iOS, Android, and Web if possible

2. **Update Documentation**
   - Update README.md if adding new features
   - Update relevant documentation files
   - Add JSDoc comments for complex functions

3. **Keep PRs Focused**
   - One feature or fix per PR
   - Keep changes small and reviewable
   - Link related issues in the PR description

4. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring

   ## Testing
   - [ ] Tested on iOS
   - [ ] Tested on Android
   - [ ] Tested on Web

   ## Screenshots (if applicable)
   [Add screenshots here]

   ## Related Issues
   Fixes #123
   ```

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Description** - Clear description of the bug
2. **Steps to Reproduce** - Detailed steps to reproduce the issue
3. **Expected Behavior** - What you expected to happen
4. **Actual Behavior** - What actually happened
5. **Environment**
   - OS (iOS/Android/Web)
   - Device/Emulator
   - Expo SDK version
   - App version

### Feature Requests

For feature requests, please include:

1. **Problem Statement** - What problem does this solve?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Any alternative solutions you've considered
4. **Additional Context** - Screenshots, mockups, or examples

## Questions?

- Check the [README.md](./README.md) for project overview
- Review [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) for backend setup
- See [TAMAGUI_MIGRATION.md](./TAMAGUI_MIGRATION.md) for UI guidelines
- Open an issue for questions or clarifications

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to Ray Clock!** 🎉
