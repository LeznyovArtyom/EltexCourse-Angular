import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IArticlesService } from './articles-service.interface';
import { Article, PaginatedArticles } from '../../core/models/article.model';
import { ARTICLES_PAGE_SIZE } from './pagination.token';
import { ApiArticleResponse, ApiArticlesResponse, ArticleFormData } from '../../core/models/article-api.model';

@Injectable()
export class ArticlesApiService implements IArticlesService {
  private httpClient = inject(HttpClient);
  protected readonly ARTICLES_PAGE_SIZE = inject(ARTICLES_PAGE_SIZE);

  public getArticles(currentPage: number): Observable<PaginatedArticles> {
    return this.httpClient.get<ApiArticlesResponse>(
      '/api/articles', { params: { page: currentPage, limit: this.ARTICLES_PAGE_SIZE }})
        .pipe(map(({ items, total }) => {
          return {
            articles: items.map((item: ApiArticleResponse) => this.mapToArticle(item)),
            total: total
          };
        })) 
  }

  public addArticle(data: ArticleFormData): Observable<Article> {
    const formData = new FormData();

    formData.append("title", data.title!);
    formData.append("content", data.text!);

    if (data.imageFile) {
      formData.append('image', data.imageFile);
    }

    return this.httpClient.post<ApiArticleResponse>('/api/articles', formData)
      .pipe(map((item) => this.mapToArticle(item)));
  }

  public editArticle(id: string, data: ArticleFormData): Observable<Article> {
    const formData = new FormData();

    formData.append("title", data.title!);
    formData.append("content", data.text!);

    if (data.imageFile) {
      formData.append('image', data.imageFile);
    }

    return this.httpClient.patch<ApiArticleResponse>(`/api/articles/${id}`, formData)
      .pipe(map((item) => this.mapToArticle(item)));
  }
  
  public deleteArticle(id: string): Observable<Article> {
    return this.httpClient.delete<ApiArticleResponse>(`/api/articles/${id}`)
      .pipe(map((item) => this.mapToArticle(item)));
  }

  private mapToArticle(item: ApiArticleResponse): Article {
    return { 
      id: item.id,
      title: item.title, 
      text: item.content,
      date: new Date(item.createdAt),
      imgSrc: item.imgSrc,
      rating: item.rating
    }
  }
}
