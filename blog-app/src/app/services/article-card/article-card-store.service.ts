import { Injectable, signal } from '@angular/core';
import { Article, Comment } from '../../core/models/article.model';
import { IArticleCardStore } from './article-card-store.interface';

@Injectable()
export class ArticleCardStore implements IArticleCardStore {
  public article = signal<Article>({
    id: "1000",
    title: "Красивый заголовок о жизни на марсе",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    date: new Date("2026-04-10"),
    img_path: "assets/article-img-template.jpg",
    rating: 0
  });
  public comments = signal<Comment[]>([
    {
      id: "1",
      author: "Артём",
      text: "Классная статья",
      date: new Date("2026-06-05"),
      rating: 0,
      article_id: "1000"
    },
    {
      id: "2",
      author: "Данил",
      text: "Мне очень понравилось",
      date: new Date("2026-04-05"),
      rating: 5,
      article_id: "1000"
    }
  ]);

  public saveArticle(article: Article) {
    this.article.set(article);
  }

  public saveComments(comments: Comment[]) {
    this.comments.set(comments);
  }
}