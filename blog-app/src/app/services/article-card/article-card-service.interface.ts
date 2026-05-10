import { Observable } from "rxjs";
import { Article, Comment, ArticleInfo } from "../../core/models/article.model";

export interface IArticleCardService {
  getArticle(id: string): Observable<ArticleInfo>;
  addComment(article_id: string, comment: Partial<Comment>): Observable<Comment[]>;
  changeCommentRating(id: string, action: string): Observable<Comment[]>;
  changeArticleRating(id: string, action: string): Observable<Article>;
}