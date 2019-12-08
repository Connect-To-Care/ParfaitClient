import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";

import * as io from "socket.io-client";
import { ConfigService } from "../../services/config.service";
import {
  APIService,
  EventModel,
  SigninCodeModel
} from "../../services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { DOCUMENT } from "@angular/common";
import { DisplayUtil } from "../../../DisplayUtil";
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-event-code-signin",
  templateUrl: "./event-code-signin.component.html",
  styleUrls: ["./event-code-signin.component.scss"]
})
export class EventCodeSigninComponent implements OnInit, AfterViewInit {
  public expireInSubscription: Subscription;
  expireIn: number;

  currentCode: SigninCodeModel;
  currentCodeUrl: string;

  socket: SocketIOClient.Socket;
  event: EventModel;
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

  async ngOnInit() {
    this.expireInSubscription = interval(1000).subscribe(() =>
      this.updateExpireIn()
    );

    const eventId = this.activatedRoute.snapshot.paramMap.get("event");
    this.event = await this.apiService.getEvent(eventId);

    this.socket = io.connect(this.configService.config.apiRoot + "codes");
    this.socket
      .on("connect", () => {
        this.getNewCode();
        this.socket.on("codeConsumed", this.getNewCode);
      })
      .on("exception", () => {
        // The user lied! This don't have access to this
        this.router.navigateByUrl("/");
      });
  }

  public getNewCode = () => {
    console.log("new code requestd");
    this.socket.emit(
      "getNew",
      {
        authorization: `Bearer ${this.apiService.userSession.token}`,
        event: this.event._id
      },
      data => {
        this.expireIn = 30;
        this.currentCode = data;
        this.currentCodeUrl = `${this.configService.config.rootUrl}events/${this.event._id}/signin/${this.currentCode.code}`;
      }
    );
  };

  ngAfterViewInit() {
    DisplayUtil.openFullscreen(this.elem);
  }

  public exit = async () => {
    DisplayUtil.closeFullscreen(this.document);
    await this.router.navigateByUrl("/admin/events");
  };

  public updateExpireIn = () => {
    if (this.expireIn !== undefined) {
      if (this.expireIn > 0) {
        --this.expireIn;
      } else {
        this.getNewCode(); // Request new code when below 0
      }
    }
  };
}
