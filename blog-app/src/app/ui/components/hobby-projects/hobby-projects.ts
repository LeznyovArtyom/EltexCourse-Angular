import { Component } from '@angular/core';
import { Project } from '../../../core/models/resume.model';

@Component({
  selector: 'app-hobby-projects',
  imports: [],
  templateUrl: './hobby-projects.html',
  styleUrl: './hobby-projects.scss',
})
export class HobbyProjects {
  protected projects: Project[] = [
    {
      name: "Каталог фильмов и сериалов",
      description: "Каталог по просмотру фильмов, сериалов и мультфильмов на HTML, CSS и JavaScript. Поддерживает регистрацию/авторизацию, роли, инструменты для управления фильмами и сериалами, комментарии от пользователей и т.д."
    },
    {
      name: "Менеджер задач",
      description: "Менеджер по управлению задачами с удобной фильтрацией и личным кабинетом на Vue.js."
    },
    {
      name: "Цифровой помощник преподавателя",
      description: "Цифровой помощник преподавателя на основе LLM для сдачи лабораторных работ."
    },
    {
      name: "Редактор подарочных сертификатов",
      description: "Каталог + редактор подарочных сертификатов для CRM спортивных клубов на Angular и Fabric.js."
    }
  ]
}
