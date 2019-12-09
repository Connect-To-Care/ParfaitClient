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
export class DeauthGuard implements CanActivate {
  constructor(
    private readonly apiService: APIService,
    private readonly router: Router
  ) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.apiService.userSession) {
      this.router.navigateByUrl("/dash");
      return false;
    }
    return true;
  }
}
