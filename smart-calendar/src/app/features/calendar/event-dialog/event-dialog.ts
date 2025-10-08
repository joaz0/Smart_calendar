import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Event } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  event?: Event;
  date: Date;
}

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './event-dialog.html',
  styleUrls: ['./event-dialog.scss'],
})
export class EventDialogComponent {
  eventForm: FormGroup;
  isEditing: boolean;
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
}
