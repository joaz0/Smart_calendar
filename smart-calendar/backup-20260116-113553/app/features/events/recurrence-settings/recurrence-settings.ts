import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-recurrence-settings',
  imports: [],
  templateUrl: './recurrence-settings.html',
  styleUrl: './recurrence-settings.scss'
})
export class RecurrenceSettingsComponent {
  @Input() recurrenceRule: any;
  @Output() recurrenceRuleChange = new EventEmitter<any>();
}
