import { Injectable, signal } from '@angular/core';
import { Article, Comment } from '../../core/models/article.model';
import { IArticleCardStore } from './article-card-store.interface';

@Injectable()
export class ArticleCardStore implements IArticleCardStore {
  public article = signal<Article | null>(null);
  public comments = signal<Comment[]>([]);

  public saveArticle(article: Article) {
    this.article.set({
       ...article,
      imgSrc: article.imgSrc || 'assets/article-img-template.jpg'
    });
  }

  public saveComments(comments: Comment[]) {
    this.comments.set(comments);
  }
}