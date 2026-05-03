import { Component } from '@angular/core';
import { Certificate } from '../../../core/models/resume.model';

@Component({
  selector: 'app-courses-and-certificates',
  imports: [],
  templateUrl: './courses-and-certificates.html',
  styleUrl: './courses-and-certificates.scss',
})
export class CoursesAndCertificates {
  protected certificates: Certificate[] = [
    {
      platform: "Stepik",
      issueDate: new Date("2023-08"),
      courseName: '"Поколение Python": курс для начинающих', 
      certificateLink: "https://stepik.org/cert/2148488"
    },
    {
      platform: "Stepik",
      issueDate: new Date("2023-11"),
      courseName: '"Поколение Python": курс для продвинутых', 
      certificateLink: "https://stepik.org/cert/2254380"
    },
    {
      platform: "Etude",
      issueDate: new Date("2024-04"),
      courseName: 'Введение в Git', 
      certificateLink: "https://etude.org/cert/mrxNcTqaUASqAqJsHRWqKU/"
    },
    {
      platform: "Stepik",
      issueDate: new Date("2024-08"),
      courseName: 'Автоматизация тестирования с помощью Selenium и Python', 
      certificateLink: "https://stepik.org/cert/2539921"
    }
  ]

  protected formatToHumanDate(isoString: Date): string {
    const date = new Date(isoString);
    const formattedDate = new Intl.DateTimeFormat('ru', {
      month: 'long',
      year: 'numeric'
    }).format(date);

    // Убираем " г."
    return formattedDate.replace(/\s?г\.?$/, '');
  }
}
