import { Component, input, output } from '@angular/core';
import { Article } from '../../../core/models/article.model';
import { Rating } from '../rating/rating';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-article-card',
  imports: [Rating, RouterLink, MatIconModule],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
  host: {
    '[class.layout-home]': 'viewMode() === "main"',
    '[class.layout-blog]': 'viewMode() === "blog"',
    '[class.layout-article]': 'viewMode() === "article"'
  }
})
export class ArticleCard {
  public article = input.required<Article>();
  public viewMode = input<'main' | 'blog' | 'article'>('main');
  public delete = output<string>();
  public edit = output<string>();
  public ratingChanged = output<'down' | 'up'>();

  protected formatToHumanDate(isoString: Date) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ru', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  protected deleteArticle(id: string, event: Event) {
    event.stopPropagation();
    this.delete.emit(id);
  }

  protected editArticle(id: string, event: Event) {
    event.stopPropagation();
    this.edit.emit(id);
  }

  protected changeArticleRating(action: 'down' | 'up') {
    this.ratingChanged.emit(action);
  }
}
