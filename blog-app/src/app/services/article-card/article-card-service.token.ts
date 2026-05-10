import { InjectionToken } from "@angular/core";
import { IArticleCardService } from "./article-card-service.interface";

export const ARTICLE_CARD_SERVICE_TOKEN = new InjectionToken<IArticleCardService>("ARTICLE_CARD_SERVICE_TOKEN");