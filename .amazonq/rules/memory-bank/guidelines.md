# Smart Calendar - Development Guidelines

## Code Quality Standards

### TypeScript Configuration
- **Strict Mode**: Enabled across the entire codebase
- **Target**: ES2022 for modern JavaScript features
- **Module System**: ES modules for both frontend and backend
- **Type Safety**: No implicit `any` types - use explicit types or common interfaces
- **Decorators**: Enabled for Angular dependency injection

### Code Formatting
- **Line Length**: Maximum 100 characters (Prettier configuration)
- **Quotes**: Single quotes for TypeScript/JavaScript
- **Indentation**: 2 spaces (no tabs)
- **Semicolons**: Required at end of statements
- **Trailing Commas**: ES5 style (objects, arrays)

### Naming Conventions

**Files**
- Components: `kebab-case.ts` (e.g., `sidebar.ts`, `event-dialog.ts`)
- Services: `kebab-case.service.ts` (e.g., `api.service.ts`, `auth.service.ts`)
- Models: `kebab-case.model.ts` (e.g., `event.model.ts`, `user.model.ts`)
- Guards: `kebab-case.guard.ts` (e.g., `auth.guard.ts`, `privacy.guard.ts`)
- Pipes: `kebab-case-pipe.ts` (e.g., `date-format-pipe.ts`)
- Tests: `*.spec.ts` or `*.test.ts`
- Routes: `*.routes.ts` (e.g., `auth.routes.ts`, `event.routes.ts`)
- Modules: `*-module.ts` (e.g., `calendar-module.ts`)

**Classes & Interfaces**
- Classes: `PascalCase` (e.g., `SidebarComponentComponent`, `ApiService`)
- Interfaces: `PascalCase` (e.g., `User`, `CalendarEvent`, `ApiResponse`)
- Type Aliases: `PascalCase` (e.g., `AnyObject`, `Callback`)
- Enums: `PascalCase` with UPPER_CASE values

**Variables & Functions**
- Variables: `camelCase` (e.g., `isOpen`, `currentActive`, `searchTerm`)
- Functions: `camelCase` (e.g., `navigateTo`, `updateBadges`, `clearSearch`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MOBILE_BREAKPOINT`, `STORAGE_KEYS`, `RATE_LIMITS`)
- Private members: Prefix with `private` keyword, no underscore needed

**Angular Specific**
- Component selectors: `app-` prefix (e.g., `app-sidebar`, `app-header`)
- Directive selectors: `app` prefix (e.g., `appAutoFocus`, `appClickOutside`)
- Pipe names: `camelCase` (e.g., `dateFormat`, `relativeTime`)

### Documentation Standards

**File Headers**
```typescript
/**
 * Brief description of the file's purpose
 * Smart Calendar - Module/Feature Name
 */
```

**Interface Documentation**
```typescript
// ============================================
// SECTION NAME
// ============================================

export interface InterfaceName {
  /** Property description */
  propertyName: type;
}
```

**Function Documentation**
- Public methods: JSDoc comments with `@param` and `@returns`
- Private methods: Single-line comment if logic is complex
- Self-documenting code preferred over excessive comments

### Import Organization

**Order**
1. Angular core imports
2. Angular feature imports (Router, Forms, etc.)
3. Angular Material imports
4. Third-party libraries
5. RxJS operators
6. Local imports (services, models, components)

**Example**
```typescript
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil, filter } from 'rxjs';
```

## Architectural Patterns

### Component Architecture

**Standalone Components**
- All components use Angular standalone architecture
- Explicit imports in component decorator
- No NgModule declarations needed

**Component Structure**
```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [
    // Angular modules
    FormsModule,
    // Material modules
    MatIconModule,
    MatButtonModule,
    // Other components
  ],
  templateUrl: './component-name.html',
  styleUrls: ['./component-name.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentNameComponent implements OnInit, OnDestroy {
  // Dependency injection using inject()
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Inputs
  @Input() property = defaultValue;

  // Outputs
  @Output() eventName = new EventEmitter<Type>();

  // Public properties
  publicProperty = value;

  // Private properties
  private destroy$ = new Subject<void>();

  // Lifecycle hooks
  ngOnInit() { }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public methods
  publicMethod() { }

  // Private methods
  private privateMethod() { }
}
```

**Change Detection**
- Use `ChangeDetectionStrategy.OnPush` for all components
- Manually trigger change detection with `ChangeDetectorRef.markForCheck()`
- Improves performance by reducing unnecessary checks

**Dependency Injection**
- Use `inject()` function instead of constructor injection
- Cleaner syntax and better tree-shaking
```typescript
private router = inject(Router);
private cdr = inject(ChangeDetectorRef);
```

### Service Architecture

**Service Structure**
```typescript
@Injectable({
  providedIn: 'root'
})
export class ServiceName {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Public methods
  getData(): Observable<Data> {
    return this.http.get<Data>(`${this.apiUrl}/endpoint`);
  }

