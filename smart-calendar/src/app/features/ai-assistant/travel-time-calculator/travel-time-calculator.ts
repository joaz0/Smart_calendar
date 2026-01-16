import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-travel-time-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
