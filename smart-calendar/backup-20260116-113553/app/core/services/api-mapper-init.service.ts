import { Injectable, inject } from '@angular/core';
import { ApiMapperService } from './api-mapper.service';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';
import { EventService } from './event.service';

@Injectable({ providedIn: 'root' })
export class ApiMapperInitService {
  private mapper = inject(ApiMapperService);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private eventService = inject(EventService);

  constructor() {
    // inject mapper into services that need it
    if ((this.taskService as any).setMapper) {
      (this.taskService as any).setMapper(this.mapper);
    }
    if ((this.authService as any).setMapper) {
      (this.authService as any).setMapper(this.mapper);
    }
    // EventService expects mapper via constructor injection; no-op if not set
  }
}
