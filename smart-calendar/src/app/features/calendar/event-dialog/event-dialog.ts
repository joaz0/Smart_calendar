import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Event } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, FormArray } from '@angular/forms';
import { RecurrenceSettings } from '../../events/recurrence-settings/recurrence-settings';

interface DialogData {
  event?: Event;
  date: Date;
}

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    FormsModule,
    RecurrenceSettings
],
  templateUrl: './event-dialog.html',
  styleUrls: ['./event-dialog.scss'],
})
export class EventDialogComponent {
  eventForm: FormGroup;
  isEditing: boolean;
  isEditMode: boolean;
  isSaving = false;
  attendees: {email: string}[] = [];
  separatorKeysCodes = [13, 188];
  hasReminder = false;
  reminderTime = 15;
  isRecurring = false;
  recurrenceRule: any = null;
  categories = [
    { id: '1', name: 'Pessoal', color: '#2196f3' },
    { id: '2', name: 'Trabalho', color: '#4caf50' },
  ];

  constructor(
    private dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private eventService: EventService
  ) {
    this.isEditing = !!data.event;
    this.isEditMode = !!data.event;
    const ev: any = data.event as any;
    this.eventForm = this.fb.group({
      title: [ev?.title || '', [Validators.required]],
      description: [ev?.description || ''],
      startDate: [ev?.startDate || data.date, [Validators.required]],
      endDate: [ev?.endDate || data.date, [Validators.required]],
      location: [ev?.location || ''],
      category: [ev?.category || null],
      isRecurring: [ev?.isRecurring || false],
      recurrence: [ev?.recurrence || null],
      reminders: [ev?.reminders || []],
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const eventData = this.eventForm.value;

      if (this.isEditing && this.data.event?.id) {
        this.eventService.updateEvent(this.data.event.id, eventData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Erro ao atualizar evento:', error),
        });
      } else {
        this.eventService.createEvent(eventData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Erro ao criar evento:', error),
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDelete() {
    if (this.isEditing && this.data.event?.id) {
      this.eventService.deleteEvent(this.data.event.id).subscribe({
        next: () => this.dialogRef.close(true),
        error: (error) => console.error('Erro ao excluir evento:', error),
      });
    }
  }

  getTimeFromDate(control: any): string {
    const date = control?.value;
    if (!date) return '';
    return new Date(date).toTimeString().slice(0, 5);
  }

  updateStartTime(time: string) {
    const currentDate = this.eventForm.get('startDate')?.value || new Date();
    const [hours, minutes] = time.split(':');
    const newDate = new Date(currentDate);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    this.eventForm.get('startDate')?.setValue(newDate);
  }

  updateEndTime(time: string) {
    const currentDate = this.eventForm.get('endDate')?.value || new Date();
    const [hours, minutes] = time.split(':');
    const newDate = new Date(currentDate);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    this.eventForm.get('endDate')?.setValue(newDate);
  }

  get remindersFormArray(): FormArray {
    return this.eventForm.get('reminders') as FormArray;
  }

  addReminder() {
    const reminders = this.eventForm.get('reminders')?.value || [];
    reminders.push({ minutes: 15, type: 'notification' });
    this.eventForm.get('reminders')?.setValue(reminders);
  }

  removeReminder(index: number) {
    const reminders = this.eventForm.get('reminders')?.value || [];
    reminders.splice(index, 1);
    this.eventForm.get('reminders')?.setValue(reminders);
  }

  addAttendee(event: any) {
    const value = (event.value || '').trim();
    if (value) {
      this.attendees.push({email: value});
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  removeAttendee(attendee: {email: string}) {
    const index = this.attendees.indexOf(attendee);
    if (index >= 0) {
      this.attendees.splice(index, 1);
    }
  }

  saveEvent() {
    this.isSaving = true;
    this.onSubmit();
  }

  deleteEvent() {
    this.onDelete();
  }
}
