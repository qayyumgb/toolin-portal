import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { routes } from './app.routes';
import { env } from '../environments/environment';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(AngularFireModule.initializeApp(env.firebaseConfig), AngularFireAuthModule),
    provideRouter(routes),
    provideToastr({
      timeOut: 10000,
    }),
  ]
};
