import { Injectable, signal } from '@angular/core';
import { Article } from '../../core/models/article.model';
import { IArticlesStoreService } from './articles-store.interface';

@Injectable({ providedIn: 'root' })
export class ArticlesStoreService implements IArticlesStoreService {
  public articles = signal<Article[]>([]);
  public currentPage = signal<number>(1);
  public totalArticles = signal<number>(0);

  public saveArticles(articles: Article[], total: number) {
    this.articles.set(articles);
    this.totalArticles.set(total);
  }

  public setPage(page: number) {
    this.currentPage.set(page);
  }
}
