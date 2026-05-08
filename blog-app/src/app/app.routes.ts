import { Routes } from '@angular/router';
import { MainPage } from './ui/pages/main-page/main-page';
import { BlogPage } from './ui/pages/blog-page/blog-page';
import { ArticlePage } from './ui/pages/article-page/article-page';

export const routes: Routes = [
  { path: "", component: MainPage, title: "Главная" },
  { path: "blog", component: BlogPage, title: "Блог" },
  { path: "article/:id", component: ArticlePage, title: "Страница статьи" }
];
