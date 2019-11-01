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
  data: {
    user: UserModel
  };
  token: string;
}

export interface EventModel {
  displayName: string;
  signedUp: Array<UserModel>;
  maxSignups: number;
  facilitatorCode: string;
  facilitators: Array<UserModel>;
  startTime: string;
  endTime: string;
  description: string;
  requiredTags: string[];
  _id: string;
}

export interface MyEventsResponse {
  past: Array<EventModel>;
  now: Array<EventModel>;
  future: Array<EventModel>;
}

@Injectable({
  providedIn: 'root'
})

export class APIService {

  constructor(
    private readonly configService: ConfigService,
    private readonly httpClient: HttpClient,
  ) {
  }

  public signUp = async (eventId: string): Promise<void> => {
    return (
      (await this.httpClient.post<any>(
        this.configService.config.apiRoot + 'users/me/signUp/', {
          eventId
        }
      ).toPromise())
    );
  };

  public drop = async (eventId: string): Promise<void> => {
    return (
      (await this.httpClient.post<any>(
        this.configService.config.apiRoot + 'users/me/drop/', {
          eventId
        }
      ).toPromise())
    );
  };

  public getEvents = async (): Promise<MyEventsResponse> => {
    return (
      (await this.httpClient.get<any>(
        this.configService.config.apiRoot + 'users/me/events/'
      ).toPromise()) as MyEventsResponse
    );
  };

  public getAvailableEvents = async (): Promise<Array<EventModel>> => {
    return (
      (await this.httpClient.get<any>(
        this.configService.config.apiRoot + 'users/me/events/available/'
      ).toPromise()) as Array<EventModel>
    );
  };

  public logOut = () => localStorage.removeItem('session');

  public saveJwt = (jwt: string) => localStorage.setItem('session', jwt);

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
      data: sessionJson
    };
  }
}
