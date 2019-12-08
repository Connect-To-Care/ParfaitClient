import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APIService} from '../../services/api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-name-nag',
  templateUrl: './name-nag.component.html',
  styleUrls: ['./name-nag.component.scss']
})
export class NameNagComponent implements OnInit {
  public nameForm = new FormGroup({
    name: new FormControl('Example Name', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
  });
  public nameFormLoading = false;

  public returnUrl: string;

  constructor(
    private readonly router: Router,
    private readonly apiService: APIService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/dash';
    this.getName();
  }

  public getName = () => {
    const user = this.apiService.userSession.data.user;

    this.nameForm.setValue({
      name: user.name.fullName,
    });
  };

  public onSubmit = async () => {
    if (this.nameForm.get('name').errors) {
      return;
    }

    this.nameFormLoading = true;
    try {
      await this.apiService.changeName(this.nameForm.get('name').value);
      this.router.navigateByUrl(this.returnUrl);
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
    }

    this.nameFormLoading = false;
  };

}
