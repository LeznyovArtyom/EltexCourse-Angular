import { WritableSignal } from "@angular/core";
import { Article, Comment } from "../../core/models/article.model";

export interface IArticleCardStore {
  article: WritableSignal<Article | null>;
  comments: WritableSignal<Comment[]>;
  saveArticle(article: Article): void;
  saveComments(comments: Comment[]): void;
}