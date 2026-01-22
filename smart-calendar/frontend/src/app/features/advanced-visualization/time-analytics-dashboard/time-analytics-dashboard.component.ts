import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface SummaryMetric {
  label: string;
  value: string;
  delta: number;
  hint: string;
  icon: string;
}

interface FocusDay {
  label: string;
  focusHours: number;
  meetings: number;
  flowScore: number;
  contextSwitches: number;
  note: string;
}

interface CategoryBreakdown {
  name: string;
  hours: number;
  target: number;
  color: string;
  trend: string;
}

interface Ritual {
  title: string;
  time: string;
  adherence: number;
  impact: string;
}

type AlertSeverity = 'positive' | 'warning' | 'critical';

interface AlertCard {
  title: string;
  description: string;
  severity: AlertSeverity;
  icon: string;
}

@Component({
  standalone: true,
  selector: 'app-time-analytics-dashboard',
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './time-analytics-dashboard.component.html',
  styleUrl: './time-analytics-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeAnalyticsDashboardComponent {
  readonly timeRanges = ['Últimos 7 dias', 'Últimos 30 dias', '90 dias'];
  selectedRange = this.timeRanges[0];

  readonly summaryMetrics: SummaryMetric[] = [
    {
      label: 'Tempo focado',
      value: '18h 40m',
      delta: 12,
      hint: '5 blocos de deep work / dia útil',
      icon: 'bolt',
    },
    {
      label: 'Tempo em reuniões',
      value: '11h 05m',
      delta: -8,
      hint: 'Limite diário de 3 reuniões respeitado',
      icon: 'groups',
    },
    {
      label: 'Flow time',
      value: '74%',
      delta: 6,
      hint: 'Sessões protegidas das 8h às 11h',
      icon: 'auto_fix_high',
    },
    {
      label: 'Interrupções',
      value: '14 eventos',
      delta: -21,
      hint: 'Alertas silenciados em blocos críticos',
      icon: 'notifications_off',
    },
  ];

  readonly weekTrend: FocusDay[] = [
    { label: 'Seg', focusHours: 3.6, meetings: 1.5, flowScore: 78, contextSwitches: 2, note: 'Janela A+ entre 8h-11h' },
    { label: 'Ter', focusHours: 2.9, meetings: 1.9, flowScore: 72, contextSwitches: 3, note: 'Pico de reuniões pós-almoço' },
    { label: 'Qua', focusHours: 2.2, meetings: 2.8, flowScore: 61, contextSwitches: 4, note: 'Muitas trocas de contexto' },
    { label: 'Qui', focusHours: 2.5, meetings: 2.2, flowScore: 64, contextSwitches: 3, note: 'Proteger tarde contra interrupções' },
    { label: 'Sex', focusHours: 3.8, meetings: 1.1, flowScore: 82, contextSwitches: 1, note: 'Fechamento e revisão semanal' },
    { label: 'Sáb', focusHours: 1.4, meetings: 0.4, flowScore: 70, contextSwitches: 1, note: 'Planejamento leve' },
    { label: 'Dom', focusHours: 1.2, meetings: 0.3, flowScore: 69, contextSwitches: 1, note: 'Revisão pessoal' },
  ];

  readonly categories: CategoryBreakdown[] = [
    { name: 'Deep work', hours: 9.5, target: 8, color: 'linear-gradient(90deg, #22d3ee, #6366f1)', trend: '+1.2h vs semana passada' },
    { name: 'Reuniões', hours: 11.1, target: 9, color: 'linear-gradient(90deg, #fb7185, #f472b6)', trend: 'Reduzir 1 reunião na quarta' },
    { name: 'Operacional', hours: 6.4, target: 7, color: 'linear-gradient(90deg, #fbbf24, #f59e0b)', trend: 'Dentro do limite' },
    { name: 'Pausas e pausas ativas', hours: 4.2, target: 4.5, color: 'linear-gradient(90deg, #34d399, #10b981)', trend: 'Consistência quase ideal' },
  ];

  readonly rituals: Ritual[] = [
    { title: 'Planejamento de sprint', time: 'Seg · 08h30', adherence: 92, impact: 'Define limites de reuniões e blocos de foco' },
    { title: 'Review diária', time: '17h10', adherence: 76, impact: 'Previne surpresas e backlog oculto' },
    { title: 'Recarga ativa', time: 'Entre 15h-16h', adherence: 64, impact: 'Reduz quedas de energia na tarde' },
  ];

  readonly alerts: AlertCard[] = [
    { title: 'Quarta saturada', description: '2.8h de reuniões + 4 trocas de contexto. Mover 1 reunião para quinta mantém flow.', severity: 'warning', icon: 'event_busy' },
    { title: 'Flow alto na manhã de sexta', description: '82% de foco com apenas 1 reunião. Replicar padrão para terça.', severity: 'positive', icon: 'water_drop' },
    { title: 'Bloco crítico sem proteção', description: 'Terça 14h-15h tem 3 interrupções. Ative “Não perturbe” nesse slot.', severity: 'critical', icon: 'shield' },
  ];

  readonly microRecommendations: string[] = [
    'Agrupar reuniões entre 13h-15h para liberar manhãs.',
    'Definir limite de 2 context switches até 12h.',
    'Transformar follow-ups em tarefas assíncronas curtas.',
    'Usar checklists rápidos na review diária para reduzir retrabalho.',
  ];

  setRange(range: string): void {
    this.selectedRange = range;
  }

  get averageFlow(): number {
    const total = this.weekTrend.reduce((acc, day) => acc + day.flowScore, 0);
    return Math.round(total / this.weekTrend.length);
  }

  get maxFocusHours(): number {
    return Math.max(...this.weekTrend.map((day) => day.focusHours + day.meetings), 1);
  }

  get totalDeepWorkBlocks(): number {
    return Math.round(this.summaryMetrics[0].delta > 0 ? 18 : 15);
  }

  get contextSwitchCount(): number {
    return this.weekTrend.reduce((acc, day) => acc + day.contextSwitches, 0);
  }

  getCategoryProgress(category: CategoryBreakdown): number {
    return Math.min(100, Math.round((category.hours / category.target) * 100));
  }
}
