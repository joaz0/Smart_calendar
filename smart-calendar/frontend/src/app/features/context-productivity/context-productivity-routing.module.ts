import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'insights',
    loadComponent: () => import('./productivity-insights/productivity-insights.component').then(m => m.ProductivityInsightsComponent)
  },
  {
    path: 'focus',
    loadComponent: () => import('./focus-mode-manager/focus-mode-manager.component').then(m => m.FocusModeManagerComponent)
  },
  {
    path: 'pomodoro',
    loadComponent: () => import('./pomodoro-timer/pomodoro-timer.component').then(m => m.PomodoroTimerComponent)
  },
  {
    path: 'templates',
    loadComponent: () => import('./event-template-library/event-template-library.component').then(m => m.EventTemplateLibraryComponent)
  },
  {
    path: 'habits',
    loadComponent: () => import('./habit-tracking-dashboard/habit-tracking-dashboard.component').then(m => m.HabitTrackingDashboardComponent)
  },
  {
    path: 'context-blocks',
    loadComponent: () => import('./context-blocks-editor/context-blocks-editor.component').then(m => m.ContextBlocksEditorComponent)
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
