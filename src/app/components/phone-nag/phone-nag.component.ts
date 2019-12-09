import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { APIService } from "../../services/api.service";
import {
  ErrorStateMatcher,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatSnackBar
} from "@angular/material";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from "@angular/forms";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid);
  }
}

export interface PhoneNagData {
  returnUrl: string;
}

@Component({
  selector: "app-phone-nag",
  templateUrl: "./phone-nag.component.html",
  styleUrls: ["./phone-nag.component.scss"]
})
export class PhoneNagComponent implements OnInit {
  // https://stackblitz.com/edit/angular-2m1vdq-7vzaq8?file=app%2Finput-error-state-matcher-example.html
  public phoneForm = new FormGroup({
    phoneNumber: new FormControl("", [Validators.pattern("[6-9]\\d{9}")])
  });
  public phoneFormLoading = false;
  public matcher = new MyErrorStateMatcher();

  public returnUrl: string;

  constructor(
    private readonly router: Router,
    private readonly apiService: APIService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.returnUrl =
      this.activatedRoute.snapshot.queryParams.returnUrl || "/dash";
  }

  public openDialog = () => {
    if (
      !this.apiService.userSession.data.user.phone &&
      !localStorage.getItem("phone-nag")
    ) {
      this.dialog.open(PhoneNagDialogComponent, {
        data: {
          returnUrl: this.returnUrl
        }
      });
    } else {
      this.router.navigateByUrl(this.returnUrl);
    }
  };

  public onSubmit = async () => {
    if (
      !this.phoneForm.get("phoneNumber").touched ||
      this.phoneForm.get("phoneNumber").errors
    ) {
      return;
    }

    this.phoneFormLoading = true;
    try {
      await this.apiService.changePhoneNumber(
        this.phoneForm.get("phoneNumber").value
      );
      localStorage.setItem("phone-nag", "shown");
      this.router.navigateByUrl(this.returnUrl);
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
    }

    this.phoneFormLoading = false;
  };
}

@Component({
  selector: "app-phone-nag-dialog",
  templateUrl: "./phone-nag.dialog.component.html"
})
export class PhoneNagDialogComponent {
  constructor(
    private readonly router: Router,
    public dialogRef: MatDialogRef<PhoneNagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PhoneNagData
  ) {}

  public skip = (noshow = false) => {
    if (noshow) {
      localStorage.setItem("phone-nag", "shown");
    }
    this.router.navigateByUrl(this.data.returnUrl);
    this.dialogRef.close();
  };
}
