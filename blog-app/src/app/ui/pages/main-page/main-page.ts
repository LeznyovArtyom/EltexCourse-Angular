import { Component } from '@angular/core';
import { AboutMe } from '../../components/about-me/about-me';
import { RecentArticles } from '../../components/recent-articles/recent-articles';
import { WorkExperience } from '../../components/work-experience/work-experience';
import { Education } from '../../components/education/education';
import { CoursesAndCertificates } from '../../components/courses-and-certificates/courses-and-certificates';
import { Skills } from '../../components/skills/skills';
import { Achievements } from '../../components/achievements/achievements';
import { HobbyProjects } from '../../components/hobby-projects/hobby-projects';

@Component({
  selector: 'app-main-page',
  imports: [AboutMe, RecentArticles, WorkExperience, Education, CoursesAndCertificates, Skills, Achievements, HobbyProjects],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {

}