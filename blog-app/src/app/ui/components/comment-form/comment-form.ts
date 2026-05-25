import { Component, effect, inject, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment } from '../../../core/models/article.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AUTH_STORE_TOKEN } from '../../../services/auth/auth-store.token';

@Component({
  selector: 'app-comment-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.scss',
})
export class CommentForm {
  private authStore = inject(AUTH_STORE_TOKEN);

  public save = output<Partial<Comment>>();

  private formDirective = viewChild(FormGroupDirective);

  protected isDisabled: boolean = false;

  protected form = new FormGroup({
    author: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required)
  });

  constructor() {
    effect(() => {
      const userName = this.authStore.name();
      this.form.patchValue({ author: userName });
    });
  }

  protected closeCommentForm() {
    this.formDirective()?.resetForm();
  }

  protected saveComment() {
    this.isDisabled = true;

    const formFields = this.form.getRawValue() as Partial<Comment>;
    
    setTimeout(() => {
      this.save.emit(formFields);
      this.formDirective()?.resetForm();
      this.isDisabled = false;
    }, 1000);
  }
}
