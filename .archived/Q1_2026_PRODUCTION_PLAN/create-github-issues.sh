#!/bin/bash

# Script to bulk create GitHub issues for Ray-Clock Production Readiness
# Requires: GitHub CLI (gh) installed and authenticated
# Usage: ./scripts/create-github-issues.sh

set -e

echo "🚀 Creating GitHub Issues for Ray-Clock Production Readiness"
echo "============================================================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo "Run: gh auth login"
    exit 1
fi

# Confirm before creating
echo "This will create 35 issues in the current repository."
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Creating milestones..."

# Create milestones
gh api repos/:owner/:repo/milestones -f title="Phase 1 - Foundation" -f due_on="2026-02-24T23:59:59Z" -f description="Core infrastructure and components" || echo "Milestone may already exist"
gh api repos/:owner/:repo/milestones -f title="Phase 2 - Features" -f due_on="2026-03-10T23:59:59Z" -f description="Enhanced functionality and integrations" || echo "Milestone may already exist"
gh api repos/:owner/:repo/milestones -f title="Phase 3 - Polish" -f due_on="2026-03-24T23:59:59Z" -f description="Testing, quality, and refinement" || echo "Milestone may already exist"
gh api repos/:owner/:repo/milestones -f title="Phase 4 - Launch" -f due_on="2026-03-31T23:59:59Z" -f description="Production deployment and monitoring" || echo "Milestone may already exist"

echo "✅ Milestones created"
echo ""

# Function to create an issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    local milestone="$4"
    
    echo "Creating: $title"
    gh issue create \
        --title "$title" \
        --body "$body" \
        --label "$labels" \
        --milestone "$milestone" || echo "⚠️  Issue may already exist"
}

echo "Creating Phase 1 issues (Foundation)..."
echo ""

# Issue #1
create_issue \
    "Implement Core State Management (Zustand Store)" \
    "## Description
Create the central Zustand store with all state slices for user, tasks, timer, settings, and presets.

