import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Comment, RatingPayload } from '../../../core/models/article.model';
import { Rating } from '../rating/rating';

@Component({
  selector: 'app-comments',
  imports: [MatCardModule, Rating],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class Comments {
  public comments = input<Comment[]>();
  public ratingChanged = output<RatingPayload>();

  protected formatToHumanDate(isoString: Date) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ru', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  protected changeCommentRating(commentId: string, action: 'down' | 'up') {
    this.ratingChanged.emit({ commentId, action });
  }
}
