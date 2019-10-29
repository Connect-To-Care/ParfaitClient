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
      apiRoot: 'http://localhost:2000/',
      googleOAuthURL: 'http://localhost:2000/auth/google'
    };
  }
}
