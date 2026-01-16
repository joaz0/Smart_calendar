import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';

// Routing
import { CalendarRoutingModule } from './calendar-routing.module';

// Components
import { MonthView } from './month-view/month-view';
import { EventDialogComponent } from './event-dialog/event-dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog';
import { DayDetailsDialogComponent } from './day-details-dialog/day-details-dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatListModule,
    MonthView,
    EventDialogComponent,
    TaskDialogComponent,
    DayDetailsDialogComponent,
  ],
})
export class CalendarModule {}
