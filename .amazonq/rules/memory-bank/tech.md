# Smart Calendar - Technology Stack

## Programming Languages

### TypeScript 5.8.0
- Primary language for both frontend and backend
- Strict type checking enabled
- ES2022 target compilation
- Decorators and metadata reflection enabled

### JavaScript (ES2022)
- Migration scripts and configuration files
- Service worker implementation

### HTML5 & SCSS
- Angular templates with semantic HTML
- SCSS with design tokens and mixins
- CSS custom properties for theming

## Frontend Stack

### Core Framework
- **Angular 20.3.16** - Main framework
  - Standalone components architecture
  - Signals for reactive state
  - Dependency injection
  - RxJS 7.8.0 for reactive programming

### UI Framework
- **Angular Material 20.2.14** - UI component library
  - Material Design 3 components
  - CDK for advanced behaviors
  - Theming system with custom palettes

### Additional Libraries
- **@angular/animations 20.3.16** - Animation system
- **@angular/cdk 20.2.14** - Component Dev Kit
- **@angular/forms 20.3.16** - Reactive and template-driven forms
- **@angular/router 20.3.16** - Client-side routing
- **chart.js 4.5.1** - Data visualization charts
- **date-fns 4.1.0** - Date manipulation and formatting
- **@fortawesome/fontawesome-free 6.5.1** - Icon library
- **google-auth-library 10.4.1** - Google OAuth integration
- **zone.js 0.15.1** - Change detection

### Development Tools
- **@angular/cli 20.3.14** - CLI tooling
- **@angular/build 20.3.14** - Build system (esbuild-based)
- **TypeScript 5.8.0** - Type checking and compilation
- **ESLint 9.39.1** - Code linting
- **angular-eslint 19.2.19** - Angular-specific linting rules
- **typescript-eslint 8.46.4** - TypeScript ESLint integration

### Testing
- **Jasmine 5.9.0** - Testing framework
- **Karma 6.4.0** - Test runner
- **karma-chrome-launcher 3.2.0** - Chrome browser launcher
- **karma-coverage 2.2.0** - Code coverage
- **karma-jasmine 5.1.0** - Jasmine adapter
- **karma-jasmine-html-reporter 2.1.0** - HTML test reporter

### Code Quality
- **Prettier** - Code formatting
  - Print width: 100
  - Single quotes
  - Angular HTML parser

## Backend Stack

### Runtime & Framework
- **Node.js >= 18.0.0** - JavaScript runtime
- **Express 4.18.2** - Web framework
- **TypeScript 5.3.3** - Type safety

### Database
- **PostgreSQL 15+** - Relational database
- **pg 8.11.3** - PostgreSQL client for Node.js

### Authentication & Security
- **jsonwebtoken 9.0.2** - JWT token generation/verification
- **bcryptjs 2.4.3** - Password hashing (10 rounds)
- **helmet 7.2.0** - Security headers middleware
- **cors 2.8.5** - Cross-origin resource sharing
- **express-rate-limit 7.1.5** - Rate limiting (100 req/15min)
- **express-validator 7.2.1** - Request validation
- **joi 18.0.2** - Schema validation

### OAuth Integration
- **passport 0.7.0** - Authentication middleware
- **passport-google-oauth20 2.0.0** - Google OAuth strategy
- **passport-microsoft 1.0.0** - Microsoft OAuth strategy

### Utilities
- **axios 1.13.2** - HTTP client
- **dotenv 16.3.1** - Environment variable management
- **compression 1.8.1** - Response compression

