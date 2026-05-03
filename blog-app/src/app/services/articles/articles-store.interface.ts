import { WritableSignal } from "@angular/core";
import { Article } from "../../core/models/article.model";

export interface IArticlesStoreService {
  articles: WritableSignal<Article[]>,
  currentPage: WritableSignal<number>,
  totalArticles: WritableSignal<number>,
  saveArticles(articles: Article[], total: number): void,
  setPage(page: number): void
}