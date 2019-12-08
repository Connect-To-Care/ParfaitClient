import {Injectable} from '@angular/core';
import * as git from '../../../git.json';

export interface Config {
  apiRoot: string;
  googleOAuthURL: string;
  debug: boolean;
  hash: string;
  rootUrl: string;
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
      debug: false,
      hash: git.raw || 'Unknown',
      rootUrl: 'https://volunteer.connect-tocare.org/',
    };
  }
}
