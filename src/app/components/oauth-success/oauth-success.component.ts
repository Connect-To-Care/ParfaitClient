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

      let deca = false;
      if (localStorage.getItem('deca-login')) {
        localStorage.removeItem('deca-login');
        deca = true;
      }

      if (!this.apiService.userSession.data.user.name.checked) {
        if (deca) {
          await this.router.navigateByUrl('/nag/name?returnUrl=/deca');
        } else {
          await this.router.navigateByUrl('/nag/name');
        }
      } else if (!this.apiService.userSession.data.user.phone && !localStorage.getItem('phone-nag')) {
        if (deca) {
          await this.router.navigateByUrl('/nag/phone?returnUrl=/deca');
        } else {
          await this.router.navigateByUrl('/nag/phone');
        }
      } else {
        if (deca) {
          await this.router.navigateByUrl('/deca');
        } else {
          await this.router.navigateByUrl('/dash');
        }
      }
    } else {
      await this.router.navigateByUrl('/login');
    }
  }

}
