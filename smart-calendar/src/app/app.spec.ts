import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { LoadingService } from './core/services/loading.service';
import { NotificationService } from './core/services/notification.service';
import { ThemeService } from './core/services/theme.service';
import { ApiMapperInitService } from './core/services/api-mapper-init.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, BrowserAnimationsModule],
      providers: [
        { provide: LoadingService, useValue: { isLoading$: { subscribe: () => {} } } },
        { provide: NotificationService, useValue: { initializeNotifications: () => {} } },
        { provide: ThemeService, useValue: { initializeTheme: () => {} } },
        { provide: ApiMapperInitService, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render app container', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-container')).toBeTruthy();
  });
});
