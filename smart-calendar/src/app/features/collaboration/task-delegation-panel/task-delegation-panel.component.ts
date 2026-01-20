import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

type Priority = 'high' | 'medium' | 'low';

interface TeamMember {
  name: string;
  role: string;
  load: number; // 0 - 1
  timezone: string;
  focusWindow: string;
  capacityLeft: number; // horas livres na semana
  strengths: string[];
  risk: 'balanced' | 'overloaded' | 'light';
}

interface DelegationTask {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  impact: string;
  effortHours: number;
  due: string;
  tags: string[];
  suggested: string;
  selectedAssignee?: string;
  assignedTo?: string;
  lastAction?: string;
  blockers?: string;
}

@Component({
  standalone: true,
  selector: 'app-task-delegation-panel',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './task-delegation-panel.component.html',
  styleUrl: './task-delegation-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDelegationPanelComponent {
  readonly team: TeamMember[] = [
    {
      name: 'Ana Martins',
      role: 'Product Manager',
      load: 0.62,
      timezone: 'BRT',
      focusWindow: '08h - 12h',
      capacityLeft: 6,
      strengths: ['Discovery', 'Alinhamento', 'Requisitos'],
      risk: 'balanced',
    },
    {
      name: 'João Lima',
      role: 'Engineering Lead',
      load: 0.78,
      timezone: 'BRT',
      focusWindow: '09h - 13h',
      capacityLeft: 4,
      strengths: ['Arquitetura', 'Code review', 'Entrega crítica'],
      risk: 'overloaded',
    },
    {
      name: 'Letícia Souza',
      role: 'Data & Insights',
      load: 0.55,
      timezone: 'BRT',
      focusWindow: '10h - 14h',
      capacityLeft: 8,
      strengths: ['Dashboards', 'Modelos', 'Storytelling'],
      risk: 'balanced',
    },
    {
      name: 'Rafael Dias',
      role: 'QA Automation',
      load: 0.48,
      timezone: 'BRT',
      focusWindow: '13h - 17h',
      capacityLeft: 9,
      strengths: ['Testes E2E', 'Cobertura', 'Qualidade'],
      risk: 'light',
    },
  ];

  tasks: DelegationTask[] = [
    {
      id: 'OPS-142',
      title: 'Refinar requisitos e mapa de riscos',
      description: 'Preparar “PRD lean” com critérios de aceite para o piloto.',
      priority: 'high',
      impact: 'Destrava planejamento da sprint',
      effortHours: 5,
      due: 'Hoje · 17h',
      tags: ['bloqueio', 'produto'],
      suggested: 'Ana Martins',
      lastAction: 'Sugestão automática enviada',
      blockers: 'Dependência de agenda com security',
    },
    {
      id: 'QA-078',
      title: 'Automação de testes regressivos',
      description: 'Cobrir principais fluxos do calendário compartilhado.',
      priority: 'medium',
      impact: 'Reduz risco de regressão na release',
      effortHours: 6,
      due: 'Amanhã · 11h',
      tags: ['qualidade', 'release'],
      suggested: 'Rafael Dias',
      lastAction: 'Aguardando confirmação do responsável',
    },
    {
      id: 'DS-033',
      title: 'Dashboard de riscos de capacidade',
      description: 'Conectar volume de reuniões com incidentes e bugs reabertos.',
      priority: 'high',
      impact: 'Previne saturação de squads',
      effortHours: 8,
      due: 'Qua · 10h',
      tags: ['dados', 'visibilidade'],
      suggested: 'Letícia Souza',
      lastAction: 'Rascunho pronto para handoff',
    },
  ];

  readonly workflowReminders = [
    'Delegar até as 12h garante feedback no mesmo dia.',
    'Use o foco da manhã para tarefas críticas antes de reatribuir.',
    'Confirme disponibilidade em timezones distintos antes de reagendar.',
  ];

  delegate(task: DelegationTask, assignee?: string): void {
    const target = assignee || task.selectedAssignee || task.suggested;
    task.assignedTo = target;
    task.lastAction = `Delegada para ${target} agora`;
  }

  get availableCapacity(): number {
    return this.team.reduce((acc, member) => acc + member.capacityLeft, 0);
  }

  get overloadedMembers(): string {
    const names = this.team.filter((member) => member.load >= 0.75).map((member) => member.name);
    return names.length ? names.join(', ') : 'Nenhum';
  }
}
