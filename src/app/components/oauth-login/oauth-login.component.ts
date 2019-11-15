import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-oauth-login',
  templateUrl: './oauth-login.component.html',
  styleUrls: ['./oauth-login.component.scss']
})
export class OAuthLoginComponent implements OnInit {

  loading = false;

  constructor(
    public readonly configService: ConfigService
  ) {
  }

  ngOnInit() {
  }

}
