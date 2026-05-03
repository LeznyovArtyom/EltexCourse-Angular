import { InjectionToken } from "@angular/core";

export const ARTICLES_PAGE_SIZE = new InjectionToken('ARTICLES_PAGE_SIZE', {
  providedIn: 'root',
  factory: () => 7
})