import { Observable } from "rxjs";
import { Article, PaginatedArticles } from "../../core/models/article.model";

export interface IArticlesService {
  getArticles(currentPage: number, msDelay?: number): Observable<PaginatedArticles>;
  addArticle(data: Partial<Article>): Observable<Article>;
  editArticle(id: string, data: Partial<Article>): Observable<Article>;
  deleteArticle(id: string): Observable<Article>;
}