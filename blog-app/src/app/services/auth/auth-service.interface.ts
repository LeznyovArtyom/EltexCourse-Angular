import { Observable } from "rxjs";
import { ApiLoginResponse, ApiLogoutResponse, ApiRegisterResponse, ApiUserInfoResponse } from "../../core/models/auth-api.model";
import { LoginData, RegisterData } from "../../core/models/user.model";

export interface IAuthService {
  login(userData: LoginData): Observable<ApiLoginResponse>;
  register(userData: RegisterData): Observable<ApiRegisterResponse>;
  logout(): Observable<ApiLogoutResponse>;
  getUserInfo(): Observable<ApiUserInfoResponse>;
}