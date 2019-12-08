import { Component, Inject, OnInit } from "@angular/core";
import {
  APIService,
  EventModel,
  MyEventsResponse
} from "../../services/api.service";
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger
} from "@angular/animations";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatSnackBar
} from "@angular/material";
import { FacilitatorActionsDialogComponent } from "../facilitator-actions/facilitator-actions.component";

@Component({
  selector: "app-dash",
  templateUrl: "./dash.component.html",
  styleUrls: ["./dash.component.scss"],
  animations: [
    trigger("listStagger", [
      transition("* <=> *", [
        query(
          ":enter",
          [
            style({ opacity: 0, transform: "translateY(-15px)" }),
            stagger(
              "50ms",
              animate(
                "550ms ease-out",
                style({ opacity: 0.7, transform: "translateY(0px)" })
              )
            )
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class DashComponent implements OnInit {
  public availableEvents: EventModel[];
  public availableEventsSource: EventModel[];

  public myEvents: MyEventsResponse;

  public showUnqualified: boolean;

  constructor(
    private readonly apiService: APIService,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {}

  public async ngOnInit() {
    this.showUnqualified = false;

    this.refreshEvents();
    this.refreshMyEvents();
  }

  public drop = async (event: EventModel) => {
    try {
      await this.apiService.drop(event._id);
      this.refreshEvents();
      this.refreshMyEvents();
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
    }
  };

  public refreshEvents = async () => {
    try {
      this.availableEvents = await this.apiService.getMyAvailableEvents();
      this.applyQualifiedFilter();
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
    }
  };

  public refreshMyEvents = async () => {
    try {
      this.myEvents = await this.apiService.getMyEvents();
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
    }
  };

  public signUp = async (event: EventModel): Promise<void> => {
    try {
      await this.apiService.signUp(event._id);
      this.refreshEvents();
      this.refreshMyEvents();
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
    }
  };

  public enterCode = async (event: EventModel): Promise<void> => {
    const dialogRef = this.dialog.open(FacilitatorAddDialogComponent, {
      data: {
        code: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.tryCode(event, result);
    });
  };

  public tryCode = async (event: EventModel, code: string) => {
    try {
      await this.apiService.enterCode(event._id, code);
      this.refreshMyEvents();
      this.refreshEvents();
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
    }
  };

  public checkEventFacilitator = (event: EventModel): boolean => {
    return (
      event.facilitators.find(
        facilitator =>
          facilitator._id === this.apiService.userSession.data.user._id
      ) !== undefined
    );
  };

  public checkQualified = (event: EventModel): boolean => {
    if (event.requiredTags.length === 0) {
      return true;
    }

    return event.requiredTags.every(requiredTag =>
      this.apiService.userSession.data.user.userTags.includes(requiredTag)
    );
  };

  public updateUnqualified = () => {
    this.showUnqualified = !this.showUnqualified;
    this.applyQualifiedFilter();
  };

  public applyQualifiedFilter = () => {
    this.availableEventsSource = this.showUnqualified
      ? this.availableEvents
      : this.availableEvents.filter(event => this.checkQualified(event));
  };

  public openFacilitatorActions = (event: EventModel) => {
    this.dialog.open(FacilitatorActionsDialogComponent, {
      data: {
        event
      }
    });
  };
}

export interface FacilitatorAddDialogData {
  code: string;
}

@Component({
  selector: "app-facilitator-add",
  templateUrl: "facilitatorAdd.dialog.component.html"
})
export class FacilitatorAddDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FacilitatorAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FacilitatorAddDialogData
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }
}
