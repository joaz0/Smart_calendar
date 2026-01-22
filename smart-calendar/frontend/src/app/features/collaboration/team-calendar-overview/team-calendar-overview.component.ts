import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type BlockType = 'focus' | 'meeting' | 'buffer' | 'break' | 'blocked';

interface CalendarBlock {
  label: string;
  duration: number; // em horas, para distribuir no flex
  type: BlockType;
  note?: string;
}

interface TeamCalendar {
  name: string;
  role: string;
  timezone: string;
  load: number; // 0-1
  workPattern: string;
  nextAvailability: string;
  dependency: string;
  blocks: CalendarBlock[];
}

@Component({
  standalone: true,
  selector: 'app-team-calendar-overview',
  imports: [CommonModule, MatIconModule],
  templateUrl: './team-calendar-overview.component.html',
  styleUrl: './team-calendar-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCalendarOverviewComponent {
  readonly teamCalendars: TeamCalendar[] = [
    {
      name: 'Ana Martins',
      role: 'Product Manager',
      timezone: 'BRT',
      load: 0.68,
      workPattern: 'Manhã profunda, tarde com stakeholders',
      nextAvailability: 'Hoje · 14h30',
      dependency: 'Decidir escopo de integração',
      blocks: [
        { label: 'Deep work', duration: 3, type: 'focus', note: 'Refino de requisitos' },
        { label: 'Reuniões', duration: 2, type: 'meeting', note: 'Stakeholders' },
        { label: 'Buffer', duration: 1, type: 'buffer', note: 'Follow-ups' },
        { label: 'Break', duration: 0.5, type: 'break' },
      ],
    },
    {
      name: 'João Lima',
      role: 'Engineering Lead',
      timezone: 'BRT',
      load: 0.82,
      workPattern: 'Foco pesado até 13h',
      nextAvailability: 'Amanhã · 09h15',
      dependency: 'Code review crítico',
      blocks: [
        { label: 'Deep work', duration: 2.5, type: 'focus', note: 'Arquitetura' },
        { label: 'Incident review', duration: 1.5, type: 'meeting' },
        { label: '1:1', duration: 1, type: 'meeting' },
        { label: 'Break', duration: 0.5, type: 'break' },
      ],
    },
    {
      name: 'Letícia Souza',
      role: 'Data & Insights',
      timezone: 'BRT',
      load: 0.54,
      workPattern: 'Janelas de foco tarde',
      nextAvailability: 'Hoje · 16h00',
      dependency: 'Dados de utilização',
      blocks: [
        { label: 'Exploração', duration: 2, type: 'focus' },
        { label: 'Sync squad', duration: 1, type: 'meeting' },
        { label: 'Dashboards', duration: 2.5, type: 'focus' },
        { label: 'Buffer', duration: 1, type: 'buffer' },
      ],
    },
    {
      name: 'Rafael Dias',
      role: 'QA Automation',
      timezone: 'BRT',
      load: 0.43,
      workPattern: 'Tarde livre para regressão',
      nextAvailability: 'Hoje · 15h20',
      dependency: 'Ambiente de staging',
      blocks: [
        { label: 'Testes E2E', duration: 3, type: 'focus' },
        { label: 'Reuniões', duration: 1, type: 'meeting' },
        { label: 'Buffer', duration: 1.5, type: 'buffer' },
        { label: 'Break', duration: 0.5, type: 'break' },
      ],
    },
  ];

  readonly insights = [
    'Janelas de foco alinhadas entre 9h-12h para três membros: agendar revisões rápidas antes das 13h.',
    'Carga alta em João (82%): evite novos handoffs até liberar CR crítico.',
    'Letícia com slot livre às 16h para desbloquear dashboard de riscos.',
  ];

  get averageLoad(): number {
    const total = this.teamCalendars.reduce((acc, member) => acc + member.load, 0);
    return Math.round((total / this.teamCalendars.length) * 100);
  }

  get focusHeavyMembers(): string {
    const names = this.teamCalendars.filter((member) => member.blocks.some((b) => b.type === 'focus' && b.duration >= 3)).map((member) => member.name);
    return names.length ? names.join(', ') : '—';
  }
}
