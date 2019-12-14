import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { AlertModel, APIService } from "../../services/api.service";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetRef
} from "@angular/material";
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  @Input() public hideLinks: boolean;

  public readonly navBarLinks = [
    {
      title: "Browse Events",
      url: "/dash",
      icon: "event"
    }
  ];

  public readonly accountLoggedIn = [
    {
      title: "My Account",
      url: "/account"
    },
    {
      title: "About",
      url: "/about"
    },
    {
      title: "Logout",
      url: "/logout"
    }
  ];

  public readonly accountLoggedOut = [
    {
      title: "Login",
      url: "/login"
    },
    {
      title: "About",
      url: "/about"
    }
  ];

  public readonly navBarAdmin = [
    {
      title: "Manage Events",
      url: "/admin/events",
      icon: "note_add"
    },
    {
      title: "Manage Users",
      url: "/admin/users",
      icon: "supervised_user_circle"
    }
  ];

  // public alertsSubscription: Subscription;

  public alerts: AlertModel[];
  public unshownAlerts: boolean;

  constructor(
    public readonly apiService: APIService,
    private readonly bottomSheet: MatBottomSheet
  ) {}

  async ngOnInit() {
    this.alerts = []; // No alerts to start off
    this.alerts = await this.apiService.getMyAlerts();
    this.unshownAlerts = this.alerts.find(alert => alert.prompt) !== undefined;
    this.alerts.reverse(); // Reserve the list to get the new alerts on top
    // this.alertsSubscription = interval(1000 * 60).subscribe(() =>
    //   this.getAlerts()
    // );
  }

  // ngOnDestroy() {
  //   if (this.alertsSubscription) {
  //     this.alertsSubscription.unsubscribe();
  //   }
  // }

  public openAlerts = () => {
    this.unshownAlerts = false;
    this.bottomSheet.open(AlertSheetComponent, {
      data: {
        alerts: this.alerts
      }
    });
  };
}

@Component({
  selector: "alerts-sheet",
  templateUrl: "./alerts.sheet.component.html"
})
export class AlertSheetComponent {
  constructor(
    private readonly bottomSheetRef: MatBottomSheetRef<AlertSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { alerts: AlertModel[] }
  ) {}
}
