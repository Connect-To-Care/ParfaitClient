import {Injectable} from '@angular/core';

export interface Config {
  apiRoot: string;
  googleOAuthURL: string;
  debug: boolean
}

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  constructor() {
  }

  get config(): Config {
    return {
      apiRoot: 'https://api.connect-tocare.org/',
      googleOAuthURL: 'https://api.connect-tocare.org/auth/google',
      debug: false
    };
  }
}
