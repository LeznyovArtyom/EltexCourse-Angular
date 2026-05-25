import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from "@angular/core";
import { AUTH_STORE_TOKEN } from "../services/auth/auth-store.token";

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private authStore = inject(AUTH_STORE_TOKEN);
  private templateRef = inject(TemplateRef<any>); // Элемент, на котором висит директива
  private viewContainer = inject(ViewContainerRef); // Место в Dom, куда вставляем элемент

  public appHasRole = input.required<string>();

  constructor() {
    effect(() => {
      const currentRole = this.authStore.role();
      const requiredRole = this.appHasRole();
      
      this.viewContainer.clear();

      if (currentRole === requiredRole) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}