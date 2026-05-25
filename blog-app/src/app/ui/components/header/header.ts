import { Component, DestroyRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import { LoginDialog } from '../login-dialog/login-dialog';
import { AUTH_SERVICE_TOKEN } from '../../../services/auth/auth-service.token';
import { AUTH_STORE_TOKEN } from '../../../services/auth/auth-store.token';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AUTH_SERVICE_TOKEN);
  protected authStore = inject(AUTH_STORE_TOKEN);

  protected openDialog() {
    const dialogRef = this.dialog.open(LoginDialog);
    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  protected logout() {
    this.authService.logout().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        localStorage.removeItem("access_token");
        this.authStore.clearUser();
      },
      error: (error) => {
        console.error("Ошибка при выходе:", error);
      }
    })
  }
}
