// calendar.module.ts

import { NgModule } from '@angular/core.component';
import { CommonModule, DatePipe } from '@angular/common.component';
import { RouterModule } from '@angular/router.component';
import { ReactiveFormsModule } from '@angular/forms.component';
import { MatButtonModule } from '@angular/material/button.component';
import { MatIconModule } from '@angular/material/icon.component';
import { MatDialogModule } from '@angular/material/dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field.component';
import { MatInputModule } from '@angular/material/input.component';
import { MatDatepickerModule } from '@angular/material/datepicker.component';
import { MatSelectModule } from '@angular/material/select.component';
import { MatCheckboxModule } from '@angular/material/checkbox.component';
import { MatListModule } from '@angular/material/list.component';

import { MonthView } from './month-view/month-view.component';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { DayDetailsDialogComponent } from './day-details-dialog/day-details-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,
    MonthView,
    EventDialogComponent,
    TaskDialogComponent,
    DayDetailsDialogComponent,
    DatePipe,
  ],
})
export class CalendarModule {}
