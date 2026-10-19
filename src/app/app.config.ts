import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

//Importamos esto para poder hacer las consultas
import { provideHttpClient,withFetch  } from '@angular/common/http';
//withFetch() es opcional, pero Angular lo recomienda cuando el proyecto tiene SSR

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),provideHttpClient(withFetch()),//Aqui lo agregamos para permitir las consultas HTTP al backend
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
