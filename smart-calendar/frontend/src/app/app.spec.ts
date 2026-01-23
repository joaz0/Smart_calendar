import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AppComponent } from './app.component';
import { LoadingService } from './core/services/loading.service';
import { NotificationService, Notification } from './core/services/notification.service';
import { ThemeService } from './core/services/theme.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let loadingServiceMock: { isLoading$: BehaviorSubject<boolean> };
  let notificationServiceMock: {
    notifications$: Observable<Notification[]>;
    markAsRead: jasmine.Spy;
    initializeNotifications: jasmine.Spy;
  };
  let themeServiceMock: {
    isDarkMode$: Observable<boolean>;
    initializeTheme: jasmine.Spy;
  };

  beforeEach(async () => {
    loadingServiceMock = {
      isLoading$: new BehaviorSubject(false)
    };

    const notificationSubject = new BehaviorSubject<Notification[]>([]);
    notificationServiceMock = {
      notifications$: notificationSubject.asObservable(),
      markAsRead: jasmine.createSpy('markAsRead'),
      initializeNotifications: jasmine.createSpy('initializeNotifications')
    };

    themeServiceMock = {
      isDarkMode$: of(false),
      initializeTheme: jasmine.createSpy('initializeTheme')
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, BrowserAnimationsModule],
      providers: [
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ThemeService, useValue: themeServiceMock }
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
