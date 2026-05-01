import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { ARTICLES_SERVICE_TOKEN } from './services/articles/articles-service.token';
import { ArticlesService } from './services/articles/articles.service';
import { ARTICLES_STORE_SERVICE_TOKEN } from './services/articles/articles-store.token';
import { ArticlesStoreService } from './services/articles/articles-store.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    { provide: ARTICLES_SERVICE_TOKEN, useClass: ArticlesService },
    { provide: ARTICLES_STORE_SERVICE_TOKEN, useClass: ArticlesStoreService }
  ]
};
