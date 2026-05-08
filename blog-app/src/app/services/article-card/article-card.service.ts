import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article, ArticleInfo, Comment } from '../../core/models/article.model';
import { IArticleCardService } from './article-card-service.interface';

@Injectable()
export class ArticleCardService implements IArticleCardService {
  public getArticle(id: string): Observable<ArticleInfo> {
    const articles: Article[] = this.getItemsFromStorage('articles');
    const all_comments: Comment[] = this.getItemsFromStorage('comments');

    const article = articles.find((article) => article.id === id)!;
    const comments = all_comments.filter((comment) => comment.article_id === id);

    return of({ article, comments });
  }

  public addComment(article_id: string, comment: Partial<Comment>): Observable<Comment[]> {
    const comments: Comment[] = this.getItemsFromStorage('comments');

    const new_comment: Comment = {
      id: crypto.randomUUID(),
      author: comment.author!,
      text: comment.text!,
      date: new Date(),
      rating: 0,
      article_id: article_id
    }
    comments.push(new_comment);

    this.setItemsToStorage("comments", comments);

    return of(comments);
  }

  // public addArticle(data: Partial<Article>, currentPage: number): Observable<PaginatedArticles>  {
  //     const articles = this.getArticlesFromStorage();
  
  //     const newArticle: Article = {
  //         id: crypto.randomUUID(),
  //         title: data.title!,
  //         text: data.text!,
  //         date: new Date(),
  //         img_path: 'assets/article-img-template.jpg',
  //         rating: 0
  //       }
  
  //     articles.push(newArticle);
  //     this.setArticlesToStorage(articles);
  
  //     return this.createPaginatedResponse(articles, currentPage, 200);
  //   }

  public changeCommentRating(id: string, action: string): Observable<Comment[]> {
    const comments: Comment[] = this.getItemsFromStorage('comments');
    const new_comments = comments.map((comment) => {
      if (comment.id === id) {
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

    return of(new_comments);
  }

  public changeArticleRating(id: string, action: string): Observable<Article> {
    const articles: Article[] = this.getItemsFromStorage('articles');
    const new_articles = articles.map((article) => {
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

    const article = new_articles.find((article) => article.id === id)!;

    this.setItemsToStorage("articles", new_articles);

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