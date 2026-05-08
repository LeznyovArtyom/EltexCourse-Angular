import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment } from '../../../core/models/article.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comment-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.scss',
})
export class CommentForm {
  public save = output<Partial<Comment>>();

  protected isDisabled: boolean = false;

  protected form = new FormGroup({
    author: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required)
  });

  protected closeCommentForm() {
    this.form.reset();
  }

  protected saveComment() {
    this.isDisabled = true;

    const formFields = this.form.getRawValue() as Partial<Comment>;
    
    setTimeout(() => {
      this.save.emit(formFields);
      this.form.reset();
      this.isDisabled = false;
    }, 2000);
  }
}