## Tasks
- [ ] Create \`/lib/store.ts\` with TypeScript types
- [ ] Implement user state slice (user, setUser, logout)
- [ ] Implement tasks state slice (tasks, currentTaskIndex, setTasks, addTask, updateTask, removeTask)
- [ ] Implement timer state slice (timerIsRunning, elapsedTime, setTimerIsRunning, setElapsedTime)
- [ ] Implement settings state slice (settings, setSettings)
- [ ] Implement presets state slice (presets, completedTasks, setPresets, setCompletedTasks)
- [ ] Add persistence middleware for local storage
- [ ] Add DevTools integration for debugging
- [ ] Write unit tests for store actions

## Acceptance Criteria
- [ ] All state management working
- [ ] Store persists across app restarts
- [ ] TypeScript types properly defined

## Estimate
1 day

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #1" \
    "P0-critical,phase-1,backend,enhancement" \
    "Phase 1 - Foundation"

# Issue #2
create_issue \
    "Implement TypeScript Type Definitions" \
    "## Description
Create comprehensive TypeScript types for all data models used throughout the app.

## Tasks
- [ ] Create \`/lib/types.ts\`
- [ ] Define \`User\` type (matching Appwrite user model)
- [ ] Define \`Task\` type with all fields
- [ ] Define \`Preset\` type with task arrays
- [ ] Define \`Settings\` type with all preferences
- [ ] Define \`PresetTask\` type (embedded in presets)
- [ ] Add utility types (TaskStatus, Theme enum, etc.)
- [ ] Export all types with proper documentation

## Acceptance Criteria
- [ ] All types properly defined
- [ ] No \`any\` types in codebase
- [ ] Types match Appwrite schemas

## Estimate
4 hours

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #2" \
    "P0-critical,phase-1,backend,enhancement" \
    "Phase 1 - Foundation"

# Issue #3
create_issue \
    "Set Up Appwrite Backend Service" \
    "## Description
Implement all Appwrite service methods for authentication and data operations.

## Dependencies
Depends on #2 (Type Definitions)

## Tasks
- [ ] Create \`/lib/appwrite-service.ts\`
- [ ] Initialize Appwrite client with environment variables
- [ ] Create authentication service
- [ ] Create task service (CRUD operations)
- [ ] Create preset service (CRUD + duplicate)
- [ ] Create settings service
- [ ] Add error handling and retry logic
- [ ] Add TypeScript types for all responses
- [ ] Document Appwrite collection schemas needed

## Acceptance Criteria
- [ ] All CRUD operations work
- [ ] Proper error handling implemented
- [ ] API responses typed correctly

## Estimate
1 day

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #3" \
    "P0-critical,phase-1,backend,enhancement" \
    "Phase 1 - Foundation"

# Issue #4
create_issue \
    "Create Appwrite Database Schema" \
    "## Description
Set up Appwrite database collections and configure security rules.

## Dependencies
Depends on #2, #3

## Tasks
- [ ] Create \`tasks\` collection with all attributes
- [ ] Create \`presets\` collection with all attributes
- [ ] Create \`settings\` collection with all attributes
- [ ] Configure read/write permissions (user-specific access)
- [ ] Add indexes for userId fields
- [ ] Create initial database documentation

## Acceptance Criteria
- [ ] All collections created
- [ ] Permissions properly configured
- [ ] Indexes optimize queries

## Estimate
3 hours

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #4" \
    "P0-critical,phase-1,backend,devops" \
    "Phase 1 - Foundation"

# Issue #5
create_issue \
    "Implement Authentication System" \
    "## Description
Build authentication UI and logic with Appwrite integration.

## Dependencies
Depends on #1, #3, #4

## Tasks
- [ ] Create \`/hooks/use-auth.ts\` hook
- [ ] Create \`/components/auth-screen.tsx\` with login/register UI
- [ ] Implement email/password authentication
- [ ] Add form validation
- [ ] Add loading states and error messages
- [ ] Implement session persistence
- [ ] Add 'Forgot Password' flow
- [ ] Implement auto-login on app start
- [ ] Add logout functionality
- [ ] Update root layout to use auth guard

## Acceptance Criteria
- [ ] Users can register and login
- [ ] Sessions persist across restarts
- [ ] Error handling works properly
- [ ] UI matches app design

## Estimate
1 day

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #5" \
    "P0-critical,phase-1,frontend,backend,enhancement" \
    "Phase 1 - Foundation"

# Issue #6
create_issue \
    "Build Timer Display Component" \
    "## Description
Create the main timer display showing countdown, task name, and visual indicators.

## Dependencies
Depends on #1

## Tasks
- [ ] Create \`/components/timer-display.tsx\`
- [ ] Display current task name with emoji
- [ ] Show formatted time (MM:SS or HH:MM:SS)
- [ ] Add visual progress indicator
- [ ] Implement pie timer visualization
- [ ] Add pulsing animation when timer is running
- [ ] Show time over/under planned duration
- [ ] Use accent color from settings
- [ ] Make responsive for different screen sizes
- [ ] Add accessibility labels

## Acceptance Criteria
- [ ] Timer displays correctly
- [ ] Animations smooth (60fps)
- [ ] Visual feedback clear
- [ ] Works on all platforms

## Estimate
1 day

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #6" \
    "P0-critical,phase-1,frontend,enhancement" \
    "Phase 1 - Foundation"

# Issue #7
create_issue \
    "Build Timer Controls Component" \
    "## Description
Create control buttons for play/pause, time adjustment, and skip functionality.

## Dependencies
Depends on #1

## Tasks
- [ ] Create \`/components/timer-controls.tsx\`
- [ ] Add play/pause button with icon toggle
- [ ] Add +1min/-1min adjustment buttons
- [ ] Add skip to next task button
- [ ] Add reset timer button
- [ ] Implement haptic feedback on button press
- [ ] Add disabled states when appropriate
- [ ] Use accent color for primary actions
- [ ] Add confirmation dialog for destructive actions
- [ ] Ensure buttons are touch-friendly (min 44pt)

## Acceptance Criteria
- [ ] All controls functional
- [ ] Haptic feedback works
- [ ] Proper disabled states
- [ ] Accessible touch targets

## Estimate
6 hours

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #7" \
    "P0-critical,phase-1,frontend,enhancement" \
    "Phase 1 - Foundation"

# Issue #8
create_issue \
    "Build Task List Component" \
    "## Description
Create scrollable list showing remaining and completed tasks with reordering.

## Dependencies
Depends on #1

## Tasks
- [ ] Create \`/components/task-list.tsx\`
- [ ] Display tasks with emoji, title, and duration
- [ ] Show current task highlight
- [ ] Implement swipe actions (edit, delete)
- [ ] Add drag-and-drop reordering
- [ ] Show completed tasks with strikethrough
- [ ] Add empty state messaging
- [ ] Implement virtual scrolling for large lists
- [ ] Add pull-to-refresh
- [ ] Use accent color for highlighting

## Acceptance Criteria
- [ ] Tasks display correctly
- [ ] Reordering works smoothly
- [ ] Swipe actions functional
- [ ] Performance good with 100+ tasks

## Estimate
1 day

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #8" \
    "P0-critical,phase-1,frontend,enhancement" \
    "Phase 1 - Foundation"

# Issue #9
create_issue \
    "Build Task Creation/Edit Modal" \
    "## Description
Create modal for adding/editing tasks with emoji picker and time selection.

## Dependencies
Depends on #1

## Tasks
- [ ] Create \`/components/task-modal.tsx\`
- [ ] Add task title input with character limit
- [ ] Implement emoji picker
- [ ] Add planned duration selector
- [ ] Implement smart time detection parsing
- [ ] Add custom time input
- [ ] Show create vs. edit mode
- [ ] Add form validation
- [ ] Implement keyboard avoidance
- [ ] Add save/cancel buttons

## Acceptance Criteria
- [ ] Modal opens/closes smoothly
- [ ] All inputs work correctly
- [ ] Smart time detection functional
- [ ] Validation prevents errors

## Estimate
1 day

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #9" \
    "P0-critical,phase-1,frontend,enhancement" \
    "Phase 1 - Foundation"

# Issue #10
create_issue \
    "Implement Timer Logic Hook" \
    "## Description
Create countdown timer logic with background support and notifications.

## Dependencies
Depends on #1

## Tasks
- [ ] Create \`/hooks/use-timer.ts\`
- [ ] Implement countdown from planned duration
- [ ] Track elapsed time in seconds
- [ ] Sync timer state to Zustand store
- [ ] Add support for time adjustments
- [ ] Implement pause/resume functionality
- [ ] Continue timer in background
- [ ] Trigger haptic feedback on completion
- [ ] Play completion sound (optional)
- [ ] Save actual duration to task on completion

## Acceptance Criteria
- [ ] Timer counts down accurately
- [ ] Background mode works
- [ ] State syncs correctly
- [ ] Completion events fire

## Estimate
1 day

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #10" \
    "P0-critical,phase-1,backend,enhancement" \
    "Phase 1 - Foundation"

# Issue #11
create_issue \
    "Implement Task Completion Logic" \
    "## Description
Handle task completion flow including duration tracking and auto-advance.

## Dependencies
Depends on #10

## Tasks
- [ ] Create \`/hooks/use-task-completion.ts\`
- [ ] Listen for timer completion events
- [ ] Mark current task as completed
- [ ] Save actual duration to database
- [ ] Move to next task automatically
- [ ] Show completion celebration
- [ ] Handle last task completion
- [ ] Add option to undo completion
- [ ] Update task order after completion
- [ ] Sync completed tasks to database

## Acceptance Criteria
- [ ] Tasks complete automatically
- [ ] Data saves correctly
- [ ] Auto-advance works
- [ ] Undo functionality available

## Estimate
4 hours

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #11" \
    "P1-high,phase-1,backend,enhancement" \
    "Phase 1 - Foundation"

# Issue #12
create_issue \
    "Create Theme/Constants Files" \
    "## Description
Centralize theme colors, spacing, and design tokens.

## Tasks
- [ ] Create \`/constants/theme.ts\`
- [ ] Define color palettes (light/dark)
- [ ] Define spacing scale
- [ ] Define typography scale
- [ ] Define border radius values
- [ ] Define shadow/elevation styles
- [ ] Export Colors object used in tab layout
- [ ] Add theme type definitions
- [ ] Document usage guidelines

## Acceptance Criteria
- [ ] All design tokens centralized
- [ ] Dark mode colors defined
- [ ] Consistent spacing used
- [ ] Documentation clear

## Estimate
3 hours

## Reference
See PRODUCTION_READINESS_PLAN.md - Issue #12" \
    "P1-high,phase-1,frontend,enhancement" \
    "Phase 1 - Foundation"

echo ""
echo "✅ Phase 1 issues created!"
echo ""
echo "📝 Note: Phase 2-4 issues should be created as Phase 1 nears completion."
echo "   See PRODUCTION_READINESS_PLAN.md for full details on all 35 issues."
echo ""
echo "🎯 Next steps:"
echo "   1. Review created issues"
echo "   2. Assign team members"
echo "   3. Set up GitHub Project board"
echo "   4. Start with Issue #1 and #2"
echo ""
echo "✨ Done!"
