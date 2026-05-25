import { WritableSignal } from "@angular/core";

export interface IAuthStore {
  name: WritableSignal<string>,
  role: WritableSignal<string>,
  saveUser(name: string, role: string): void;
  clearUser(): void;
}