import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-travel-time-calculator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './travel-time-calculator.html',
  styleUrls: ['./travel-time-calculator.scss'],
})
export class TravelTimeCalculatorComponent {
  from = '';
  to = '';
  result: { duration: string } | null = null;

  calculate(): void {
    // placeholder: calcula tempo de viagem (mock)
    this.result = { duration: '15 min' };
  }
}
