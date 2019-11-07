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

  public addTag = async (userId: string, tag: string): Promise<void> => {
    return (
      (await this.httpClient.post<any>(
        this.configService.config.apiRoot + 'users/' + userId.replace('/', '') + '/addTag', {
          tag
        }
      ).toPromise())
    );
  };

  public removeTag = async (userId: string, tag: string): Promise<void> => {
    return (
      (await this.httpClient.post<any>(
        this.configService.config.apiRoot + 'users/' + userId.replace('/', '') + '/removeTag', {
          tag
        }
      ).toPromise())
    );
  };

  public giveAdmin = async (userId: string): Promise<void> => {
    return (
      (await this.httpClient.get<any>(
        this.configService.config.apiRoot + 'users/' + userId.replace('/', '') + '/giveAdmin'
      ).toPromise())
    );
  };

  public removeAdmin = async (userId: string): Promise<void> => {
    return (
      (await this.httpClient.get<any>(
        this.configService.config.apiRoot + 'users/' + userId.replace('/', '') + '/removeAdmin'
      ).toPromise())
    );
  };

  public getUser = async (userId: string): Promise<UserModel> => {
    return (
      (await this.httpClient.get<any>(
        this.configService.config.apiRoot + 'users/' + userId.replace('/', '') // Prevent //'s from escaping the url
      ).toPromise()) as UserModel
    );
  };

  public getUsers = async (): Promise<Array<UserModel>> => {
    return (
      (await this.httpClient.get<any>(
        this.configService.config.apiRoot + 'users'
      ).toPromise()) as Array<UserModel>
    );
  };

  public signUp = async (eventId: string): Promise<void> => {
    return (
      (await this.httpClient.post<any>(
        this.configService.config.apiRoot + 'users/me/signUp/', {
          eventId
        }
      ).toPromise())
    );
  };

  public changePhoneNumber = async (phoneNumber: string): Promise<void> => {
    return (
      (await this.httpClient.post<any>(
        this.configService.config.apiRoot + 'users/me/updatePhone/', {
          phoneNumber
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
}
