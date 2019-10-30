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
      apiRoot: 'http://localhost:3000/',
      googleOAuthURL: 'http://localhost:3000/auth/google'
    };
  }
}
