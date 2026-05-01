import { inject, Injectable } from '@angular/core';
import { Article, PaginatedArticles } from '../../core/models/article.model';
import { IArticlesService } from './articles-service.interface';
import { delay, Observable, of } from 'rxjs';
import { ARTICLES_PAGE_SIZE } from './pagination.token';

@Injectable()
export class ArticlesService implements IArticlesService {
  protected readonly ARTICLES_PAGE_SIZE = inject(ARTICLES_PAGE_SIZE);

  public getArticles(currentPage: number): Observable<PaginatedArticles> {
    const articles = this.getArticlesFromStorage();
    return this.createPaginatedResponse(articles, currentPage, 3000);
  }

  public addArticle(data: Partial<Article>, currentPage: number): Observable<PaginatedArticles>  {
    const articles = this.getArticlesFromStorage();

    const newArticle: Article = {
        id: crypto.randomUUID(),
        title: data.title!,
        text: data.text!,
        date: new Date(),
        img_path: 'assets/article-img-template.jpg'
      }

    articles.push(newArticle);
    this.setArticlesToStorage(articles);

    return this.createPaginatedResponse(articles, currentPage, 200);
  }

  public editArticle(id: string, data: Partial<Article>, currentPage: number): Observable<PaginatedArticles> {
    let articles = this.getArticlesFromStorage();

    articles = articles.map(article => {
      if (article.id === id) {
        return { ...article, title: data.title!, text: data.text! }
      } else {
        return article;
      }
    });
    this.setArticlesToStorage(articles);

    return this.createPaginatedResponse(articles, currentPage, 300);
  }

  public deleteArticle(id: string, currentPage: number): Observable<PaginatedArticles> {
    let articles = this.getArticlesFromStorage();

    articles = articles.filter(article => article.id !== id);
    this.setArticlesToStorage(articles);

    return this.createPaginatedResponse(articles, currentPage, 300);
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
