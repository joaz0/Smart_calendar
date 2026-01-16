# Smart Calendar - Project Structure

## Overview
Smart Calendar is a monorepo containing an Angular frontend and Node.js backend, organized with clear separation of concerns and modular architecture.

## Root Structure

```
smart-calendar/
├── .amazonq/rules/memory-bank/     # AI assistant memory bank
├── .github/                         # GitHub configurations
├── smart-calendar/                  # Main application directory
│   ├── backend/                     # Node.js + Express API
│   ├── src/                         # Angular frontend
│   ├── n8n-nodes-agenda-rapido/    # n8n integration nodes
│   └── public/                      # Static assets
├── Documentation files (*.md)       # Project documentation
└── Configuration files              # Root configs
```

## Frontend Architecture (Angular)

### Core Layer (`src/app/core/`)
Foundation layer containing essential services, models, and utilities.

**Components** (`core/components/`)
- Base classes for forms, lists, modals, and components
- Provides reusable component patterns

**Guards** (`core/guards/`)
- `auth.guard.ts` - Authentication protection
- `privacy.guard.ts` - Privacy-based route protection

**Interceptors** (`core/interceptors/`)
- `auth.interceptor.ts` - JWT token injection
- `error.interceptor.ts` - Global error handling
- `loading.interceptor.ts` - Loading state management

**Models** (`core/models/`)
Organized by domain:
- `ai/` - AI suggestion, training data, context patterns, habit patterns, NLP commands, productivity scores
- `collaboration/` - Availability status, insights, contacts, delegated tasks, scheduling polls, team calendars
- `context/` - Habit tracking models
- `visualization/` - Energy levels, project timelines, relationship maps, semantic search, time analytics
- `wellness/` - Break suggestions, burnout indicators, health integration, stress levels, wellness metrics
- Core models: `event.model.ts`, `task.model.ts`, `user.model.ts`, `category.model.ts`, `notification.model.ts`, `recurrence.model.ts`
- Common interfaces and types

**Services** (`core/services/`)
50+ services organized by domain:

- **AI Services** (`ai/`)
  - AI assistant, scheduling, summaries
  - Context prediction, habit analysis
  - Intelligent tasking, meeting moderation
  - Natural language processing, travel time AI

- **Collaboration Services** (`collaboration/`)
  - Analytics, contact integration
  - Quick links, real-time availability
  - Scheduling polls, task delegation
  - Team calendar management

- **Context Services** (`context/`)
  - Context blocks, context switching
  - Event templates, focus mode
  - Habit tracking, productivity analysis
  - Timestamp notes

- **Integration Services** (`integrations/`)
  - Google Calendar, health platforms
  - Maps, messaging, video conferencing
  - Document integration, contact sync
  - n8n workflows, webhooks

- **Privacy Services** (`privacy/`)
  - Backup/migration, digital inheritance
  - Encryption, event camouflage
  - Multiple calendars, off-grid mode
  - Privacy management

- **Visualization Services** (`visualization/`)
  - Data visualization, energy views
  - Insight generation, project timelines
  - Relationship mapping, semantic search
  - Time analytics

- **Wellness Services** (`wellness/`)
  - Active breaks, burnout detection
  - Health apps integration, stress monitoring
  - Personal time guard, wellness analytics
  - Wind-down scheduling

- **Core Services**
  - API communication, authentication
  - Calendar, categories, events, tasks
  - Caching, offline support, PWA
  - Notifications, sync, theme management

**Utilities** (`core/utils/`)
- Logger with configurable levels
- Custom validators

### Features Layer (`src/app/features/`)
Feature modules implementing business functionality.

**Advanced Visualization** (`advanced-visualization/`)
- Energy week calendar
- Personal insights reports
- Project timeline view
- Relationship mapper chart
- Semantic search interface
- Time analytics dashboard

**AI Assistant** (`ai-assistant/`)
- AI scheduling assistant
- AI suggestions panel
- Daily AI summary
- Intelligent task scheduler
- Meeting moderator
- Travel time calculator

**Analytics** (`analytics/`)
- Analytics dashboard and reports

**Authentication** (`auth/`)
- OAuth callback handling

**Calendar** (`calendar/`)
- Multiple calendar views: month, week, day, agenda
- Event and task dialogs
- Day details dialog
- Calendar view switcher

**Categories** (`categories/`)
- Category list and form components
- Category management

**Collaboration** (`collaboration/`)
- Collaboration dashboard
- Quick links manager
- Real-time availability view
- Scheduling poll creator
- Task delegation panel
- Team calendar overview

**Context & Productivity** (`context-productivity/`)
- Context blocks editor
- Event template library
- Focus mode manager
- Habit tracking dashboard
- Meeting notes with timestamps
- Pomodoro timer
- Productivity insights

**Dashboard** (`dashboard/`)
- Main dashboard view

**Events** (`events/`)
- Event list, form, details
- Recurrence settings

**Integrations** (`integrations/`)
- Contact sync settings
- Document attachment manager
- Health apps connector
- Map integration panel
- Messaging settings
- Video call quick add

**Privacy Control** (`privacy-control/`)
- Backup/migration wizard
- Digital inheritance setup
- Event camouflage settings
- Multiple calendars manager
- Off-grid mode toggle
- Privacy control center

**Settings** (`settings/`)
- Application settings

