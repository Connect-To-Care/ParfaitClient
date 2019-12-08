import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { APIService } from "../services/api.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly apiService: APIService,
    private readonly router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.apiService.userSession) {
      this.router.navigate(["login"], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
    return true;
  }
}
