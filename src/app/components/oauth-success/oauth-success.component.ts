import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../services/api.service';

@Component({
  selector: 'app-oauth-success',
  templateUrl: './oauth-success.component.html',
  styleUrls: ['./oauth-success.component.scss']
})
export class OAuthSuccessComponent implements OnInit {

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly apiService: APIService
  ) {
  }

  async ngOnInit() {
    const jwt = this.activatedRoute.snapshot.paramMap.get('jwt');
    if (jwt) {
      this.apiService.saveJwt(jwt);

      const returnUrl = localStorage.getItem('login-returnUrl');
      if (returnUrl) {
        localStorage.removeItem('login-returnUrl');
      }

      if (!this.apiService.userSession.data.user.name.checked) {
        if (returnUrl) {
          await this.router.navigate(['/nag/name'], {queryParams: {returnUrl}});
        } else {
          await this.router.navigateByUrl('/nag/name');
        }
      } else if (!this.apiService.userSession.data.user.phone && !localStorage.getItem('phone-nag')) {
        if (returnUrl) {
          await this.router.navigate(['/nag/phone'], {queryParams: {returnUrl}});
        } else {
          await this.router.navigateByUrl('/nag/phone');
        }
      } else {
        await this.router.navigateByUrl(returnUrl || 'dash');
      }
    } else {
      await this.router.navigateByUrl('/login');
    }
  }

}
