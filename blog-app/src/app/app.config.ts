import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { ARTICLES_SERVICE_TOKEN } from './services/articles/articles-service.token';
import { ArticlesService } from './services/articles/articles.service';
import { ARTICLES_STORE_SERVICE_TOKEN } from './services/articles/articles-store.token';
import { ArticlesStoreService } from './services/articles/articles-store.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ENV_CONFIF } from '../environments/environment.token';
import { ArticlesApiService } from './services/articles/articles-api.service';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { AUTH_SERVICE_TOKEN } from './services/auth/auth-service.token';
import { AuthLsService } from './services/auth/auth-ls.service';
import { AuthApiService } from './services/auth/auth-api.service';
import { AUTH_STORE_TOKEN } from './services/auth/auth-store.token';
import { AuthStore } from './services/auth/auth-store.service';
import { authInterceptor } from './interceptors/auth.interceptor';

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
    { provide: AUTH_SERVICE_TOKEN, useClass: environment.useLSStorageService ? AuthLsService : AuthApiService },
    { provide: AUTH_STORE_TOKEN, useClass: AuthStore },
    { provide: ENV_CONFIF, useValue: environment },
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: '/graphql',
        }),
        cache: new InMemoryCache(),
      };
    })
  ]
};
