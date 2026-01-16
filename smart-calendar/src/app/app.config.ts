import { ApplicationConfig, importProvidersFrom } from '@angular/core.component';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http.component';
import { provideAnimations, BrowserAnimationsModule } from '@angular/platform-browser/animations.component';
import { MatSnackBarModule } from '@angular/material/snack-bar.component';
import { routes } from './app.routes.component';

// Interceptor classes
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(), // Permite passar parâmetros de rota como @Input
      withViewTransitions() // Animações de transição entre rotas
    ),
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule, MatSnackBarModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    provideAnimations(),
  ],
};
