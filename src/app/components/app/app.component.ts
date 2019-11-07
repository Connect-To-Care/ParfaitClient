import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly configService: ConfigService
  ) {
  }

  ngOnInit(): void {
    if (this.configService.config.debug) {
      this.snackbar.open('Running in development mode. Using local API server.')._dismissAfter(2000);
    }
  }
}