**Tasks** (`tasks/`)
- Task list, form, item
- Priority indicator

**Wellness** (`wellness/`)
- Active breaks reminder
- Burnout detector dashboard
- Health integration settings
- Personal time guardian
- Wellness report
- Wind-down scheduler

### Shared Layer (`src/app/shared/`)
Reusable components, directives, and pipes.

**Components** (`shared/components/`)
- Category picker, color picker
- Confirm dialog, empty state
- Error, glass card
- Header, loading spinner
- Not found, search bar
- Sidebar, skeleton loader
- Theme toggle

**Directives** (`shared/directives/`)
- Auto focus, click outside
- Drag and drop, infinite scroll
- Tooltip

**Pipes** (`shared/pipes/`)
- Category filter, date format
- Duration format, priority color
- Relative time, search highlight
- Time format

### Layouts Layer (`src/app/layouts/`)
Application layout templates.

- `auth-layout/` - Authentication pages layout
- `main-layout/` - Main application layout with sidebar and header

### Utilities Layer (`src/app/utils/`)
Helper functions and utilities.

- AI utilities, collaboration utilities
- Color utilities, context analysis
- Data visualization, date utilities
- Import/export, integration utilities
- Natural language processing
- Notification, privacy utilities
- Recurrence, retry utilities
- Validation, wellness calculations

## Backend Architecture (Node.js)

### Configuration (`backend/src/config/`)
- `constants.ts` - Application constants
- `database.ts` - PostgreSQL connection
- `jwt.ts` - JWT configuration with RSA keys

### Controllers (`backend/src/controllers/`)
Request handlers for API endpoints:
- AI commands, suggestions, training
- Categories, events, tasks
- n8n integration
- Privacy settings
- Productivity analytics

### Middleware (`backend/src/middleware/`)
- `auth.ts` - JWT authentication
- `error-middleware.ts` - Error handling
- `request-logger.ts` - Request logging

### Routes (`backend/src/routes/`)
20+ route definitions:
- AI: commands, suggestions, training
- Wellness: breaks, burnout, wind-down
- Productivity: daily summary, focus mode, habits
- Collaboration: scheduling polls, task delegation
- Core: auth, events, tasks, categories
- Privacy, OAuth, n8n integration
- Smart scheduler, user management

### Services (`backend/src/services/`)
Business logic layer:
- Active breaks, AI assistant
- Burnout detector, daily summary
- Focus mode, habits tracking
- n8n integration, scheduling polls
- Smart scheduler, task delegation
- Travel time, wind-down scheduler

**Tests** (`services/__tests__/`)
- Unit tests for core services
- Jest test framework

### Scripts (`backend/src/scripts/`)
Database and setup utilities:
- Database setup and migrations
- Test user creation
- Feature additions
- Password reset

### Types (`backend/src/types/`)
- TypeScript type definitions

### Utils (`backend/src/utils/`)
- Error handler, logger
- Response formatter, validators

### Entry Point
- `server.ts` - Express server initialization

## Database Structure

PostgreSQL database with 15+ tables:
- **Core**: users, events, tasks, categories
- **AI**: ai_insights, ai_training_data, context_patterns
- **Collaboration**: shared_calendars, delegated_tasks, scheduling_polls
- **Privacy**: privacy_settings, encrypted_backups
- **Wellness**: wellness_data, burnout_metrics, break_reminders
- **Productivity**: habit_tracking, focus_sessions, productivity_scores

## Integration Layer

### n8n Nodes (`n8n-nodes-agenda-rapido/`)
Custom n8n nodes for workflow automation:
- Credentials management
- Node implementations
- Installation guide

## Configuration Files

### Frontend
- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `eslint.config.js` - Linting rules
- `pwa-config.json` - PWA settings

### Backend
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `migrate.js` - Database migration runner
- `openapi.yaml` - API documentation

### Deployment
- `netlify.toml` - Netlify configuration
- `render.yaml` - Render.com configuration
- `.env.netlify` - Netlify environment variables

## Architectural Patterns

### Frontend Patterns
- **Feature Modules**: Lazy-loaded feature modules for code splitting
- **Smart/Dumb Components**: Container and presentation component separation
- **Service Layer**: Business logic in services, not components
- **Reactive Programming**: RxJS observables for async operations
- **State Management**: Service-based state with BehaviorSubjects
- **Dependency Injection**: Angular DI for loose coupling

### Backend Patterns
- **MVC Architecture**: Model-View-Controller separation
- **Service Layer**: Business logic isolated from controllers
- **Repository Pattern**: Data access abstraction
- **Middleware Chain**: Request processing pipeline
- **Error Handling**: Centralized error middleware
- **Validation**: Joi schemas for request validation

### Security Patterns
- **JWT Authentication**: Token-based auth with refresh tokens
- **RSA Encryption**: Public/private key pairs for JWT
- **Rate Limiting**: Request throttling per IP
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers middleware
- **Input Validation**: Sanitization and validation at entry points

### Data Flow
1. User interaction in component
2. Component calls service method
3. Service makes HTTP request via API service
4. Backend route receives request
5. Middleware validates and authenticates
6. Controller processes request
7. Service executes business logic
8. Database query/update
9. Response formatted and returned
10. Frontend service updates state
11. Component receives update via observable
12. View updates automatically
