import { Injectable } from '@angular/core';
import { Event as CalendarEvent } from '../models/event.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class ApiMapperService {
  // Events: front <-> back
  toApiEvent(event: Partial<CalendarEvent>): any {
    // map front camelCase names to backend snake_case
    const payload: any = { ...event };
    if (payload.startDate) payload.start_time = new Date(payload.startDate).toISOString();
    if (payload.endDate) payload.end_time = new Date(payload.endDate).toISOString();
    if (payload.allDay !== undefined) payload.is_all_day = payload.allDay;
    // keep color/url/category mapping
    if (payload.color) payload.color = payload.color;
    if (payload.url) payload.url = payload.url;
    // remove camelCase fields to avoid duplication
    delete payload.startDate;
    delete payload.endDate;
    delete payload.allDay;
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
    const p: any = { ...task };
    if (p.dueDate) p.due_date = new Date(p.dueDate).toISOString();
    if (p.completed !== undefined) p.is_completed = !!p.completed;
    delete p.dueDate;
    delete p.completed;
    return p;
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
