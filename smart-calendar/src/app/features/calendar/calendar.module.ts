import { NgModule } from '@angular/core.component';
import { CommonModule } from '@angular/common.component';
import { ReactiveFormsModule } from '@angular/forms.component';

// Material Imports
import { MatButtonModule } from '@angular/material/button.component';
import { MatIconModule } from '@angular/material/icon.component';
import { MatDialogModule } from '@angular/material/dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field.component';
import { MatInputModule } from '@angular/material/input.component';
import { MatDatepickerModule } from '@angular/material/datepicker.component';
import { MatSelectModule } from '@angular/material/select.component';
import { MatCheckboxModule } from '@angular/material/checkbox.component';
import { MatListModule } from '@angular/material/list.component';
import { MatNativeDateModule } from '@angular/material/core.component';

// Routing
import { CalendarRoutingModule } from './calendar-routing.module.component';

// Components
import { MonthView } from './month-view/month-view.component';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { DayDetailsDialogComponent } from './day-details-dialog/day-details-dialog.component';

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
