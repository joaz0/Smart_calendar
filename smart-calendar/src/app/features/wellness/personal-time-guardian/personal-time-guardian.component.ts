import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; // Assumindo Material ou use divs
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PersonalTimeManagerService, PersonalTimeStats } from '../../../../core/services/wellness/personal-time-manager.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-personal-time-guardian',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './personal-time-guardian.component.html',
  styleUrls: ['./personal-time-guardian.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalTimeGuardianComponent implements OnInit {
  // Observables para usar com AsyncPipe no template
  isProtectionActive$: Observable<boolean>;
  protectionStats$: Observable<PersonalTimeStats>;

  constructor(private timeManager: PersonalTimeManagerService) {
    // Inicializa os observables baseados no serviço
    // Assumindo que seu serviço expõe estes métodos ou subjects
    this.isProtectionActive$ = this.timeManager.isActive$;
    this.protectionStats$ = this.timeManager.stats$;
  }

  ngOnInit(): void {
    // Carrega estado inicial se necessário
  }

  toggleProtection(event: any): void {
    const isChecked = event.checked;
    if (isChecked) {
      this.timeManager.enableProtection();
    } else {
      this.timeManager.disableProtection();
    }
  }

  configureBoundaries(): void {
    // Lógica para abrir modal de configuração de horários
    console.log('Abrir configuração de limites');
  }
}
