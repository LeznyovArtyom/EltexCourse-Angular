import { Component, inject, OnInit } from '@angular/core';
import { Article } from '../../../core/models/article.model';
import { ArticleCard } from '../article-card/article-card';
import { ARTICLES_SERVICE_TOKEN } from '../../../services/articles/articles-service.token';
import { ARTICLES_STORE_SERVICE_TOKEN } from '../../../services/articles/articles-store.token';

@Component({
  selector: 'app-recent-articles',
  imports: [ArticleCard],
  templateUrl: './recent-articles.html',
  styleUrl: './recent-articles.scss',
})
export class RecentArticles implements OnInit {
  private articlesService = inject(ARTICLES_SERVICE_TOKEN);
  private articlesStoreService = inject(ARTICLES_STORE_SERVICE_TOKEN);

  ngOnInit() {
    if (this.articlesStoreService.articles().length === 0 || this.articlesStoreService.currentPage() !== 1) {
      this.articlesService.getArticles(1).subscribe(({articles, total}) => {
        this.articlesStoreService.saveArticles(articles, total);
      });
    }
  }

  protected get_articles() {
    return this.articlesStoreService.articles().slice(0, 2);
  }
}
