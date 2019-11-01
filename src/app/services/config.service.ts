import { Injectable } from '@angular/core';

export interface Config {
  apiRoot: string;
  googleOAuthURL: string;
}

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  constructor() { }

  get config(): Config {
    return {
      apiRoot: 'https://api.connect-tocare.org/',
      googleOAuthURL: 'https://volunteer.connect-tocare.org/auth/google'
    };
  }
}