  // Private helper methods
  private processData(data: Data): ProcessedData {
    // Processing logic
  }
}
```

**State Management**
- Use `BehaviorSubject` for shared state
- Expose state as Observable with `asObservable()`
```typescript
private stateSubject = new BehaviorSubject<State>(initialState);
public state$ = this.stateSubject.asObservable();
```

### Routing Patterns

**Lazy Loading**
- All feature modules are lazy-loaded
- Use `loadComponent` for standalone components
- Use `loadChildren` for feature modules

**Route Configuration**
```typescript
{
  path: 'feature',
  loadComponent: () => import('./feature/feature').then(m => m.FeatureComponent),
  canActivate: [authGuard],
  data: {
    privacyLevel: PrivacyLevel.PRIVATE,
    context: PrivacyContext.PERSONAL_INSIGHTS
  }
}
```

**Guards**
- Functional guards using `CanActivateFn`
- Guards return `boolean | UrlTree | Observable<boolean | UrlTree>`
- Privacy guard checks data access levels

### Backend Patterns

**Express Server Structure**
```typescript
// Middleware order (critical)
1. Security (helmet, compression)
2. Rate limiting
3. CORS
4. Body parsing
5. Request logging
6. Routes
7. 404 handler
8. Error handler (must be last)
```

**Route Organization**
```typescript
// routes/feature.routes.ts
import express from 'express';
import { authenticate } from '../middleware/auth';
import * as controller from '../controllers/feature.controller';

const router = express.Router();

router.get('/', authenticate, controller.getAll);
router.post('/', authenticate, controller.create);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

export default router;
```

**Controller Pattern**
```typescript
export async function controllerMethod(req: Request, res: Response) {
  try {
    const result = await service.method(req.body);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

**Service Layer**
```typescript
export class ServiceName {
  async method(data: InputType): Promise<OutputType> {
    // Business logic
    const result = await database.query();
    return processedResult;
  }
}
```

## Common Code Patterns

### Type Safety

**Avoid `any` - Use Common Interfaces**
```typescript
// ❌ Bad
function process(data: any) { }

// ✅ Good
import { AnyObject } from './core/models/common-interfaces';
function process(data: AnyObject) { }
```

**Generic Types**
```typescript
// API responses
interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

// Usage
const response: ApiResponse<User> = await api.get('/users/1');
```

### RxJS Patterns

**Subscription Management**
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.handleData(data));
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

**Observable Operators**
- Use `pipe()` for operator chaining
- Common operators: `map`, `filter`, `switchMap`, `catchError`, `takeUntil`
- Prefer `switchMap` over `mergeMap` for HTTP requests

### Error Handling

**Frontend**
```typescript
this.service.getData()
  .pipe(
    catchError(error => {
      console.error('Error:', error);
      return of(defaultValue);
    })
  )
  .subscribe(data => this.data = data);
```

**Backend**
```typescript
try {
  const result = await operation();
  res.json({ success: true, data: result });
} catch (error: any) {
  logger.error('Operation failed', { error: error.message });
  res.status(500).json({
    success: false,
    error: 'Operation failed'
  });
}
```

### Performance Optimization

**Component Performance**
- Use `OnPush` change detection
- Implement `trackBy` functions for `*ngFor`
```typescript
trackByNavItem(index: number, item: NavItem): string {
  return item.route;
}
```

**Caching**
```typescript
private cachedValue?: Type;

getValue(): Type {
  if (this.cachedValue !== undefined) {
    return this.cachedValue;
  }
  this.cachedValue = expensiveCalculation();
  return this.cachedValue;
}

private invalidateCache(): void {
  this.cachedValue = undefined;
}
```

**Lazy Loading**
- Feature modules loaded on demand
- Reduces initial bundle size
- Improves application startup time

### Security Patterns

**Authentication**
```typescript
// JWT token storage
localStorage.setItem('token', token);

// Token inclusion in requests
headers: {
  'Authorization': `Bearer ${token}`
}

// Token cleanup on logout
localStorage.removeItem('token');
```

**Input Validation**
```typescript
// Backend validation with Joi
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const { error, value } = schema.validate(req.body);
```

**Rate Limiting**
```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);
```

### Testing Patterns

**Component Tests**
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComponentName, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

**Service Tests**
```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServiceName]
    });
    service = TestBed.inject(ServiceName);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch data', (done) => {
    service.getData().subscribe(data => {
      expect(data).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne('/api/data');
    req.flush({ success: true, data: mockData });
  });
});
```

## Frequently Used Patterns

### Constants Definition
```typescript
const CONSTANT_NAME = value;

const OBJECT_CONSTANTS = {
  KEY_ONE: 'value1',
  KEY_TWO: 'value2'
} as const;
```

### Environment Configuration
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleMapsApiKey: 'key'
};
```

### Logger Usage
```typescript
// Backend
import { logger } from './utils/logger';

