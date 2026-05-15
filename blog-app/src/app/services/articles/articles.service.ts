import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Article, PaginatedArticles } from '../../core/models/article.model';
import { IArticlesService } from './articles-service.interface';
import { ARTICLES_PAGE_SIZE } from './pagination.token';

@Injectable()
export class ArticlesService implements IArticlesService {
  protected readonly ARTICLES_PAGE_SIZE = inject(ARTICLES_PAGE_SIZE);

  public getArticles(currentPage?: number, msDelay: number = 2000): Observable<PaginatedArticles> {
    const articles = this.getArticlesFromStorage();

    if (!currentPage) {
      return of({
        articles: articles,
        total: articles.length
      });
    }

    return this.createPaginatedResponse(articles, currentPage, msDelay);
  }

  public addArticle(data: Partial<Article>): Observable<Article>  {
    const articles = this.getArticlesFromStorage();

    const newArticle: Article = {
      id: crypto.randomUUID(),
      title: data.title!,
      text: data.text!,
      date: new Date(),
      imgSrc: data.imgSrc || null,
      rating: 0
    }

    articles.push(newArticle);
    this.setArticlesToStorage(articles);

    return of(newArticle).pipe(delay(200));
  }

  public editArticle(id: string, data: Partial<Article>): Observable<Article> {
    let articles = this.getArticlesFromStorage();
    let updatedArticle!: Article;

    articles = articles.map(article => {
      if (article.id === id) {
        updatedArticle = { 
          ...article, 
          title: data.title!,
          text: data.text!,
          imgSrc: data.imgSrc || null
        };
        return updatedArticle;
      } else {
        return article;
      }
    });
    this.setArticlesToStorage(articles);

    return of(updatedArticle).pipe(delay(300));
  }

  public deleteArticle(id: string): Observable<Article> {
    let articles = this.getArticlesFromStorage();
    let deletedArticle!: Article;

    articles = articles.filter(article => { 
      if (article.id === id) {
        deletedArticle = article;
        return false;
      };
      return true;
    });
    this.setArticlesToStorage(articles);

    return of(deletedArticle).pipe(delay(300));
  }

  private getArticlesFromStorage(): Article[] {
    const articles = localStorage.getItem('articles');
    return articles ? JSON.parse(articles) : [];
  }

  private setArticlesToStorage(articles: Article[]) {
    localStorage.setItem('articles', JSON.stringify(articles));
  }
  
  private createPaginatedResponse(articles: Article[], currentPage: number, delayMs: number) {
    const total = articles.length;

    const paginatedArticles = articles.slice(
      this.ARTICLES_PAGE_SIZE * (currentPage - 1), 
      this.ARTICLES_PAGE_SIZE * currentPage
    );

    return of({
      articles: paginatedArticles,
      total: total
    }).pipe(delay(delayMs));
  }
}
