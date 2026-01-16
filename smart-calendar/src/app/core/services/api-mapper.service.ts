import { Injectable } from '@angular/core';
import { Event as CalendarEvent } from '../models/event.model';
import { Task } from '../models/task.model';


@Injectable({
  providedIn: 'root',
})
export class ApiMapperService {
  // Events: front <-> back
  toApiEvent(evt: Partial<CalendarEvent>): any {
    const payload: any = {
      title: evt.title,
      description: evt.description,
      location: evt.location,
      url: evt.url,
      color: evt.color,
      is_all_day: evt.allDay ?? false
    };
    
    if (evt.startDate) {
      payload.start_time = evt.startDate instanceof Date 
        ? evt.startDate.toISOString() 
        : evt.startDate;
    }
    
    if (evt.endDate) {
      payload.end_time = evt.endDate instanceof Date 
        ? evt.endDate.toISOString() 
        : evt.endDate;
    }
    
    if (evt.category) {
      payload.category_id = typeof evt.category === 'object' ? evt.category.id : evt.category;
    }
    
    return payload;
  }

  fromApiEvent(api: any): CalendarEvent {
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

  fromApiTask(api: any): Task {
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
