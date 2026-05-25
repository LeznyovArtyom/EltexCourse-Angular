import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Header } from './ui/components/header/header';
import { Footer } from './ui/components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AUTH_STORE_TOKEN } from './services/auth/auth-store.token';
import { AUTH_SERVICE_TOKEN } from './services/auth/auth-service.token';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);
  private authStore = inject(AUTH_STORE_TOKEN);
  private authService = inject(AUTH_SERVICE_TOKEN);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.iconRegistry
      .addSvgIcon('remove-article', this.sanitizer.bypassSecurityTrustResourceUrl('assets/remove-article.svg'))
      .addSvgIcon('edit-article', this.sanitizer.bypassSecurityTrustResourceUrl('assets/edit-article.svg'))
      .addSvgIcon('add-article', this.sanitizer.bypassSecurityTrustResourceUrl('assets/add-article.svg'))
      .addSvgIcon('analytics', this.sanitizer.bypassSecurityTrustResourceUrl('assets/analytics.svg'));
  }

  ngOnInit() {
    const token = localStorage.getItem("access_token");

    if (token) {
      this.authService.getUserInfo().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) => {
          this.authStore.saveUser(response.username, response.role);
        },
        error: (error) => {
          console.error("Ошибка при получении информации о пользователе:", error);
        }
      })
    }
  }
}
