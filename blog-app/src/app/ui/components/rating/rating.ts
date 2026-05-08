import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
})
export class Rating {
  public rating = input.required<number>();
  public ratingChanged = output<'down' | 'up'>();

  protected changeRating(action: 'down' | 'up') {
    this.ratingChanged.emit(action);
  }
}
