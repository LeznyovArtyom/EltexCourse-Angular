import { Component } from '@angular/core';
import { Achievement } from '../../../core/models/resume.model';

@Component({
  selector: 'app-achievements',
  imports: [],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss',
})
export class Achievements {
  protected achievements: Achievement[] = [
    {
      name: "AI / Development",
      description: "Разработал цифрового помощника преподавателя на основе больших языковых моделей для образовательной платформы."
    },
    {
      name: "QA / Stability",
      description: "Повысил стабильность системы за счет регулярного проведения ручного функционального тестирования компонентов."
    },
    {
      name: "Testing / Automation",
      description: "Сократил время на регрессионные проверки, разработав и внедрив наборы автотестов для ключевых модулей."
    },
    {
      name: "Education / Frontend",
      description: "Спроектировал и запустил авторскую линейку курсов по Frontend-разработке для начинающих (HTML5, CSS3, JavaScript)."
    }
  ]
}
