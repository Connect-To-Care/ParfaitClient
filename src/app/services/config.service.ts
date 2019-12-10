import { Injectable } from "@angular/core";
import * as git from "../../../git.json";

export interface Config {
  apiRoot: string;
  googleOAuthURL: string;
  debug: boolean;
  hash: string;
  rootUrl: string;
}

@Injectable({
  providedIn: "root"
})
export class ConfigService {
  get config(): Config {
    return {
      apiRoot: "http://localhost:3000/",
      googleOAuthURL: "http://localhost:3000/auth/google",
      rootUrl: "http://localhost:4200/",
      debug: true,
      hash: (git.tag || 'Latest' ) + '-' + (git.hash|| "Unknown")
    };
  }
}
