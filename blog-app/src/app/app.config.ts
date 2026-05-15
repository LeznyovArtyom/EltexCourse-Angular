import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { ARTICLES_SERVICE_TOKEN } from './services/articles/articles-service.token';
import { ArticlesService } from './services/articles/articles.service';
import { ARTICLES_STORE_SERVICE_TOKEN } from './services/articles/articles-store.token';
import { ArticlesStoreService } from './services/articles/articles-store.service';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ENV_CONFIF } from '../environments/environment.token';
import { ArticlesApiService } from './services/articles/articles-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    { provide: ARTICLES_SERVICE_TOKEN, useClass: environment.useLSStorageService ? ArticlesService : ArticlesApiService },
    { provide: ARTICLES_STORE_SERVICE_TOKEN, useClass: ArticlesStoreService },
    { provide: ENV_CONFIF, useValue: environment }
  ]
};
