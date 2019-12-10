import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from "@angular/core";

import * as io from "socket.io-client";
import { ConfigService } from "../../services/config.service";
import {
  APIService,
  EventModel,
  SignupModel,
  UserModel
} from "../../services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger
} from "@angular/animations";
import { MatSnackBar } from "@angular/material";
import { DisplayUtil } from "../../../DisplayUtil";

@Component({
  selector: "app-event-kiosk-manual",
  templateUrl: "./event-kiosk-manual.component.html",
  styleUrls: ["./event-kiosk-manual.component.scss"],
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
export class EventKioskManualComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public socket: SocketIOClient.Socket;
  public event: EventModel;

  public signedUpFilterValue: string;
  public signedUpSource: SignupModel[];
  public signedUp: SignupModel[];

  private readonly elem: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly apiService: APIService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
    @Inject(DOCUMENT) private document: any
  ) {
    this.elem = document.documentElement;
  }

  public ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket.removeAllListeners();
  }

  public ngOnInit() {
    const eventId = this.activatedRoute.snapshot.paramMap.get("event");

    this.signedUpFilterValue = "";

    this.socket = io.connect(this.configService.config.apiRoot);

    this.socket
      .on("connect", () => {
        this.socket.emit(
          "subscribe",
          {
            authorization: `Bearer ${this.apiService.userSession.token}`,
            event: eventId
          },
          data => this.updateSignup(data)
        );

        this.socket.on("eventUpdate", data => this.updateSignup(data));
      })
      .on("exception", () => {
        // The user lied! This don't have access to this
        this.router.navigateByUrl("/");
      });

    this.socket.on("disconnect", () => this.socket.removeAllListeners());
  }

  public updateSignup = (event: EventModel) => {
    this.event = event;
    this.signedUp = event.signedUp.filter(signUp => !signUp.attended);

    this.applyUserFilter();
  };

  public ngAfterViewInit() {
    DisplayUtil.openFullscreen(this.elem);
  }

  public exit = async () => {
    DisplayUtil.closeFullscreen(this.document);
    await this.router.navigateByUrl("/admin/events");
  };

  public attend = async (user: UserModel) => {
    try {
      await this.apiService.attend(this.event._id, user._id);
    } catch (e) {
      this.snackbar.open(e)._dismissAfter(2000);
    }

    this.signedUpFilterValue = "";
    this.applyUserFilter();
  };

  public applyUserFilter = () => {
    if (this.signedUpFilterValue !== "") {
      this.signedUpSource = this.signedUp.filter(
        candidate =>
          candidate.user.name.fullName
            .toLowerCase()
            .includes(this.signedUpFilterValue.toLowerCase()) ||
          candidate.user.email.includes(this.signedUpFilterValue)
      );
    } else {
      this.signedUpSource = this.signedUp;
    }
  };
}
