import { Injectable, signal } from "@angular/core";
import { IAuthStore } from "./auth-store.interface";

@Injectable()
export class AuthStore implements IAuthStore {
  public name = signal<string>("");
  public role = signal<string>("");

  public saveUser(name: string, role: string) {
    this.name.set(name);
    this.role.set(role);
  }

  public clearUser() {
    this.name.set("");
    this.role.set("");
  }
}