### Development Tools
- **ts-node 10.9.2** - TypeScript execution
- **@types/*** - TypeScript type definitions
- **diff 8.0.3** - Text diffing utility

### Testing
- **Jest 29.5.0** - Testing framework
- **ts-jest 29.1.0** - TypeScript preprocessor for Jest
- **@types/jest 29.5.0** - Jest type definitions

## Build System

### Frontend Build
- **Angular CLI** with esbuild
- **Vite-based dev server** for fast HMR
- **Application bundler** for optimized production builds
- **Tree shaking** for dead code elimination
- **Code splitting** with lazy-loaded modules
- **AOT compilation** for production

### Backend Build
- **TypeScript compiler (tsc)** for transpilation
- **Source maps** for debugging
- **ES modules** output format

## Development Commands

### Frontend (from `smart-calendar/` directory)

```bash
# Development server (http://localhost:4200)
npm start
# or
ng serve

# Production build
npm run build
# or
ng build

# Watch mode (auto-rebuild on changes)
npm run watch
# or
ng build --watch --configuration development

# Run tests
npm test
# or
ng test

# Lint code
npm run lint
# or
ng lint

# Angular CLI commands
npm run ng -- <command>
```

### Backend (from `smart-calendar/backend/` directory)

```bash
# Development server with auto-reload
npm run dev
# Uses: npx ts-node src/server.ts

# Production start (runs migrations first)
npm start
# Uses: node migrate.js && node start.js

# Build TypeScript to JavaScript
npm run build
# Uses: tsc

# Database migrations
npm run migrate
# Uses: node migrate.js

# Full database setup
npm run migrate-full
# Uses: npx ts-node src/scripts/setup-database.ts

# Create test user
npm run create-test-user
# Uses: npx ts-node src/scripts/create-test-user.ts

# Ensure test user exists
npm run ensure-test-user
# Uses: npx ts-node src/scripts/ensure-test-user.ts

# Run tests
npm test
# Uses: jest

# Watch mode tests
npm run test:watch
# Uses: jest --watch

# Test coverage
npm run test:coverage
# Uses: jest --coverage
```

## Environment Configuration

### Frontend Environment Files
- `src/environments/environment.ts` - Development config
- `src/environments/environment.prod.ts` - Production config

**Configuration includes:**
- API base URL
- Google Maps API key
- OAuth redirect URIs
- Feature flags

### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database
# OR separate variables:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_calendar
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=refresh-token-secret

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4200

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Database Management

### Migrations
- Custom migration system in `migrate.js`
- SQL migration files in `backend/migrations/`
- Version tracking in database
- Automatic execution on deployment

### Connection Pooling
- PostgreSQL connection pool
- Configurable pool size
- Automatic reconnection
- Query timeout handling

## PWA Configuration

### Service Worker
- Custom service worker in `src/service-worker.js`
- Offline-first caching strategy
- Background sync for data updates
- Push notification support

### Manifest
- `src/manifest.json` - PWA manifest
- App icons and splash screens
- Display mode: standalone
- Theme colors and branding

## API Documentation

### OpenAPI Specification
- `backend/openapi.yaml` - API documentation
- RESTful endpoint definitions
- Request/response schemas
- Authentication requirements

## Version Control

### Git Configuration
- `.gitignore` files for frontend and backend
- Excludes: node_modules, dist, .env, build artifacts
- Includes: source code, configs, documentation

## Deployment Targets

### Frontend
- **Netlify** (recommended)
  - Automatic builds from Git
  - CDN distribution
  - HTTPS by default
  - Environment variable management

### Backend
- **Render.com** (recommended)
  - PostgreSQL database hosting
  - Automatic deployments
  - Environment variable management
  - Health checks and monitoring

### Alternative Platforms
- **Frontend**: Vercel, GitHub Pages, AWS S3 + CloudFront, Firebase Hosting
- **Backend**: Railway.app, Fly.io, Heroku, AWS EC2/ECS, DigitalOcean

## Performance Optimizations

### Frontend
- Lazy loading of feature modules
- OnPush change detection strategy
- Virtual scrolling for large lists
- Image optimization and lazy loading
- Service worker caching
- Bundle size optimization

### Backend
- Database query optimization with indexes
- Response compression (gzip)
- Connection pooling
- Caching strategies
- Rate limiting to prevent abuse

## Security Features

### Frontend
- Content Security Policy headers
- XSS protection
- CSRF token handling
- Secure cookie settings
- Input sanitization

### Backend
- Helmet security headers
- CORS configuration
- SQL injection prevention (parameterized queries)
- Password hashing with bcrypt
- JWT with RSA keys
- Rate limiting per IP
- Request validation with Joi

## Browser Support

### Minimum Requirements
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

### Progressive Enhancement
- Core functionality works without JavaScript
- Graceful degradation for older browsers
- Polyfills for missing features
