import { Routes } from '@angular/router';

// Layouts
import { MainLayout } from './layouts/main-layout/main-layout.component';
import { AuthLayout } from './layouts/auth-layout/auth-layout.component';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { privacyGuard } from './core/guards/privacy.guard';
import { PrivacyLevel, PrivacyContext } from './core/guards/privacy.guard';

// Components - Shared
import { NotFound } from './shared/components/not-found/not-found.component';
import { ErrorComponent } from './shared/components/error/error.component';

export const routes: Routes = [
  // ========== REDIRECT PADRÃO ==========
  { path: '', redirectTo: '/auth', pathMatch: 'full' },

  // ========== ROTAS DE ERRO ==========
  { path: 'error', component: ErrorComponent },

  // ========== ROTAS PÚBLICAS ==========
  {
    path: 'auth',
    component: AuthLayout,
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
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      // Redirect padrão
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
      },

      // ========== NÍVEL PUBLIC ==========
      // Nenhuma rota pública no momento

      // ========== NÍVEL SHARED ==========
      {
        path: 'calendar',
        loadChildren: () =>
          import('./features/calendar/calendar-module').then((m) => m.CalendarModule),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.SHARED,
          context: PrivacyContext.CALENDAR_EVENTS,
        },
      },
      {
        path: 'events',
        loadComponent: () => import('./features/events/events').then((m) => m.EventsComponent),
      },
      {
        path: 'collaboration',
        loadChildren: () =>
          import('./features/collaboration/collaboration-module').then(
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
        loadComponent: () => import('./features/tasks/tasks').then((m) => m.TasksComponent),
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
          import('./features/context-productivity/context-productivity-module').then(
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
          import('./features/advanced-visualization/advanced-visualization-module').then(
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
          import('./features/settings/settings').then((m) => m.SettingsComponent),
      },

      // ========== NÍVEL CONFIDENTIAL ==========
      {
        path: 'ai-assistant',
        loadComponent: () =>
          import('./features/ai-assistant/ai-assistant').then((m) => m.AiAssistantComponent),
      },
      {
        path: 'wellness',
        loadChildren: () =>
          import('./features/wellness/wellness-module').then((m) => m.WellnessModule),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.CONFIDENTIAL,
          context: PrivacyContext.HEALTH_DATA,
        },
      },
      {
        path: 'health-integration',
        loadComponent: () =>
          import('./features/integrations/health/health-module').then((m) => m.HealthHomeComponent),
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
          import('./features/privacy-control/privacy-control-module').then(
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
          import('./features/integrations/integrations-module').then((m) => m.IntegrationsModule),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.SHARED,
        },
      },

      // ========== NOT FOUND ==========
      {
        path: '404',
        component: NotFound,
      },
      {
        path: '**',
        redirectTo: '404',
      },
    ],
  },
];
