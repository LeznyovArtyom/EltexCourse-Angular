import { Injectable } from '@angular/core';
import { LoginData, RegisterData } from '../../core/models/user.model';
import { IAuthService } from './auth-service.interface';
import { Observable, of, throwError } from 'rxjs';
import { ApiLoginResponse, ApiLogoutResponse, ApiRegisterResponse, ApiUserInfoResponse, ApiUserResponse } from '../../core/models/auth-api.model';

@Injectable()
export class AuthLsService implements IAuthService {
  public login(userData: LoginData): Observable<ApiLoginResponse> {
    const users = this.getUsersFromStorage();
    const currentUser = users.find((user: ApiUserResponse) => user.username === userData.username && user.password === userData.password);

    if (currentUser) {
      const mockResponse = {
        access_token: currentUser.id,
        token_type: "Bearer",
        expires_in: "1h",
        user: {
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role
        }
      }
      return of(mockResponse);
    }

    return throwError(() => new Error('Неверный логин или пароль'));
  }

  public register(userData: RegisterData): Observable<ApiRegisterResponse> {
    const users = this.getUsersFromStorage();

    const newUser: ApiUserResponse = {
      id: crypto.randomUUID(),
      username: userData.username,
      email: userData.email,
      createdAt: new Date().toISOString(),
      lastActiveTime: new Date().toISOString(),
      isBlocked: false,
      role: 'user'
    }

    users.push({ ...newUser, password: userData.password });
    this.setUsersToStorage(users);

    const mockResponse = {
      message: "Пользователь успешно зарегистрирован",
      user: newUser
    }

    return of(mockResponse);
  }

  public logout(): Observable<ApiLogoutResponse> {
    return of({ message: "Успешный выход" });
  }

  public getUserInfo(): Observable<ApiUserInfoResponse> {
    const users = this.getUsersFromStorage();

    const token = localStorage.getItem("access_token");

    if (!token) {
      return throwError(() => new Error('Пользователь не авторизован'));
    }

    const currentUser = users.find((user: ApiUserResponse) => user.id === token);

    if (currentUser) {
      const userInfo: ApiUserInfoResponse = {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role
      };
      return of(userInfo);
    }

    return throwError(() => new Error('Пользователь не найден'));
  }

  private getUsersFromStorage() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private setUsersToStorage(users: RegisterData[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }
}
