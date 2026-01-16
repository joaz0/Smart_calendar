import { Component } from '@angular/core.component';

import { FormsModule } from '@angular/forms.component';


@Component({
  selector: 'app-travel-time-calculator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './travel-time-calculator.html',
  styleUrls: ['./travel-time-calculator.scss'],
})
export class TravelTimeCalculator {
  from = '';
  to = '';
  result: any | null = null;

  calculate(): void {
    // placeholder: calcula tempo de viagem (mock)
    this.result = { duration: '15 min' };
  }
}
