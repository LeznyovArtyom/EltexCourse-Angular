import { InjectionToken } from "@angular/core";
import { IArticlesStoreService } from "./articles-store.interface";

export const ARTICLES_STORE_SERVICE_TOKEN = new InjectionToken<IArticlesStoreService>("ARTICLES_STORE_SERVICE_TOKEN");