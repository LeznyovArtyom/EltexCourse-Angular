import { Component, computed, inject, input, output } from '@angular/core';
import { ARTICLES_PAGE_SIZE } from '../../../services/articles/pagination.token';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  protected readonly ARTICLES_PAGE_SIZE = inject(ARTICLES_PAGE_SIZE);

  public currentPage = input<number>(1);
  public totalArticles = input<number>(0);
  public pageChanged = output<number>();

  public totalPages = computed(() => Math.ceil(this.totalArticles() / this.ARTICLES_PAGE_SIZE));

  protected changePage(page: number) {
    this.pageChanged.emit(page);
  }

  protected get_pages() {
    return Array.from({ length: this.totalPages() }, (_, index) => index + 1);
  }
}
