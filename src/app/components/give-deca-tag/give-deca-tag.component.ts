import {Component, OnInit} from '@angular/core';
import {APIService} from '../../services/api.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-give-deca-tag',
  templateUrl: './give-deca-tag.component.html',
  styleUrls: ['./give-deca-tag.component.scss']
})
export class GiveDecaTagComponent implements OnInit {

  constructor(
    private readonly apiService: APIService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar
  ) {
  }

  async ngOnInit() {
    try {
      await this.apiService.giveDecaTag();
    } catch (e) {
      this.snackbar.open('Failed to get DECA tag (' + e + ')')._dismissAfter(4000);
      await new Promise(resolve => {
        setTimeout(() => {
          return resolve();
        }, 4000);
      });
    }

    const events = await this.apiService.getMyAvailableEvents();
    const decaEvent = events.find(event => event.requiredTags.includes('DECA'));

    if (decaEvent) {
      await this.apiService.signUp(decaEvent._id);
    }

    await this.router.navigateByUrl('/dash');
  }

}
