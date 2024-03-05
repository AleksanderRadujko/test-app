import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { DataInterceptor } from '../modules/core/data-service/data.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    CookieService,
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DataInterceptor,
      multi: true
    }
  ]
};
