import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleCard } from '../article-card/article-card';
import { ARTICLES_SERVICE_TOKEN } from '../../../services/articles/articles-service.token';
import { ARTICLES_STORE_SERVICE_TOKEN } from '../../../services/articles/articles-store.token';

@Component({
  selector: 'app-recent-articles',
  imports: [ArticleCard, RouterLink],
  templateUrl: './recent-articles.html',
  styleUrl: './recent-articles.scss',
})
export class RecentArticles implements OnInit {
  private articlesService = inject(ARTICLES_SERVICE_TOKEN);
  private articlesStoreService = inject(ARTICLES_STORE_SERVICE_TOKEN);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    if (this.articlesStoreService.articles().length === 0 || this.articlesStoreService.currentPage() !== 1) {
      this.articlesService.getArticles(1).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({articles, total}) => {
        this.articlesStoreService.saveArticles(articles, total);
      });
    }
  }

  protected get_articles() {
    return this.articlesStoreService.articles().slice(0, 2);
  }
}
