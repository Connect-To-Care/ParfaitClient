import { Component, Inject, OnInit } from "@angular/core";
import {
  APIService,
  EventModel,
  SignupModel,
  UserModel
} from "../../services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MAT_DIALOG_DATA,
  MatChipInputEvent,
  MatDialog,
  MatDialogRef,
  MatSnackBar
} from "@angular/material";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { saveAs } from "file-saver";
import { FacilitatorAddDialogData } from "../dash/dash.component";

@Component({
  selector: "app-edit-event",
  templateUrl: "./edit-event.component.html",
  styleUrls: ["./edit-event.component.scss"]
})
export class EditEventComponent implements OnInit {
  public event: EventModel;
  public eventLoading = false;

  public eventForm = new FormGroup({
    displayName: new FormControl("", [
      Validators.minLength(1),
      Validators.maxLength(100),
      Validators.required
    ]),
    maxSignups: new FormControl(2, [
      Validators.min(1),
      Validators.max(5000),
      Validators.required
    ]),
    facilitatorCode: new FormControl("", [
      Validators.minLength(1),
      Validators.maxLength(100),
      Validators.required
    ]),
    startTime: new FormControl(new Date(), [Validators.required]),
    endTime: new FormControl(new Date(), [Validators.required]),
    description: new FormControl("", [
      Validators.minLength(1),
      Validators.maxLength(2000),
      Validators.required
    ]),
    recurringDays: new FormControl(7, [
      Validators.min(1),
      Validators.max(60),
      Validators.required
    ]),
    isRecurring: new FormControl(false, [Validators.required]),
    facilitators: new FormControl([]),
    signedUp: new FormControl([]),
    requiredTags: new FormControl([]),
    signinCodes: new FormControl([])
  });
  public eventFormLoading = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly apiService: APIService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router
  ) {}

  public ngOnInit() {
    this.getEvent();
  }

  public getEvent = async () => {
    this.eventLoading = true;
    const eventId = this.activatedRoute.snapshot.paramMap.get("event");
    if (eventId) {
      // We're editing a event
      try {
        this.event = await this.apiService.getEvent(eventId);

        let recurringDays;
        recurringDays = this.event.recurring ? this.event.recurring.days : 7;

        this.eventForm.setValue({
          displayName: this.event.displayName,
          maxSignups: this.event.maxSignups,
          facilitatorCode: this.event.facilitatorCode,
          startTime: new Date(this.event.startTime),
          endTime: new Date(this.event.endTime),
          description: this.event.description,
          isRecurring: this.event.recurring !== undefined,
          recurringDays,
          facilitators: this.event.facilitators,
          signedUp: this.event.signedUp,
          requiredTags: this.event.requiredTags,
          signinCodes: this.event.signinCodes
        });

        const now = new Date();
        now.setMinutes(now.getMinutes() + 10); // 10 minute gap before start
        if (
          new Date(this.event.startTime).getTime() < now.getTime() &&
          new Date(this.event.endTime).getTime() > now.getTime()
        ) {
          // This event is currently occurring
          this.dialog.open(EditWarningDialogComponent);
        }
      } catch (e) {
        if (e === "Forbidden resource") {
          // The user lied! This don't have access to this
          await this.router.navigateByUrl("/");
        }

        this.snackbar.open(e)._dismissAfter(2000);
      }
    }

    this.eventLoading = false;
  };

  public removeSignedUp = async (user: UserModel) => {
    this.eventForm
      .get("signedUp")
      .setValue(
        this.eventForm
          .get("signedUp")
          .value.filter(signUp => signUp.user._id !== user._id)
      );
  };

  public addSignedUp = async (event: MatChipInputEvent) => {
    if (!event.value) {
      return;
    }

    const user = await this.apiService.getUserByEmail(event.value);
    if (!user) {
      return;
    }

    if (
      this.eventForm
        .get("signedUp")
        .value.find(signUp => signUp.user._id === user._id)
    ) {
      return;
    }

    const existing = this.eventForm.get("signedUp").value;
    existing.push({
      user,
      attended: false
    });

    this.eventForm.get("signedUp").setValue(existing);
    event.input.value = "";
  };

  public removeFacilitator = async (user: UserModel) => {
    this.eventForm
      .get("facilitators")
      .setValue(
        this.eventForm
          .get("facilitators")
          .value.filter(facilitator => facilitator._id !== user._id)
      );
  };

  public addFacilitator = async (event: MatChipInputEvent) => {
    if (!event.value) {
      return;
    }

    const user = await this.apiService.getUserByEmail(event.value);
    if (!user) {
      return;
    }

    if (
      this.eventForm
        .get("facilitators")
        .value.find(facilitator => facilitator._id === user._id)
    ) {
      return;
    }

    const existing = this.eventForm.get("facilitators").value;
    existing.push(user);
    this.eventForm.get("facilitators").setValue(existing);
    event.input.value = "";
  };

  public addTag = (event: MatChipInputEvent) => {
    if (
      !event.value &&
      this.eventForm.get("requiredTags").value.find(tag => tag === event.value)
    ) {
      return;
    }

    const existing = this.eventForm.get("requiredTags").value;
    existing.push(event.value);
    this.eventForm.get("requiredTags").setValue(existing);
    event.input.value = "";
  };

  public removeTag = (tag: string) => {
    this.eventForm
      .get("requiredTags")
      .setValue(
        this.eventForm
          .get("requiredTags")
          .value.filter(existingTag => existingTag !== tag)
      );
  };

  public delete = async () => {
    const dialogRef = this.dialog.open(DeleteEventDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      try {
        await this.apiService.deleteEvent(this.event._id);
        await this.router.navigateByUrl("/admin/events");
      } catch (e) {
        this.snackbar.open(e)._dismissAfter(2000);
      }
    });
  };

  public toggleAttend = async (oldSignUp: SignupModel) => {
    const signedUp = this.eventForm.get("signedUp").value;
    const signUp = signedUp.find(
      signUpCandidate => signUpCandidate.user._id === oldSignUp.user._id
    );
    signUp.attended = !oldSignUp.attended;
    this.eventForm.get("signedUp").setValue(signedUp);
  };

  public onSubmit = async () => {
    if (this.eventForm.invalid) {
      return;
    }

    const eventData: EventModel = {
      signedUp: this.eventForm.get("signedUp").value,
      displayName: this.eventForm.get("displayName").value,
      facilitators: this.eventForm.get("facilitators").value,
      endTime: this.eventForm.get("endTime").value,
      startTime: this.eventForm.get("startTime").value,
      facilitatorCode: this.eventForm.get("facilitatorCode").value,
      maxSignups: this.eventForm.get("maxSignups").value,
      description: this.eventForm.get("description").value,
      requiredTags: this.eventForm.get("requiredTags").value,
      signinCodes: this.eventForm.get("signinCodes").value
    };

    if (this.eventForm.get("isRecurring").value) {
      eventData.recurring = {
        hasRecurred: false,
        days: this.eventForm.get("recurringDays").value
      };
    }

    this.eventFormLoading = true;
    if (this.event) {
      try {
        await this.apiService.editEvent(this.event._id, eventData);
        await this.router.navigateByUrl("/admin/events");
      } catch (e) {
        this.snackbar.open(e)._dismissAfter(2000);
      }
    } else {
      try {
        await this.apiService.addEvent(eventData);
        await this.router.navigateByUrl("/admin/events");
      } catch (e) {
        this.snackbar.open(e)._dismissAfter(2000);
      }
    }

    this.eventFormLoading = false;
  };

  public exportCsv = async () => {
    const blob = await this.apiService.downloadCsv(this.event._id);
    saveAs(blob, `${this.event._id}-export.csv`);
  };
}

@Component({
  selector: "app-delete-event",
  templateUrl: "deleteEvent.dialog.component.html"
})
export class DeleteEventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FacilitatorAddDialogData
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "app-edit-warning",
  templateUrl: "editWarning.dialog.component.html"
})
export class EditWarningDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteEventDialogComponent>) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
