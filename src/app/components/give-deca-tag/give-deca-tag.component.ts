import { Component, OnInit } from "@angular/core";
import { APIService } from "../../services/api.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-give-deca-tag",
  templateUrl: "./give-deca-tag.component.html",
  styleUrls: ["./give-deca-tag.component.scss"]
})
export class GiveDecaTagComponent implements OnInit {
  public bigError: string;

  constructor(
    private readonly apiService: APIService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar
  ) {}

  public async ngOnInit() {
    try {
      await this.apiService.giveDecaTag();
    } catch (e) {
      // This can fail silently, the user may already have the tag
    }

    const events = await this.apiService.getMyAvailableEvents();
    const decaEvent = events.find(event => event.requiredTags.includes("DECA"));

    if (decaEvent) {
      try {
        await this.apiService.signUp(decaEvent._id);
        this.snackbar
          .open("Successfully signed up for a CTC x DECA event!")
          ._dismissAfter(5000);
      } catch (e) {
        this.bigError = e;
        this.snackbar.open(e)._dismissAfter(2000);
        return;
      }
    }

    await this.router.navigateByUrl("/dash");
  }
}
