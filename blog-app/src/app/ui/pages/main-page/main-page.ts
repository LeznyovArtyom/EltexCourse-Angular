import { Component } from '@angular/core';
import { ArticleCard } from '../../components/article-card/article-card';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-main-page',
  imports: [ArticleCard],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  protected articles: Article[] = [
    {
      id: "1",
      title: "Архитектура микросервисов на FastAPI: от идеи до реализации",
      text: "В этой статье мы разберем, как спроектировать масштабируемую систему на Python. Обсудим разделение логики на отдельные сервисы, использование SQLModel для работы с базами данных и организацию взаимодействия через REST API.",
      date: new Date("2026-03-12"),
      img_path: "assets/article1.jpg"
    },
    {
      id: "2",
      title: "Мастерство Fabric.js: создание интерактивного графического редактора",
      text: "Узнайте, как использовать возможности объектной модели Fabric.js для работы с холстом. Рассмотрим управление слоями, масштабирование объектов без потери качества и экспорт готовых макетов в высоком разрешении.",
      date: new Date("2026-03-05"),
      img_path: "assets/article2.jpg"
    }
  ]
}
