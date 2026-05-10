import { Component, inject, signal } from '@angular/core';
import { Header } from './ui/components/header/header';
import { Footer } from './ui/components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.iconRegistry
      .addSvgIcon('remove-article', this.sanitizer.bypassSecurityTrustResourceUrl('assets/remove-article.svg'))
      .addSvgIcon('edit-article', this.sanitizer.bypassSecurityTrustResourceUrl('assets/edit-article.svg'))
      .addSvgIcon('add-article', this.sanitizer.bypassSecurityTrustResourceUrl('assets/add-article.svg'))
      .addSvgIcon('analytics', this.sanitizer.bypassSecurityTrustResourceUrl('assets/analytics.svg'));
  }
}
