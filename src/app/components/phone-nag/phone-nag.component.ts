import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {APIService} from '../../services/api.service';
import {ErrorStateMatcher, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid);
  }
}

@Component({
  selector: 'app-phone-nag',
  templateUrl: './phone-nag.component.html',
  styleUrls: ['./phone-nag.component.scss']
})
export class PhoneNagComponent {

  // https://stackblitz.com/edit/angular-2m1vdq-7vzaq8?file=app%2Finput-error-state-matcher-example.html
  phoneForm = new FormGroup({
    phoneNumber: new FormControl('', [Validators.pattern('[6-9]\\d{9}')]),
  });
  phoneFormLoading = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private readonly router: Router,
    private readonly apiService: APIService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
  ) {
  }

  public openDialog = () => {
    if (!this.apiService.userSession.data.user.phone && !localStorage.getItem('phone-nag')) {
      this.dialog.open(PhoneNagDialogComponent);
    } else {
      this.router.navigateByUrl('/dash');
    }
  };

  public onSubmit = async () => {
    if (!this.phoneForm.get('phoneNumber').touched || this.phoneForm.get('phoneNumber').errors) {
      return;
    }

    this.phoneFormLoading = true;
    try {
      await this.apiService.changePhoneNumber(this.phoneForm.get('phoneNumber').value);
      localStorage.setItem('phone-nag', 'shown');
      this.router.navigateByUrl('/dash');
    } catch (e) {
      this.snackbar.open('Failed to change phone number (' + e + ')')._dismissAfter(2000);
    }

    this.phoneFormLoading = false;
  };

}

@Component({
  selector: 'app-phone-nag-dialog',
  templateUrl: './phone-nag.dialog.component.html',
})
export class PhoneNagDialogComponent {
  constructor(
    private readonly router: Router,
    public dialogRef: MatDialogRef<PhoneNagDialogComponent>
  ) {
  }

  public skip = (noshow = false) => {
    if (noshow) {
      localStorage.setItem('phone-nag', 'shown');
    }
    this.router.navigateByUrl('/');
    this.dialogRef.close();
  };
}
