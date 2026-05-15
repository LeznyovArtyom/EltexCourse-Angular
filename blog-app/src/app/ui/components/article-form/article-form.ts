import { ChangeDetectorRef, Component, computed, effect, ElementRef, inject, input, output, viewChild} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Article } from '../../../core/models/article.model';
import { ArticleFormData } from '../../../core/models/article-api.model';

@Component({
  selector: 'app-article-form',
  imports: [ReactiveFormsModule],
  templateUrl: './article-form.html',
  styleUrl: './article-form.scss',
})
export class ArticleForm {
  private cdr = inject(ChangeDetectorRef);

  public article = input<Article | null>(null);
  public isShow = input<boolean>(false);
  public isShowForm = output<boolean>();
  public save = output<ArticleFormData>();

  protected isEditMode = computed<boolean>(() => this.article() !== null);
  protected formTitle = computed<string>(() => {
    return this.isEditMode() ? "Изменить статью" : "Добавить статью";
  });
  protected formButton = computed<string>(() => {
    return this.isEditMode() ? "Сохранить" : "Добавить";
  });

  protected fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected isDisabled: boolean = false;
  
  protected form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(25)]),
    text: new FormControl('', Validators.required),
    imgSrc: new FormControl(''),
    imageFile: new FormControl<File | null>(null)
  });

  constructor() {
    effect(() => {
      const article = this.article();

      this.form.setValue({ 
        title: article ? article.title : '',
        text: article ? article.text : '',
        imgSrc: article ? article.imgSrc : '',
        imageFile: null });
    })
  }

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    // Проверяем, что пользователь выбрал файл
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Сохраняем физический файл в форму (для бэкенда)
      this.form.patchValue({
        imageFile: file
      });

      // Читаем файл в Base64 только ради превью в HTML и LocalStorage
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({
          imgSrc: reader.result as string
        });

        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  protected closeArticleForm() {
    this.form.reset();
    this.resetFileInput();
    this.isShowForm.emit(false);
  }

  protected saveArticle() {
    this.isDisabled = true;

    const formFields = this.form.getRawValue() as Partial<Article>;
    
    setTimeout(() => {
      this.save.emit(formFields);
      this.form.reset();
      this.resetFileInput();
      this.isDisabled = false;
    }, 1000);
  }

  // Очистка визуала инпута
  private resetFileInput() {
    const inputEl = this.fileInput();
    if (inputEl) {
      inputEl.nativeElement.value = '';
    }
  }
}
