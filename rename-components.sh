#!/bin/bash

# Lista de arquivos para renomear (sem .component.ts)
declare -a files=(
  # shared/components
  "src/app/shared/components/category-picker/category-picker.ts"
  "src/app/shared/components/color-picker/color-picker.ts"
  "src/app/shared/components/confirm-dialog/confirm-dialog.ts"
  "src/app/shared/components/empty-state/empty-state.ts"
  "src/app/shared/components/header/header.ts"
  "src/app/shared/components/loading-spinner/loading-spinner.ts"
  "src/app/shared/components/not-found/not-found.ts"
  "src/app/shared/components/search-bar/search-bar.ts"
  "src/app/shared/components/sidebar/sidebar.ts"
  "src/app/shared/components/theme-toggle/theme-toggle.ts"
  
  # features/advanced-visualization
  "src/app/features/advanced-visualization/energy-week-calendar/energy-week-calendar.ts"
  "src/app/features/advanced-visualization/personal-insights-reports/personal-insights-reports.ts"
  "src/app/features/advanced-visualization/project-timeline-view/project-timeline-view.ts"
  "src/app/features/advanced-visualization/relationship-mapper-chart/relationship-mapper-chart.ts"
  "src/app/features/advanced-visualization/semantic-search-interface/semantic-search-interface.ts"
  "src/app/features/advanced-visualization/time-analytics-dashboard/time-analytics-dashboard.ts"
  
  # features/ai-assistant
  "src/app/features/ai-assistant/ai-assistant.ts"
  "src/app/features/ai-assistant/ai-scheduling-assistant/ai-scheduling-assistant.ts"
  "src/app/features/ai-assistant/ai-suggestions-panel/ai-suggestions-panel.ts"
  "src/app/features/ai-assistant/daily-ai-summary/daily-ai-summary.ts"
  "src/app/features/ai-assistant/intelligent-task-scheduler/intelligent-task-scheduler.ts"
  "src/app/features/ai-assistant/meeting-moderator/meeting-moderator.ts"
  "src/app/features/ai-assistant/travel-time-calculator/travel-time-calculator.ts"
  
  # features/analytics
  "src/app/features/analytics/analytics.ts"
  
  # features/calendar
  "src/app/features/calendar/agenda-list/agenda-list.ts"
  "src/app/features/calendar/calendar/calendar.ts"
  "src/app/features/calendar/calendar-view/calendar-view.ts"
  "src/app/features/calendar/day-details-dialog/day-details-dialog.ts"
  "src/app/features/calendar/day-view/day-view.ts"
  "src/app/features/calendar/event-dialog/event-dialog.ts"
  "src/app/features/calendar/month-view/month-view.ts"
  "src/app/features/calendar/task-dialog/task-dialog.ts"
  "src/app/features/calendar/week-view/week-view.ts"
  
  # features/collaboration
  "src/app/features/collaboration/collaboration-dashboard/collaboration-dashboard.ts"
  "src/app/features/collaboration/quick-links-manager/quick-links-manager.ts"
  "src/app/features/collaboration/real-time-availability-view/real-time-availability-view.ts"
  "src/app/features/collaboration/scheduling-poll-creator/scheduling-poll-creator.ts"
  "src/app/features/collaboration/task-delegation-panel/task-delegation-panel.ts"
  "src/app/features/collaboration/team-calendar-overview/team-calendar-overview.ts"
  
  # features/context-productivity
  "src/app/features/context-productivity/context-blocks-editor/context-blocks-editor.ts"
  "src/app/features/context-productivity/event-template-library/event-template-library.ts"
  "src/app/features/context-productivity/focus-mode-manager/focus-mode-manager.ts"
  "src/app/features/context-productivity/habit-tracking-dashboard/habit-tracking-dashboard.ts"
  "src/app/features/context-productivity/meeting-notes-with-timestamps/meeting-notes-with-timestamps.ts"
  "src/app/features/context-productivity/pomodoro-timer/pomodoro-timer.ts"
  "src/app/features/context-productivity/productivity-insights/productivity-insights.ts"
  
  # features/dashboard
  "src/app/features/dashboard/dashboard.ts"
  
  # features/events
  "src/app/features/events/event-details/event-details.ts"
  "src/app/features/events/event-form/event-form.ts"
  "src/app/features/events/event-list/event-list.ts"
  "src/app/features/events/events.ts"
  "src/app/features/events/recurrence-settings/recurrence-settings.ts"
  
  # features/integrations
  "src/app/features/integrations/contact-sync-settings/contact-sync-settings.ts"
  "src/app/features/integrations/document-attachment-manager/document-attachment-manager.ts"
  "src/app/features/integrations/health-apps-connector/health-apps-connector.ts"
  "src/app/features/integrations/map-integration-panel/map-integration-panel.ts"
  "src/app/features/integrations/messaging-settings/messaging-settings.ts"
  "src/app/features/integrations/video-call-quick-add/video-call-quick-add.ts"
  
  # features/privacy-control
  "src/app/features/privacy-control/backup-migration-wizard/backup-migration-wizard.ts"
  "src/app/features/privacy-control/digital-inheritance-setup/digital-inheritance-setup.ts"
  "src/app/features/privacy-control/event-camouflage-settings/event-camouflage-settings.ts"
  "src/app/features/privacy-control/multiple-calendars-manager/multiple-calendars-manager.ts"
  "src/app/features/privacy-control/off-grid-mode-toggle/off-grid-mode-toggle.ts"
  "src/app/features/privacy-control/privacy-control-center/privacy-control-center.ts"
  
  # features/settings
  "src/app/features/settings/settings.ts"
  
  # features/tasks
  "src/app/features/tasks/priority-indicator/priority-indicator.ts"
  "src/app/features/tasks/task-form/task-form.ts"
  "src/app/features/tasks/task-item/task-item.ts"
  "src/app/features/tasks/task-list/task-list.ts"
  "src/app/features/tasks/tasks.ts"
  
  # features/wellness
  "src/app/features/wellness/active-breaks-reminder/active-breaks-reminder.ts"
  "src/app/features/wellness/burnout-detector-dashboard/burnout-detector-dashboard.ts"
  "src/app/features/wellness/health-integration-settings/health-integration-settings.ts"
  "src/app/features/wellness/personal-time-guardian/personal-time-guardian.ts"
  "src/app/features/wellness/wellness-report/wellness-report.ts"
  "src/app/features/wellness/wind-down-scheduler/wind-down-scheduler.ts"
)

cd /home/joazr/Documentos/Smart_calendar/smart-calendar

echo "🔄 Renomeando ${#files[@]} arquivos de componentes..."

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Remove .ts e adiciona .component.ts
    new_file="${file%.ts}.component.ts"
    
    # Renomeia o arquivo
    git mv "$file" "$new_file" 2>/dev/null || mv "$file" "$new_file"
    
    echo "✅ $file → $new_file"
    
    # Atualiza imports no próprio arquivo (templateUrl e styleUrl)
    base_name=$(basename "$file" .ts)
    sed -i "s|templateUrl: './${base_name}.html'|templateUrl: './${base_name}.component.html'|g" "$new_file"
    sed -i "s|styleUrl: './${base_name}.scss'|styleUrl: './${base_name}.component.scss'|g" "$new_file"
    sed -i "s|styleUrls: \\['./${base_name}.scss'\\]|styleUrls: ['./${base_name}.component.scss']|g" "$new_file"
  fi
done

echo ""
echo "✅ Renomeação concluída!"
echo "⚠️  ATENÇÃO: Você precisa atualizar os imports em TODOS os arquivos que referenciam esses componentes!"
