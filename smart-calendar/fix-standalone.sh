#!/bin/bash
files=(
  "src/app/features/advanced-visualization/personal-insights-reports/personal-insights-reports.ts"
  "src/app/features/advanced-visualization/project-timeline-view/project-timeline-view.ts"
  "src/app/features/advanced-visualization/relationship-mapper-chart/relationship-mapper-chart.ts"
  "src/app/features/advanced-visualization/semantic-search-interface/semantic-search-interface.ts"
  "src/app/features/advanced-visualization/time-analytics-dashboard/time-analytics-dashboard.ts"
  "src/app/features/ai-assistant/meeting-moderator/meeting-moderator.ts"
  "src/app/features/calendar/agenda-list/agenda-list.ts"
  "src/app/features/calendar/calendar/calendar.ts"
)

for file in "${files[@]}"; do
  sed -i 's/@Component({/@Component({\n  standalone: true,/' "$file"
done
