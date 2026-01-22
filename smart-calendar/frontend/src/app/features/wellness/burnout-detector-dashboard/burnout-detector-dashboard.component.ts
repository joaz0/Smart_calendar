import { Component } from '@angular/core';

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

  getRiskColor(): string { return '#ff0000'; }
  getRiskLabel(): string { return 'Alto'; }
  analyze(): void { 
    console.log('Analyzing burnout risk');
  }
}
