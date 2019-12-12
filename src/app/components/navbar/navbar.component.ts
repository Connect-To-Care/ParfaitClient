import { Component, Input } from "@angular/core";
import { APIService } from "../../services/api.service";
import {MatBottomSheet, MatBottomSheetRef} from "@angular/material";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent {
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

  constructor(
    public readonly apiService: APIService,
    private readonly bottomSheet: MatBottomSheet,
  ) {}

  public openAlerts = () => {
    this.bottomSheet.open(AlertSheetComponent);
  }
}

@Component({
  selector: 'alerts-sheet',
  templateUrl: './alerts.sheet.component.html',
})
export class AlertSheetComponent {
  constructor(
    private readonly bottomSheetRef: MatBottomSheetRef<AlertSheetComponent>
  ) {}

  // openLink(event: MouseEvent): void {
  //   this.bottomSheetRef.dismiss();
  //   event.preventDefault();
  // }
}
