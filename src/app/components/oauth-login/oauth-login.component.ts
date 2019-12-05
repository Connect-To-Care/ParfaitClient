import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-oauth-login',
  templateUrl: './oauth-login.component.html',
  styleUrls: ['./oauth-login.component.scss']
})
export class OAuthLoginComponent implements OnInit {

  loading = false;

  constructor(
    public readonly configService: ConfigService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    const decaLogin = this.activatedRoute.snapshot.queryParams.deca;
    const returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;

    if (decaLogin !== undefined) {
      localStorage.setItem('login-returnUrl', '/deca');
    } else if (returnUrl !== undefined) {
      localStorage.setItem('login-returnUrl', returnUrl);
    } else {
      localStorage.removeItem('login-returnUrl');
    }
  }

}