logger.info('Message', { context: 'data' });
logger.error('Error message', { error: error.message });
logger.warn('Warning', { details });
```

### Storage Keys
```typescript
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  PREFERENCES: 'preferences'
} as const;

// Usage
localStorage.setItem(STORAGE_KEYS.TOKEN, token);
```

### API Response Format
```typescript
// Success
{
  success: true,
  data: result,
  message?: 'Optional message'
}

// Error
{
  success: false,
  error: 'Error message',
  details?: additionalInfo
}
```

### Navigation Patterns
```typescript
// Simple navigation
this.router.navigate(['/path']);

// With query params
this.router.navigate(['/path'], {
  queryParams: { id: 123, filter: 'active' }
});

// Relative navigation
this.router.navigate(['../sibling'], { relativeTo: this.route });
```

### Form Handling
```typescript
// Template-driven forms
<input [(ngModel)]="property" name="fieldName">

// Reactive forms (when needed)
this.form = this.fb.group({
  field: ['', Validators.required]
});
```

### Material Dialog
```typescript
const dialogRef = this.dialog.open(DialogComponent, {
  width: '500px',
  data: { key: value }
});

dialogRef.afterClosed().subscribe(result => {
  if (result) {
    // Handle result
  }
});
```

## Code Review Checklist

### Before Committing
- [ ] No `any` types (use common interfaces)
- [ ] All imports organized correctly
- [ ] OnPush change detection used
- [ ] Subscriptions properly unsubscribed
- [ ] TrackBy functions for ngFor loops
- [ ] Error handling implemented
- [ ] Loading states managed
- [ ] Accessibility attributes added
- [ ] Tests written/updated
- [ ] No console.log statements (use logger)
- [ ] TypeScript strict mode passes
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting applied

### Security Checklist
- [ ] Input validation on backend
- [ ] Authentication required for protected routes
- [ ] Authorization checks implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized inputs)
- [ ] CSRF tokens where needed
- [ ] Sensitive data encrypted
- [ ] Rate limiting applied

### Performance Checklist
- [ ] Lazy loading for feature modules
- [ ] OnPush change detection
- [ ] TrackBy for lists
- [ ] Caching implemented where beneficial
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] Bundle size monitored

## Common Annotations

### Angular Decorators
```typescript
@Component({ ... })
@Injectable({ providedIn: 'root' })
@Input() property: Type;
@Output() event = new EventEmitter<Type>();
@ViewChild(ElementRef) element: ElementRef;
```

### TypeScript Decorators
```typescript
@deprecated Use newMethod instead
@internal For internal use only
```

### JSDoc Comments
```typescript
/**
 * Method description
 * @param paramName - Parameter description
 * @returns Return value description
 */
```

## Project-Specific Conventions

### Privacy Levels
```typescript
enum PrivacyLevel {
  PUBLIC = 'public',
  SHARED = 'shared',
  PRIVATE = 'private',
  CONFIDENTIAL = 'confidential',
  STEALTH = 'stealth'
}
```

### API Endpoint Structure
- `/api/auth` - Authentication
- `/api/events` - Events management
- `/api/tasks` - Tasks management
- `/api/ai-*` - AI features
- `/api/privacy` - Privacy controls
- `/api/wellness` - Wellness features

### Feature Module Organization
```
feature/
├── components/          # Feature-specific components
├── services/           # Feature-specific services
├── models/             # Feature-specific models
├── feature-module.ts   # Module definition
├── feature-routing-module.ts  # Routing
├── feature.html        # Main template
├── feature.scss        # Main styles
└── feature.ts          # Main component
```

### Responsive Breakpoints
```scss
$mobile: 768px;
$tablet: 1024px;
$desktop: 1440px;
```

### Color Palette
- Primary: Purple gradient
- Accent: Pink/Purple
- Background: Dark with glass morphism
- Text: White/Light gray
- Success: Green (#4CAF50)
- Warning: Orange (#FF9800)
- Error: Red (#F44336)
