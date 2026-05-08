import { InjectionToken } from "@angular/core";
import { IArticleCardStore } from "./article-card-store.interface";

export const ARTICLE_CARD_STORE_TOKEN = new InjectionToken<IArticleCardStore>("ARTICLE_CARD_STORE_TOKEN");