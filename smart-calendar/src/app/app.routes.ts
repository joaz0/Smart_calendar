import { Routes } from '@angular/router';

// Layouts
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { privacyGuard } from './core/guards/privacy.guard';
import { PrivacyLevel, PrivacyContext } from './core/guards/privacy.guard';

// Components - Shared
import { NotFound } from './shared/components/not-found/not-found';

export const routes: Routes = [
  // ========== ROTAS PÚBLICAS ==========
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password').then((m) => m.ResetPassword),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  // ========== ROTAS PROTEGIDAS ==========
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      // Redirect padrão
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },

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
        loadChildren: () => import('./features/events/events-module').then((m) => m.EventsModule),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.SHARED,
          context: PrivacyContext.CALENDAR_EVENTS,
        },
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
        loadChildren: () => import('./features/tasks/tasks-module').then((m) => m.TasksModule),
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
        loadChildren: () => import('./features/settings/settings').then((m) => m.Settings),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.PRIVATE,
        },
      },

      // ========== NÍVEL CONFIDENTIAL ==========
      {
        path: 'ai-assistant',
        loadChildren: () =>
          import('./features/ai-assistant/ai-assistant-module').then((m) => m.AiAssistantModule),
        canActivate: [privacyGuard],
        data: {
          privacyLevel: PrivacyLevel.CONFIDENTIAL,
          context: PrivacyContext.AI_TRAINING,
        },
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
