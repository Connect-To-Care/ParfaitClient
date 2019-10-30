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
      this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

}
