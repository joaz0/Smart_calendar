import { Routes } from '@angular/router';

// Layouts
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { privacyGuard } from './core/guards/privacy.guard';
import { PrivacyLevel, PrivacyContext } from './core/guards/privacy.guard';

// Components - Shared
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ErrorComponent } from './shared/components/error/error.component';

export const routes: Routes = [
  // ========== REDIRECT PADRÃO ==========
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'dashboard', redirectTo: '/app/dashboard', pathMatch: 'full' },
  { path: 'calendar', redirectTo: '/app/calendar', pathMatch: 'full' },
  { path: 'tasks', redirectTo: '/app/tasks', pathMatch: 'full' },
  { path: 'auth/login', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth/register', redirectTo: '/auth', pathMatch: 'full' },

  // ========== ROTAS DE ERRO ==========
  { path: 'error', component: ErrorComponent },

  // ========== ROTAS PÚBLICAS ==========
  {
    path: 'auth',
    component: AuthLayoutComponent,
  },
  {
    path: 'auth/callback/google',
    loadComponent: () =>
      import('./features/auth/callback/callback.component').then((m) => m.AuthCallbackComponent),
  },
  {
    path: 'auth/callback/microsoft',
    loadComponent: () =>
      import('./features/auth/callback/callback.component').then((m) => m.AuthCallbackComponent),
  },

  // ========== ROTAS PROTEGIDAS ==========
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // Redirect padrão
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },

      // ========== NÍVEL PUBLIC ==========
      // Nenhuma rota pública no momento

      // ========== NÍVEL SHARED ==========
      {
        path: 'calendar',
        loadChildren: () =>
          import('./features/calendar/calendar.module').then((m) => m.CalendarModule),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.SHARED,
          context: PrivacyContext.CALENDAR_EVENTS,
        },
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/events/events.component').then((m) => m.EventsComponent),
      },
      {
        path: 'collaboration',
        loadChildren: () =>
          import('./features/collaboration/collaboration.module').then(
            (m) => m.CollaborationModule
          ),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.SHARED,
          context: PrivacyContext.COLLABORATION,
        },
      },

      // ========== NÍVEL PRIVATE ==========
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/tasks.component').then((m) => m.TasksComponent),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.routes').then((m) => m.categoriesRoutes),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.PRIVATE,
          context: PrivacyContext.PERSONAL_INSIGHTS,
        },
      },
      {
        path: 'productivity',
        loadChildren: () =>
          import('./features/context-productivity/context-productivity.module').then(
            (m) => m.ContextProductivityModule
          ),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.PRIVATE,
          context: PrivacyContext.PERSONAL_INSIGHTS,
        },
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('./features/advanced-visualization/advanced-visualization.module').then(
            (m) => m.AdvancedVisualizationModule
          ),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.PRIVATE,
          context: PrivacyContext.PERSONAL_INSIGHTS,
          requiresEncryption: true,
        },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.PRIVATE,
          context: PrivacyContext.PERSONAL_INSIGHTS,
        },
      },

      // ========== NÍVEL CONFIDENTIAL ==========
      {
        path: 'ai-assistant',
        loadComponent: () =>
          import('./features/ai-assistant/ai-assistant.component').then(
            (m) => m.AiAssistantComponent
          ),
      },
      {
        path: 'wellness',
        loadChildren: () =>
          import('./features/wellness/wellness.module').then((m) => m.WellnessModule),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.CONFIDENTIAL,
          context: PrivacyContext.HEALTH_DATA,
        },
      },
      {
        path: 'health-integration',
        loadComponent: () =>
          import('./features/integrations/health/health-home.component').then(
            (m) => m.HealthHomeComponent
          ),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.CONFIDENTIAL,
          context: PrivacyContext.HEALTH_DATA,
          requiresEncryption: true,
        },
      },

      // ========== NÍVEL STEALTH ==========
      {
        path: 'privacy',
        loadChildren: () =>
          import('./features/privacy-control/privacy-control.module').then(
            (m) => m.PrivacyControlModule
          ),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.STEALTH,
          context: PrivacyContext.BACKUP_DATA,
          allowOffGrid: true,
        },
      },

      // ========== INTEGRAÇÕES (Mixed Levels) ==========
      {
        path: 'integrations',
        loadChildren: () =>
          import('./features/integrations/integrations.module').then((m) => m.IntegrationsModule),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.SHARED,
        },
      },
      {
        path: 'coming-soon',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon.component').then(
            (m) => m.ComingSoonComponent
          ),
      },
      {
        path: 'coming-soon/:feature',
        loadComponent: () =>
          import('./shared/components/coming-soon/coming-soon.component').then(
            (m) => m.ComingSoonComponent
          ),
      },

      // ========== NOT FOUND ==========
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: '**',
        redirectTo: '404',
      },
    ],
  },
];
