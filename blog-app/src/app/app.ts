import { Component, signal } from '@angular/core';
import { Header } from './ui/components/header/header';
import { MainPage } from './ui/pages/main-page/main-page';
import { Footer } from './ui/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, MainPage, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('blog-app');
}
