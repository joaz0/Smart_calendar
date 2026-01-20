import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type EnergyLevel = 'high' | 'medium' | 'low';

interface EnergyDay {
  label: string;
  dateLabel: string;
  energyScore: number;
  focusBlocks: number;
  recoveryHours: number;
  meetings: number;
  deepWorkHours: number;
  note: string;
}

@Component({
  standalone: true,
  selector: 'app-energy-week-calendar',
  imports: [CommonModule, MatIconModule],
  templateUrl: './energy-week-calendar.component.html',
  styleUrls: ['./energy-week-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyWeekCalendarComponent {
  readonly week: EnergyDay[] = [
    {
      label: 'Seg',
      dateLabel: 'Hoje · 20/01',
      energyScore: 82,
      focusBlocks: 3,
      recoveryHours: 7.5,
      meetings: 2,
      deepWorkHours: 3.5,
      note: 'Melhor janela: manhã (08h-11h)',
    },
    {
      label: 'Ter',
      dateLabel: '21/01',
      energyScore: 76,
      focusBlocks: 3,
      recoveryHours: 7,
      meetings: 3,
      deepWorkHours: 3,
      note: 'Mantenha pausas curtas à tarde',
    },
    {
      label: 'Qua',
      dateLabel: '22/01',
      energyScore: 64,
      focusBlocks: 2,
      recoveryHours: 6.5,
      meetings: 4,
      deepWorkHours: 2,
      note: 'Agenda densa · priorize tarefas críticas',
    },
    {
      label: 'Qui',
      dateLabel: '23/01',
      energyScore: 58,
      focusBlocks: 2,
      recoveryHours: 6,
      meetings: 5,
      deepWorkHours: 1.5,
      note: 'Risco de fadiga após 16h',
    },
    {
      label: 'Sex',
      dateLabel: '24/01',
      energyScore: 71,
      focusBlocks: 3,
      recoveryHours: 7.2,
      meetings: 2,
      deepWorkHours: 2.5,
      note: 'Boa janela de foco no final da manhã',
    },
    {
      label: 'Sáb',
      dateLabel: '25/01',
      energyScore: 69,
      focusBlocks: 2,
      recoveryHours: 8.3,
      meetings: 1,
      deepWorkHours: 1.5,
      note: 'Use para revisão leve e planejamento',
    },
    {
      label: 'Dom',
      dateLabel: '26/01',
      energyScore: 74,
      focusBlocks: 2,
      recoveryHours: 8.5,
      meetings: 0,
      deepWorkHours: 1,
      note: 'Recarregue com descanso ativo',
    },
  ];

  readonly insights: string[] = [
    'Evite agendar reuniões após blocos de deep work matinal.',
    'Quarta está sobrecarregada: mover 1 reunião para quinta.',
    'Sono consistente acima de 7h aumenta energia média em 12%.',
    'Mantenha blocos de foco curtos (50m) após as 15h.',
  ];

  get averageEnergy(): number {
    return Math.round(
      this.week.reduce((total, day) => total + day.energyScore, 0) / this.week.length
    );
  }

  get bestDay(): EnergyDay {
    return this.week.reduce(
      (best, day) => (day.energyScore > best.energyScore ? day : best),
      this.week[0]
    );
  }

  get lowEnergyDay(): EnergyDay {
    return this.week.reduce(
      (worst, day) => (day.energyScore < worst.energyScore ? day : worst),
      this.week[0]
    );
  }

  getEnergyLevel(score: number): EnergyLevel {
    if (score >= 75) return 'high';
    if (score >= 55) return 'medium';
    return 'low';
  }
}
