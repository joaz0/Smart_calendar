import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarEvent } from '../../../core/models/event.model';
import { AnyObject } from '../../../core/models/common-interfaces';


@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);

  private destroy$ = new Subject<void>();
  
  @Input() isEditMode = false;
  @Input() eventData: CalendarEvent | null = null;
  @Output() cancelDialog = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<CalendarEvent>();
  eventForm: FormGroup;
  activeTab = 'details';
  showAISuggestions = true;

  constructor() {
    this.eventForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.eventData) {
      this.patchFormWithEventData();
    }

    this.eventForm.get('allDay')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((allDay) => {
      if (allDay) {
        this.eventForm.get('startTime')?.clearValidators();
        this.eventForm.get('endTime')?.clearValidators();
      } else {
        this.eventForm.get('startTime')?.setValidators(Validators.required);
        this.eventForm.get('endTime')?.setValidators(Validators.required);
      }
      this.eventForm.get('startTime')?.updateValueAndValidity();
      this.eventForm.get('endTime')?.updateValueAndValidity();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Detalhes Tab
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      category: [''],
      color: ['#3b82f6'],
      location: [''],

      // Horário Tab
      startDate: [this.getTodayDate(), Validators.required],
      startTime: ['09:00'],
      endDate: [this.getTodayDate(), Validators.required],
      endTime: ['10:00'],
      allDay: [false],
      isRecurring: [false],
      recurrence: [null],

      // Avançado Tab
      availability: ['busy'],
      meetingLink: [''],
      documentLink: [''],
      isPrivate: [false],
      reminders: this.fb.array([]),
    });
  }

  private patchFormWithEventData(): void {
    if (!this.eventData) return;

    this.eventForm.patchValue({
      title: this.eventData.title || '',
      description: this.eventData.description || '',
      category: this.eventData.category || '',
      color: this.eventData.color || '#3b82f6',
      location: this.eventData.location || '',
      startDate: this.formatDateForInput(this.eventData.startDate) || this.getTodayDate(),
      startTime: this.formatTimeForInput(this.eventData.startDate) || '09:00',
      endDate: this.formatDateForInput(this.eventData.endDate) || this.getTodayDate(),
      endTime: this.formatTimeForInput(this.eventData.endDate) || '10:00',
      allDay: this.eventData.allDay || false,
      isRecurring: false,
      recurrence: null,
      availability: 'busy',
      meetingLink: '',
      documentLink: '',
      isPrivate: false,
    });

    // Patch reminders if they exist
    if (this.eventData.reminders && Array.isArray(this.eventData.reminders)) {
      this.eventData.reminders.forEach((reminder: AnyObject) => {
        this.reminders.push(
          this.fb.group({
            minutesBefore: [reminder.minutesBefore || '15', Validators.required],
            type: [reminder.type || 'notification', Validators.required],
          })
        );
      });
    }
  }

  // Helper methods for date formatting
  private formatDateForInput(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  private formatTimeForInput(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  // Getters para o template
  get reminders(): FormArray {
    return this.eventForm.get('reminders') as FormArray;
  }

  // Métodos de navegação
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onCancel(): void {
    this.cancelDialog.emit();
  }

  // Métodos para lembretes
  createReminder(): FormGroup {
    return this.fb.group({
      minutesBefore: ['15', Validators.required],
      type: ['notification', Validators.required],
    });
  }

  addReminder(): void {
    this.reminders.push(this.createReminder());
  }

  removeReminder(index: number): void {
    this.reminders.removeAt(index);
  }

  // Cálculo de duração - ATUALIZADA para retornar minutos
  getDuration(): number {
    const startDate = this.eventForm.get('startDate')?.value;
    const startTime = this.eventForm.get('startTime')?.value;
    const endDate = this.eventForm.get('endDate')?.value;
    const endTime = this.eventForm.get('endTime')?.value;
    const allDay = this.eventForm.get('allDay')?.value;

    if (!startDate || !endDate) {
      return 0;
    }

    if (allDay) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays * 24 * 60; // Converter dias para minutos
    }

    if (!startTime || !endTime) {
      return 0;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    const diffMs = endDateTime.getTime() - startDateTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    return diffMins > 0 ? diffMins : 0;
  }

  // Métodos auxiliares
  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  hideAISuggestions(): void {
    this.showAISuggestions = false;
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      // Preparar dados para envio no formato CalendarEvent
      const eventData: AnyObject = {
        id: this.eventData?.id || this.generateId(),
        title: formValue.title,
        description: formValue.description,
        startDate: new Date(
          formValue.allDay
            ? `${formValue.startDate}T00:00:00`
            : `${formValue.startDate}T${formValue.startTime}:00`
        ),
        endDate: formValue.endDate
          ? new Date(
              formValue.allDay
                ? `${formValue.endDate}T23:59:59`
                : `${formValue.endDate}T${formValue.endTime}:00`
            )
          : undefined,
        location: formValue.location,
        category: formValue.category,
        color: formValue.color,
        allDay: formValue.allDay,
        reminders: formValue.reminders || [],
        createdBy: this.eventData?.createdBy || 'system',
        createdAt: this.eventData?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      console.log('Form Submitted!', eventData);
      this.submitEvent.emit(eventData);
    } else {
      this.markFormGroupTouched(this.eventForm);
    }
  }

  private generateId(): string {
    return Date.now().toString();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((group: AnyObject) => {
          if (group instanceof FormGroup) {
            this.markFormGroupTouched(group);
          }
        });
      }
    });
  }
}
