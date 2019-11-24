import {Injectable} from '@angular/core';
import * as git from '../../../git.json';


export interface Config {
  apiRoot: string;
  googleOAuthURL: string;
  debug: boolean;
  hash: string;
}

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  constructor() {
  }

  get config(): Config {
    return {
      apiRoot: 'http://localhost:3000/',
      googleOAuthURL: 'http://localhost:3000/auth/google',
      debug: true,
      hash: git.raw || 'Unknown'
    };
  }
}
