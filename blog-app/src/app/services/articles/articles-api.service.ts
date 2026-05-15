import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IArticlesService } from './articles-service.interface';
import { Article, PaginatedArticles } from '../../core/models/article.model';
import { ARTICLES_PAGE_SIZE } from './pagination.token';
import { ENV_CONFIF } from '../../../environments/environment.token';
import { ApiArticleResponse, ApiArticlesResponse, ArticleFormData } from '../../core/models/article-api.model';

@Injectable({ providedIn: 'root' })
export class ArticlesApiService implements IArticlesService {
  private httpClient = inject(HttpClient);
  protected readonly ARTICLES_PAGE_SIZE = inject(ARTICLES_PAGE_SIZE);
  private ENV_CONFIG = inject(ENV_CONFIF);

  public getArticles(currentPage: number): Observable<PaginatedArticles> {
    return this.httpClient.get<ApiArticlesResponse>(`/api/articles?page=${currentPage}&limit=${this.ARTICLES_PAGE_SIZE}`)
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
    const backendUrl = this.ENV_CONFIG.apiUrl;

    // Восстанавливаем путь картинки из бекенда
    let fullImgUrl = item.imgSrc;
    if (item.imgSrc && item.imgSrc.startsWith('/')) {
      fullImgUrl = `${backendUrl}${item.imgSrc}`;
    }

    return { 
      id: item.id,
      title: item.title, 
      text: item.content,
      date: new Date(item.createdAt),
      imgSrc: fullImgUrl,
      rating: item.rating
    }
  }
}
