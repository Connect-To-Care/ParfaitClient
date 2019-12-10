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
  SigninCodeModel
} from "../../services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { DOCUMENT } from "@angular/common";
import { DisplayUtil } from "../../../DisplayUtil";
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-event-kiosk-code",
  templateUrl: "./event-kiosk-code.component.html",
  styleUrls: ["./event-kiosk-code.component.scss"]
})
export class EventKioskCodeComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public expireInSubscription: Subscription;
  public expireIn: number;

  public currentCode: SigninCodeModel;
  public currentCodeUrl: string;

  public socket: SocketIOClient.Socket;
  public event: EventModel;
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
    this.expireInSubscription.unsubscribe();
  }

  public async ngOnInit() {
    this.expireInSubscription = interval(1000).subscribe(() =>
      this.updateExpireIn()
    );

    const eventId = this.activatedRoute.snapshot.paramMap.get("event");
    this.event = await this.apiService.getEvent(eventId);

    this.socket = io.connect(this.configService.config.apiRoot);
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
    this.socket.emit(
      "getNew",
      {
        authorization: `Bearer ${this.apiService.userSession.token}`,
        event: this.event._id
      },
      data => {
        this.currentCode = data;
        this.currentCodeUrl = `${this.configService.config.rootUrl}events/${this.event._id}/signin/${this.currentCode.code}`;
        // tslint:disable-next-line:no-console
        console.debug("New URL: " + this.currentCodeUrl);
      }
    );
  };

  public ngAfterViewInit() {
    DisplayUtil.openFullscreen(this.elem);
  }

  public exit = async () => {
    DisplayUtil.closeFullscreen(this.document);
    await this.router.navigateByUrl("/admin/events");
  };

  public updateExpireIn = () => {
    const expireDate = new Date(this.currentCode.expireDate);

    expireDate.setSeconds(expireDate.getSeconds() - 15); // 15 second grace

    this.expireIn = Math.max(
      0,
      (expireDate.getTime() - new Date().getTime()) / 1000
    );

    if (new Date().getTime() > expireDate.getTime()) {
      this.getNewCode();
    }
  };
}
