import { Injectable } from '@angular/core';
import { Event as CalendarEvent } from '../models/event.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class ApiMapperService {
  // Events: front <-> back
  toApiEvent(event: Partial<CalendarEvent>): any {
    const payload: any = {
      title: event.title,
      description: event.description,
      location: event.location,
      url: event.url,
      color: event.color,
      is_all_day: event.allDay ?? false
    };
    
    if (event.startDate) {
      payload.start_time = event.startDate instanceof Date 
        ? event.startDate.toISOString() 
        : event.startDate;
    }
    
    if (event.endDate) {
      payload.end_time = event.endDate instanceof Date 
        ? event.endDate.toISOString() 
        : event.endDate;
    }
    
    if (event.category) {
      payload.category_id = typeof event.category === 'object' ? event.category.id : event.category;
    }
    
    return payload;
  }

  fromApiEvent(api: unknown): CalendarEvent {
    return {
      id: String(api.id),
      title: api.title,
      description: api.description,
      startDate: api.start_time ? new Date(api.start_time) : new Date(api.startDate),
      endDate: api.end_time ? new Date(api.end_time) : new Date(api.endDate),
      allDay: api.is_all_day ?? api.allDay ?? false,
      location: api.location,
      url: api.url,
      color: api.color,
      recurrence: api.recurrence ?? null,
      category: api.category ?? null,
      reminders: api.reminders ?? null,
      participants: api.participants ?? [],
      createdBy: api.user_id ?? api.createdBy ?? '',
      createdAt: api.created_at ? new Date(api.created_at) : new Date(api.createdAt),
      updatedAt: api.updated_at ? new Date(api.updated_at) : new Date(api.updatedAt),
    } as CalendarEvent;
  }

  // Tasks mapping
  toApiTask(task: Partial<Task>): any {
    const payload: any = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status
    };
    
    if (task.dueDate) {
      payload.due_date = task.dueDate instanceof Date 
        ? task.dueDate.toISOString() 
        : task.dueDate;
    }
    
    if (task.completed !== undefined) {
      payload.is_completed = !!task.completed;
    }
    
    if (task.category) {
      payload.category_id = task.category;
    }
    
    return payload;
  }

  fromApiTask(api: unknown): Task {
    return {
      id: String(api.id),
      title: api.title,
      description: api.description,
      category: api.category_id ?? api.category,
      priority: api.priority,
      status: api.status,
      dueDate: api.due_date ? new Date(api.due_date) : undefined,
      completed: api.is_completed ?? api.completed ?? false,
      created_at: api.created_at,
      updated_at: api.updated_at,
    } as Task;
  }
}
