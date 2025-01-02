import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { env } from '../environments/environment';
import { authInterceptor } from './constant/interceptor/auth-interceptor.interceptor';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])), // Only provide HttpClient with interceptors
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(AngularFireModule.initializeApp(env.firebaseConfig)), // Firebase initialization
    provideRouter(routes), // Provide routes for your application
    provideToastr({
      timeOut: 10000,
    }), // Toastr providers

  ]
};
