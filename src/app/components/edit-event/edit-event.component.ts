import {Component, OnInit} from '@angular/core';
import {APIService, EventModel, UserModel} from '../../services/api.service';
import {ActivatedRoute} from '@angular/router';
import {MatChipInputEvent, MatDialog, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit {

  event: EventModel;
  eventLoading = false;

  eventForm = new FormGroup({
    displayName: new FormControl('', [Validators.minLength(1), Validators.maxLength(100), Validators.required]),
    maxSignups: new FormControl(2, [Validators.min(1), Validators.max(5000), Validators.required]),
    facilitatorCode: new FormControl('', [Validators.minLength(1), Validators.maxLength(100), Validators.required]),
    startTime: new FormControl(new Date(), [Validators.required]),
    endTime: new FormControl(new Date(), [Validators.required]),
    description: new FormControl('', [Validators.minLength(1), Validators.maxLength(100), Validators.required]),
    recurringDays: new FormControl(7, [Validators.min(1), Validators.max(60), Validators.required]),
    isRecurring: new FormControl(false, Validators.required),
    facilitators: new FormControl([], Validators.required),
    signedUp: new FormControl([], Validators.required)
  });
  eventFormLoading = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly apiService: APIService,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.getEvent();
  }

  public getEvent = async () => {
    this.eventLoading = true;
    const eventId = this.activatedRoute.snapshot.paramMap.get('event');
    if (eventId) { // We're editing a event
      try {
        this.event = await this.apiService.getEvent(eventId);

        let recurringDays;
        if (this.event.recurring) {
          recurringDays = this.event.recurring.days;
        } else {
          recurringDays = 7;
        }

        this.eventForm.setValue({
          displayName: this.event.displayName,
          maxSignups: this.event.maxSignups,
          facilitatorCode: this.event.facilitatorCode,
          startTime: new Date(this.event.startTime),
          endTime: new Date(this.event.endTime),
          description: this.event.description,
          isRecurring: (this.event.recurring !== undefined),
          recurringDays,
          facilitators: this.event.facilitators,
          signedUp: this.event.signedUp
        });
      } catch (e) {
        this.snackbar.open('Failed to get event (' + e + ')')._dismissAfter(2000);
      }
    }

    this.eventLoading = false;
  };

  public removeSignedUp = async (user: UserModel) => {
    this.eventForm.get('signedUp').setValue(
      this.eventForm.get('signedUp').value.filter(signedUp => signedUp._id !== user._id
      ));
  };

  public addSignedUp = async (event: MatChipInputEvent) => {
    if (!event.value) {
      return;
    }

    const user = await this.apiService.getUserByEmail(event.value);
    if (!user) {
      return;
    }

    if (this.eventForm.get('signedUp').value.find(signedUp => signedUp._id === user._id)) {
      return;
    }

    const existing = this.eventForm.get('signedUp').value;
    existing.push(user);
    this.eventForm.get('signedUp').setValue(existing);
    event.input.value = '';
  };

  public removeFacilitator = async (user: UserModel) => {
    this.eventForm.get('facilitators').setValue(
      this.eventForm.get('facilitators').value.filter(facilitator => facilitator._id !== user._id
      ));
  };

  public addFacilitator = async (event: MatChipInputEvent) => {
    if (!event.value) {
      return;
    }

    const user = await this.apiService.getUserByEmail(event.value);
    if (!user) {
      return;
    }

    if (this.eventForm.get('facilitators').value.find(facilitator => facilitator._id === user._id)) {
      return;
    }

    const existing = this.eventForm.get('facilitators').value;
    existing.push(user);
    this.eventForm.get('facilitators').setValue(existing);
    event.input.value = '';
  };

  public onSubmit = async () => {

  };

}
