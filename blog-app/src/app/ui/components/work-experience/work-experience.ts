import { Component } from '@angular/core';
import { JobPosition } from '../../../core/models/resume.model';

@Component({
  selector: 'app-work-experience',
  imports: [],
  templateUrl: './work-experience.html',
  styleUrl: './work-experience.scss',
})
export class WorkExperience {
  protected positions: JobPosition[] = [
    {
      companyLogoImgPath: "assets/cc_logo.svg",
      position: "Senior Frontend Developer",
      companyAndPeriod: 'ООО "CoolCompany" • 2024 - настоящее время',
      responsibilities: [
        "Разаработка архитектры клиентской части веб-приложений.",
        "Поддержание качества работы микросервисов.",
        "Внедрение новых технологий в рабочий процесс."
      ]
    },
    {
      companyLogoImgPath: "assets/sp_logo.svg",
      position: "Junior Frontend Developer",
      companyAndPeriod: 'Sport Priority • январь 2026 - март 2026',
      responsibilities: [
        "Проектирование и реализация клиентской части веб-приложения на Angular и Fabric.js.",
        "Разработка интерактивного редактора подарочных сертификатов.",
        "Внедрение ИИ-инструментов для автоматической генерации графического и текстового контента.",
        "Организация взаимодействия фронтенда с бэкенд-сервисами через REST API."
      ]
    },
    {
      companyLogoImgPath: "assets/rytm_logo.svg",
      position: "Junior Frontend Developer",
      companyAndPeriod: 'ООО "Ритм" (июль 2024 - июнь 2025)',
      responsibilities: [
        "Ручное и автоматическое тестирование клиентской части веб-приложения на Vue.js.",
        "Разаработка авторских курсов по основам веб-программирования (HTML, CSS, JavaScript).",
        "Реализация полноценного веб-приложения на основе LLM."
      ]
    }
  ]
}
