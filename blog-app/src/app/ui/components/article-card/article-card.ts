import { Component, input, output } from '@angular/core';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-article-card',
  imports: [],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
  host: {
    '[class.layout-home]': 'viewMode() === "main"',
    '[class.layout-blog]': 'viewMode() === "blog"'
  }
})
export class ArticleCard {
  public article = input.required<Article>();
  public viewMode = input<'main' | 'blog'>('main');
  public delete = output<string>();

  protected formatToHumanDate(isoString: Date) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ru', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  deleteArticle(id: string) {
    this.delete.emit(id);
  }
}
