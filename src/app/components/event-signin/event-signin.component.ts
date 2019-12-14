import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { APIService } from "../../services/api.service";
import { MatDialog, MatSnackBar } from "@angular/material";

export interface LastData {
  lastCode: string;
  lastUser: string;
  lastEvent: string
}

@Component({
  selector: "app-event-signin",
  templateUrl: "./event-signin.component.html",
  styleUrls: ["./event-signin.component.scss"]
})
export class EventSigninComponent implements OnInit {
  public bigError: string;

  constructor(
    private readonly apiService: APIService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  public async ngOnInit() {
    const eventId = this.activatedRoute.snapshot.paramMap.get("event");
    const code = this.activatedRoute.snapshot.paramMap.get("code");

    try {
      if (this.apiService.userSession) {
        await this.detectReuse(eventId, code);
        await this.apiService.useSigninCode(eventId, code);
        const snackbar = this.snackbar.open(
          "Signed in as '" +
            this.apiService.userSession.data.user.name.fullName +
            "'",
          "Wrong name?",
          {
            duration: 5000
          }
        );
        snackbar.onAction().subscribe(() => {
          this.router.navigateByUrl("/nag/name");
        });

        await this.router.navigateByUrl("/dash");
      } else {
        // User is signed out
        await this.apiService.reserveSigninCode(eventId, code);
        this.snackbar
          .open("Your code has been reserved. Please login to continue.")
          ._dismissAfter(2000);
        await this.router.navigate(["login"], {
          queryParams: { returnUrl: `/events/${eventId}/signin/${code}` }
        });
      }
    } catch (e) {
      this.bigError = e;
      this.snackbar.open(e)._dismissAfter(2000);
    }
  }

  public detectReuse = async (eventId: string, code: string): Promise<void> => {
    const lastData = localStorage.getItem('lastSignin');

    if (lastData) {
      const lastDataJson: LastData = JSON.parse(lastData);

      if (lastDataJson.lastEvent === eventId &&
        lastDataJson.lastUser !== this.apiService.userSession.data.user._id &&
        lastDataJson.lastCode !== code) {

        // This could be a suspicious login
        await this.apiService.reportSigninCode(lastDataJson.lastCode, lastDataJson.lastUser, eventId);
      } else {
        // Keep this for later
        localStorage.setItem('lastSignin', JSON.stringify({
          lastUser: this.apiService.userSession.data.user._id,
          lastCode: code,
          lastEvent: eventId
        }));
      }
    }
  }
}
