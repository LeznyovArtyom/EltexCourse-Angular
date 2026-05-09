import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article, ArticleInfo, Comment } from '../../core/models/article.model';
import { IArticleCardService } from './article-card-service.interface';

@Injectable()
export class ArticleCardService implements IArticleCardService {
  public getArticle(id: string): Observable<ArticleInfo> {
    const articles: Article[] = this.getItemsFromStorage('articles');
    const allComments: Comment[] = this.getItemsFromStorage('comments');

    const article = articles.find((article) => article.id === id)!;
    const comments = allComments.filter((comment) => comment.articleId === id);

    return of({ article, comments });
  }

  public addComment(articleId: string, comment: Partial<Comment>): Observable<Comment[]> {
    const allComments: Comment[] = this.getItemsFromStorage('comments');

    const new_comment: Comment = {
      id: crypto.randomUUID(),
      author: comment.author!,
      text: comment.text!,
      date: new Date(),
      rating: 0,
      articleId: articleId
    }
    allComments.push(new_comment);

    this.setItemsToStorage("comments", allComments);

    const article_comments = allComments.filter((comment) => comment.articleId === articleId);
    return of(article_comments);
  }

  public changeCommentRating(id: string, action: string): Observable<Comment[]> {
    const comments: Comment[] = this.getItemsFromStorage('comments');
    let targetArticleId = '';
    const new_comments = comments.map((comment) => {
      if (comment.id === id) {
        targetArticleId = comment.articleId;
        if (action === 'down') {
          return { ...comment, rating: comment.rating - 1 };
        } else {
          return { ...comment, rating: comment.rating + 1 };
        }
      } else {
        return comment;
      }
    });

    this.setItemsToStorage("comments", new_comments);

    const articleComments = new_comments.filter(c => c.articleId === targetArticleId);
    return of(articleComments);
  }

  public changeArticleRating(id: string, action: string): Observable<Article> {
    const articles: Article[] = this.getItemsFromStorage('articles');
    const newArticles = articles.map((article) => {
      if (article.id === id) {
        if (action === 'down') {
          return { ...article, rating: article.rating - 1 };
        } else {
          return { ...article, rating: article.rating + 1 };
        }
      } else {
        return article;
      }
    });

    const article = newArticles.find((article) => article.id === id)!;

    this.setItemsToStorage("articles", newArticles);

    return of(article);
  }

  private getItemsFromStorage(LS_key: string) {
    const items = localStorage.getItem(LS_key);
    return items ? JSON.parse(items) : [];
  }

  private setItemsToStorage(LS_key: string, items: Comment[] | Article[]) {
    localStorage.setItem(LS_key, JSON.stringify(items));
  }
}