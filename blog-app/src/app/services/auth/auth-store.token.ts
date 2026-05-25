import { InjectionToken } from "@angular/core";
import { IAuthStore } from "./auth-store.interface";

export const AUTH_STORE_TOKEN = new InjectionToken<IAuthStore>("AUTH_STORE_TOKEN");