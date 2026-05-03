import { Component } from '@angular/core';
import { SkillGroup } from '../../../core/models/resume.model';

@Component({
  selector: 'app-skills',
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  skillGroups: SkillGroup[] = [
    {
      category: "Frontend",
      items: ["HTML5", "CSS3", "Bootstrap", "JavaScript", "Fabric.js", "Vue.js", "Pinia", "Angular", "Angular Material"]
    },
    {
      category: "Backend",
      items: ["Python (FastAPI)", "REST API",  "SQL (MySQL, SQLModel)", "Проектирование баз данных и микросервисов"]
    },
    {
      category: "Инструменты и DevOps",
      items: ["Vs Code", "Git", "Vite", "npm", "Docker", "Nginx"]
    },
    {
      category: "Тестирование и дизайн",
      items: ["Postman", "Selenium", "Pytest", "Manual Testing", "Figma"]
    }
  ]
}
