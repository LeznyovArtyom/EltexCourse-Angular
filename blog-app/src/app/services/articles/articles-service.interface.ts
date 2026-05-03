import { Observable } from "rxjs";
import { Article, PaginatedArticles } from "../../core/models/article.model";

export interface IArticlesService {
  getArticles(currentPage: number): Observable<PaginatedArticles>,
  addArticle(data: Partial<Article>, currentPage: number): Observable<PaginatedArticles>,
  editArticle(id: string, data: Partial<Article>, currentPage: number): Observable<PaginatedArticles>,
  deleteArticle(id: string, currentPage: number): Observable<PaginatedArticles>
}