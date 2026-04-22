import { Component, input, output, ViewChild} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-add-article-form',
  imports: [FormsModule],
  templateUrl: './add-article-form.html',
  styleUrl: './add-article-form.scss',
})
export class AddArticleForm {
  public isShow = input<boolean>(false);
  public isShowForm = output<boolean>();
  public add = output<Partial<Article>>();

  @ViewChild('addArticleForm') addArticleForm!: NgForm;

  protected title: string = '';
  protected text: string = '';
  protected isDisabled: boolean = false;

  protected closeAddArticleForm() {
    this.addArticleForm.resetForm();
    this.isShowForm.emit(false);
  }

  protected addArticle(form: NgForm) {
    if (form.invalid) {
      alert('Форма невалидна!');
      return;
    }

    this.isDisabled = true;
    
    setTimeout(() => {
      this.add.emit({ title: this.title, text: this.text });
      this.addArticleForm.resetForm();
      this.isDisabled = false;
    }, 2000)
  }
}
