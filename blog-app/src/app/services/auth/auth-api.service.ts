import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginData, RegisterData } from "../../core/models/user.model";
import { ApiLoginResponse, ApiLogoutResponse, ApiRegisterResponse, ApiUserInfoResponse } from "../../core/models/auth-api.model";
import { Observable } from "rxjs";
import { IAuthService } from "./auth-service.interface";

@Injectable()
export class AuthApiService implements IAuthService {
  private httpClient = inject(HttpClient);

  public login(authData: LoginData): Observable<ApiLoginResponse> {
    return this.httpClient.post<ApiLoginResponse>('/api/auth/login', {
      "login": authData.username,
      "password": authData.password
    })
  }

  public register(userData: RegisterData): Observable<ApiRegisterResponse> {
    return this.httpClient.post<ApiRegisterResponse>('/api/users/register', userData)
  }

  public logout(): Observable<ApiLogoutResponse> {
    return this.httpClient.post<ApiLogoutResponse>("/api/auth/logout", {});
  }

  public getUserInfo(): Observable<ApiUserInfoResponse> {
    return this.httpClient.get<ApiUserInfoResponse>("/auth/me");
  }
}