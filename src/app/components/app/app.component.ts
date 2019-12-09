import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { ConfigService } from "../../services/config.service";
import { Router, RoutesRecognized } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(
    private readonly snackbar: MatSnackBar,
    private readonly configService: ConfigService,
    private readonly router: Router,
    private readonly titleService: Title
  ) {}

  public ngOnInit(): void {
    if (this.configService.config.debug) {
      this.snackbar
        .open("Running in development mode. Using local API server.")
        ._dismissAfter(2000);
    }

    this.router.events.subscribe(event => {
      // Check for route change.
      if (event instanceof RoutesRecognized) {
        const route = event.state.root.firstChild;
        if (route.data.title) {
          // Check to see if the route is assigned a title
          this.titleService.setTitle("Connect To Care | " + route.data.title); // Yes, update the window.title to reflect it.
        } else {
          this.titleService.setTitle("Connect To Care"); // No? Well, firstly i must of messed up. Just set it to the default.
        }
      }
    });
  }
}
