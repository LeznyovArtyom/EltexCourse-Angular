import { Component, computed, effect, input, output} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-article-form',
  imports: [ReactiveFormsModule],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss',
})
export class ArticleForm {
  public article = input<Article | null>(null);
  public isShow = input<boolean>(false);
  public isShowForm = output<boolean>();
  public save = output<Partial<Article>>();

  public isEditMode = computed<boolean>(() => this.article() !== null);

  protected isDisabled: boolean = false;
  
  protected form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(25)]),
    text: new FormControl('', Validators.required)
  });

  constructor() {
    effect(() => {
      const article = this.article();

      this.form.setValue({ title: article ? article.title : '', text: article ? article.text : '' });
    })
  }

  protected closeArticleForm() {
    this.form.reset();
    this.isShowForm.emit(false);
  }

  protected saveArticle() {
    this.isDisabled = true;

    const formFields = this.form.getRawValue() as Partial<Article>;
    
    setTimeout(() => {
      this.save.emit(formFields);
      this.form.reset();
      this.isDisabled = false;
    }, 2000);
  }
}
