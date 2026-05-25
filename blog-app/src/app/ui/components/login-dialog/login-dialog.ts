import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AUTH_SERVICE_TOKEN } from '../../../services/auth/auth-service.token';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AUTH_STORE_TOKEN } from '../../../services/auth/auth-store.token';

@Component({
  selector: 'app-login-dialog',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, 
            MatInputModule, ReactiveFormsModule],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.scss',
})
export class LoginDialog {
  private authService = inject(AUTH_SERVICE_TOKEN);
  private authStore = inject(AUTH_STORE_TOKEN);
  private destroyRef = inject(DestroyRef);
  private dialogRef = inject(MatDialogRef<LoginDialog>);

  protected isLogin = true;

  protected form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: Validators.required }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl({ value: '', disabled: true }, { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  protected login() {
    if (this.form.invalid) return;

    const formFields = this.form.getRawValue();

    this.authService.login(formFields).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.authStore.saveUser(response.user.username, response.user.role);

        localStorage.setItem("access_token", response.access_token);

        this.dialogRef.close(true);
      },
      error: (error) => console.error("Ошибка входа:", error)
    });
  }

  protected register() {
    if (this.form.invalid) return;

    const formFields = this.form.getRawValue();

    this.authService.register(formFields).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.login();
      },
      error: (error) => console.error("Ошибка регистрации:", error)
    });
  }

  protected toggleForm(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;

    const emailControl = this.form.controls.email;
    if (this.isLogin) {
      emailControl.disable();
    } else {
      emailControl.enable();
    }
  }
}
