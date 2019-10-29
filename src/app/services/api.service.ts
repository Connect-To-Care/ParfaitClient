import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';

export enum AuthStrategy {
  GOOGLE = 'google',
}

export interface OAuthProviderIdentity {
  strategy: AuthStrategy;
  profileID: string;
}

export interface UserModel {
  fullName: string;
  phone?: string;
  email: string;
  userTags: string[];
  auth: OAuthProviderIdentity;
  isAdmin: boolean;
  _id: string;
}

export interface UserSession {
  user: UserModel;
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class APIService {

  constructor(
    private readonly configService: ConfigService,
    private readonly httpClient: HttpClient
  ) {
  }

  public logOut = () => localStorage.removeItem('session');

  get userSession(): UserSession {
    const sessionJwt = localStorage.getItem('session');

    if (!sessionJwt) {
      return undefined;
    }

    let sessionJson;
    try {
      sessionJson = JSON.parse(atob(sessionJwt.split('.')[1]));
    } catch (e) {
      return undefined;
    }

    return {
      token: sessionJwt,
      user: sessionJson
    };
  }


}
