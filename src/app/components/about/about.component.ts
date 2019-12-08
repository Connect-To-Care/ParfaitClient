import { Component, OnInit } from "@angular/core";
import { ConfigService } from "../../services/config.service";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"]
})
export class AboutComponent {
  constructor(public readonly configService: ConfigService) {}
}
