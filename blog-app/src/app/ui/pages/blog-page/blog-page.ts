import { Component, ElementRef, OnInit, signal, viewChild } from '@angular/core';
import { ArticleForm } from '../../components/article-form/article-form';
import { ArticleCard } from '../../components/article-card/article-card';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-blog-page',
  imports: [ArticleForm, ArticleCard],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
})
export class BlogPage implements OnInit {
  private articleForm = viewChild.required('articleForm', { read: ElementRef<HTMLFormElement>});
  private statisticsDialog = viewChild.required<ElementRef<HTMLDialogElement>>('statisticsDialog');
  private closeDialogButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeDialogButton');

  protected isLoading = signal<boolean>(true);

  protected isShowForm: boolean = false;
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
    },
    {
      id: "3",
      title: "Переход на Angular Material: создаем современный UI за считанные часы",
      text: "Разберем преимущества использования готовых компонентов Angular Material. В статье представлены примеры кастомизации стандартных тем, работа с таблицами данных и настройка адаптивных диалоговых окон.",
      date: new Date("2026-02-28"),
      img_path: "assets/article3.jpg"
    },
    {
      id: "4",
      title: "Оптимизация Docker-образов для Python-приложений",
      text: "Как уменьшить вес вашего образа в несколько раз? Поговорим о многоэтапной сборке (multi-stage builds), использовании легковесных базовых образов и правильной настройке Nginx для раздачи статики фронтенда.",
      date: new Date("2026-02-20"),
      img_path: "assets/article4.jpg"
    },
    {
      id: "5",
      title: "Pinia vs Vuex: почему стоит обновить состояние в ваших Vue 3 проектах",
      text: "Сравнение двух популярных менеджеров состояния. Мы изучим модульную структуру Pinia, её полную поддержку TypeScript и то, как упростить типизацию данных в крупных приложениях.",
      date: new Date("2026-02-15"),
      img_path: "assets/article5.jpg"
    },
    {
      id: "6",
      title: "Автоматизация тестирования с Pytest и Selenium",
      text: "Практическое руководство по написанию автотестов. Узнайте, как настроить фикстуры, эмулировать действия пользователя в браузере и интегрировать проверку API с помощью библиотеки requests прямо в тестовый цикл.",
      date: new Date("2026-02-10"),
      img_path: "assets/article6.jpg"
    },
    {
      id: "7",
      title: "Современный TypeScript: типы, которые спасают ваш код",
      text: "TypeScript — это не только интерфейсы. Погрузимся в сложные типы (Generics, Utility Types), разберем преимущества строгой типизации при работе с внешними API и узнаем, как минимизировать ошибки на этапе компиляции.",
      date: new Date("2026-02-02"),
      img_path: "assets/article7.jpg"
    },
    {
      id: "8",
      title: "Проектирование баз данных MySQL для высоконагруженных систем",
      text: "От нормализации до индексов. Рассмотрим, как правильно спроектировать схему данных, избежать проблем с производительностью при росте количества записей и эффективно использовать связи One-to-Many и Many-to-Many.",
      date: new Date("2026-01-25"),
      img_path: "assets/article8.jpg"
    },
    {
      id: "9",
      title: "Быстрый старт с Vite: прощай, медленная сборка Webpack",
      text: "Почему современные разработчики выбирают Vite? В статье описаны принципы работы Native ESM, настройка горячей перезагрузки (HMR) и процесс миграции существующих проектов на новый инструмент сборки.",
      date: new Date("2026-01-18"),
      img_path: "assets/article9.jpg"
    },
    {
      id: "10",
      title: "Postman для профи: больше, чем просто проверка запросов",
      text: "Изучаем продвинутые функции Postman: создание коллекций для командной разработки, использование переменных окружения и написание скриптов для автоматической валидации ответов сервера.",
      date: new Date("2026-01-10"),
      img_path: "assets/article10.jpg"
    }
  ];
  protected editingArticle: Article | null = null;

  ngOnInit() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 3000)
  }

  protected deleteArticle(id: string) {
    this.articles = this.articles.filter(article => article.id !== id);
  }

  // Добавить новую или изменить существующую статью
  protected saveArticle(data: Partial<Article>) {
    if (this.editingArticle == null) {
      const newArticle: Article = {
        id: crypto.randomUUID(),
        title: data.title!,
        text: data.text!,
        date: new Date(),
        img_path: 'assets/article-img-template.jpg'
      }

      this.articles.push(newArticle);
    } else {
      this.articles = this.articles.map(article => {
        if (article.id === this.editingArticle!.id) {
          return { ...article, title: data.title!, text: data.text! }
        } else {
          return article;
        }
      });

      this.editingArticle = null;

      alert("Статья успешно обновлена!");
    }

    this.toggleArticleForm(false);
  }

  protected editArticle(id: string) {
    this.editingArticle = this.articles.find((article) => article.id === id)!;
    this.toggleArticleForm(true);
    setTimeout(() => {
      this.articleForm().nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50)
  }

  protected toggleArticleForm(isShow: boolean) {
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
    return this.articles.length;
  }
}
