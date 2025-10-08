import { Injectable } from '@angular/core';
import { ApiMapperService } from './api-mapper.service';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';
import { EventService } from './event.service';

@Injectable({ providedIn: 'root' })
export class ApiMapperInitService {
  constructor(
    private mapper: ApiMapperService,
    private taskService: TaskService,
    private authService: AuthService,
    private eventService: EventService
  ) {
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
