import { Component } from '@angular/core';
import { STATUS_COLOR_VARS } from '../../../shared/tokens/color-tokens';

interface Analysis {
  riskLevel: string;
  riskScore: number;
  suggestions: string[];
}

@Component({
  standalone: true,
  selector: 'app-burnout-detector-dashboard',
  imports: [],
  templateUrl: './burnout-detector-dashboard.component.html',
  styleUrl: './burnout-detector-dashboard.component.scss'
})
export class BurnoutDetectorDashboardComponent {
  analysis: Analysis | null = null;

  getRiskColor(): string { return STATUS_COLOR_VARS.error; }
  getRiskLabel(): string { return 'Alto'; }
  analyze(): void { 
    console.log('Analyzing burnout risk');
  }
}
