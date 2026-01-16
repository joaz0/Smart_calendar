import { NgModule } from '@angular/core.component';
import { RouterModule, Routes } from '@angular/router.component';

const routes: Routes = [
  {
    path: 'insights',
    loadComponent: () => import('./productivity-insights/productivity-insights').then(m => m.ProductivityInsights)
  },
  {
    path: 'focus',
    loadComponent: () => import('./focus-mode-manager/focus-mode-manager').then(m => m.FocusModeManager)
  },
  {
    path: 'pomodoro',
    loadComponent: () => import('./pomodoro-timer/pomodoro-timer').then(m => m.PomodoroTimer)
  },
  {
    path: 'templates',
    loadComponent: () => import('./event-template-library/event-template-library').then(m => m.EventTemplateLibrary)
  },
  {
    path: 'habits',
    loadComponent: () => import('./habit-tracking-dashboard/habit-tracking-dashboard').then(m => m.HabitTrackingDashboard)
  },
  {
    path: 'context-blocks',
    loadComponent: () => import('./context-blocks-editor/context-blocks-editor').then(m => m.ContextBlocksEditor)
  },
  {
    path: '',
    redirectTo: 'insights',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContextProductivityRoutingModule { }
