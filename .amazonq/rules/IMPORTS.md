Ordem obrigatória dos imports:

// 1. Angular Core
import { Component, OnInit } from '@angular/core';

// 2. Angular Common
import { CommonModule } from '@angular/common';

// 3. Angular Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 4. Angular Material
import { MatButtonModule } from '@angular/material/button';

// 5. Angular CDK
import { DragDropModule } from '@angular/cdk/drag-drop';

// 6. RxJS
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// 7. Core do projeto
import { CalendarEvent } from '../../core/models/calendar-event.model';

// 8. Serviços
import { EventService } from '../../core/services/event.service';

// 9. Utils/Helpers
import { dateHelper } from '../../shared/utils/date-helper';

IMPORTANTE: Remover imports não usados!
