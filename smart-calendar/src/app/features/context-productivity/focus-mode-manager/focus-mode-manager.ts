import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-focus-mode-manager',
  imports: [FormsModule],
  templateUrl: './focus-mode-manager.html',
  styleUrl: './focus-mode-manager.scss'
})
export class FocusModeManager {
  isActive = false;
  durations = [15, 25, 45, 60];
  selectedDuration = 25;
  blockApps = false;
  blockWebsites = false;
  blockNotifications = false;
  timeRemaining = '00:00';
  progressOffset = 0;
  blockedItems: string[] = [];

  activate() {
    this.isActive = true;
    this.blockedItems = [];
    if (this.blockApps) this.blockedItems.push('📱 Apps');
    if (this.blockWebsites) this.blockedItems.push('🌐 Sites');
    if (this.blockNotifications) this.blockedItems.push('🔔 Notificações');
  }

  deactivate() {
    this.isActive = false;
  }
}
