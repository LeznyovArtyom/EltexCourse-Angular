import { Component, DestroyRef, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleCard } from '../../components/article-card/article-card';
import { Article } from '../../../core/models/article.model';
import { Pagination } from '../../components/pagination/pagination';
import { ArticleForm } from '../../components/article-form/article-form';
import { ARTICLES_SERVICE_TOKEN } from '../../../services/articles/articles-service.token';
import { ARTICLES_STORE_SERVICE_TOKEN } from '../../../services/articles/articles-store.token';

@Component({
  selector: 'app-blog-page',
  imports: [ArticleCard, Pagination, ArticleForm],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
})
export class BlogPage implements OnInit {
  private articlesService = inject(ARTICLES_SERVICE_TOKEN);
  private articlesStoreService = inject(ARTICLES_STORE_SERVICE_TOKEN);
  private destroyRef = inject(DestroyRef);

  private articleForm = viewChild.required('articleForm', { read: ElementRef<HTMLFormElement>});
  private statisticsDialog = viewChild.required<ElementRef<HTMLDialogElement>>('statisticsDialog');
  private closeDialogButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeDialogButton');

  protected isLoading = signal<boolean>(true);
  protected articles = this.articlesStoreService.articles;
  protected currentPage = this.articlesStoreService.currentPage;

  protected isShowForm: boolean = false;
  protected editingArticle: Article | null = null;

  ngOnInit() {
    if (this.articles().length > 0) {
      this.isLoading.set(false);
    } else {
      this.articlesService.getArticles(this.currentPage()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({articles, total}) => {
        this.articlesStoreService.saveArticles(articles, total);
        this.isLoading.set(false);
      });
    }
  }

  protected deleteArticle(id: string) {
    this.articlesService.deleteArticle(id, this.currentPage()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({articles, total}) => {
      this.articlesStoreService.saveArticles(articles, total);
    })
    this.toggleArticleForm(false);
  }

  // Добавить новую или изменить существующую статью
  protected saveArticle(data: Partial<Article>) {
    if (this.editingArticle == null) {
      this.articlesService.addArticle(data, this.currentPage()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({articles, total}) => {
        this.articlesStoreService.saveArticles(articles, total);
      });
    } else {
      this.articlesService.editArticle(this.editingArticle.id, data, this.currentPage()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({articles, total}) => {
        this.articlesStoreService.saveArticles(articles, total);
      })

      alert("Статья успешно обновлена!");
    }

    this.toggleArticleForm(false);
  }

  protected editArticle(id: string) {
    this.editingArticle = this.articles().find((article) => article.id === id)!;
    this.toggleArticleForm(true);
    setTimeout(() => {
      this.articleForm().nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50)
  }

  protected changePage(page: number) {
    this.articlesStoreService.setPage(page);

    this.isLoading.set(true);

    this.articlesService.getArticles(this.currentPage()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({articles, total}) => {
      this.articlesStoreService.saveArticles(articles, total);
      this.isLoading.set(false);
    })
  }

  protected toggleArticleForm(isShow: boolean) {
    if (!isShow) {
      this.editingArticle = null;
    }
    this.isShowForm = isShow;
  }

  protected showDialog() {
    this.statisticsDialog().nativeElement.showModal();
  }

  protected closeDialog(event: MouseEvent) {
    const dialogEl = this.statisticsDialog().nativeElement;
    const btnEl = this.closeDialogButton().nativeElement;

    if (event.target === dialogEl|| event.target === btnEl) {
      dialogEl.close();
    }
  }

  protected getArticlesCount() {
    return this.articlesStoreService.totalArticles();
  }
}
