import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { HttpClient } from "@angular/common/http";

export enum SigninCodeStatus {
  NOT_CLAIMED = "NOT_CLAIMED",
  PENDING = "PENDING",
  CLAIMED = "CLAIMED"
}

export interface SigninCodeModel {
  code: string;
  status: SigninCodeStatus;
  createdDate: string;
}

export enum AuthStrategy {
  GOOGLE = "google"
}

export interface OAuthProviderIdentity {
  strategy: AuthStrategy;
  profileID: string;
}

export interface Name {
  fullName: string;
  checked: boolean;
}

export interface UserModel {
  name: Name;
  phone?: string;
  email: string;
  userTags?: string[];
  auth?: OAuthProviderIdentity;
  isAdmin: boolean;
  _id?: string;
}

export interface UserSession {
  data: {
    user: UserModel;
  };
  token: string;
}

export interface SignupModel {
  attended: boolean;
  user: UserModel;
}

export interface EventModel {
  displayName: string;
  signedUp: SignupModel[];
  maxSignups: number;
  facilitatorCode: string;
  facilitators: UserModel[];
  startTime: string;
  endTime: string;
  description: string;
  requiredTags: string[];
  _id?: string;
  recurring?: {
    days: number;
    hasRecurred: boolean;
  };
  signinCodes: SigninCodeModel[];
}

export interface MyEventsResponse {
  past: EventModel[];
  now: EventModel[];
  future: EventModel[];
}

@Injectable({
  providedIn: "root"
})
export class APIService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpClient: HttpClient
  ) {}

  get userSession(): UserSession {
    const sessionJwt = localStorage.getItem("session");

    if (!sessionJwt) {
      return undefined;
    }

    let sessionJson;
    try {
      sessionJson = JSON.parse(atob(sessionJwt.split(".")[1]));
    } catch (e) {
      return undefined;
    }

    return {
      token: sessionJwt,
      data: sessionJson
    };
  }

  public reserveSigninCode = async (eventId: string, code: string): Promise<void> => {
    return this.httpClient
      .post<any>(
        this.configService.config.apiRoot +
        "events/" +
        eventId.replace("/", "") +
        "/attend/code/reserve",
        {
          code
        }
      )
      .toPromise();
  };

  public useSigninCode = async (eventId: string, code: string): Promise<void> => {
    return this.httpClient
      .post<any>(
        this.configService.config.apiRoot +
        "events/" +
        eventId.replace("/", "") +
        "/attend/code",
        {
          code
        }
      )
      .toPromise();
  };

  public sendInvalidEmail = async (userId: string): Promise<void> => {
    return this.httpClient
      .get<any>(
        this.configService.config.apiRoot +
          "users/" +
          userId.replace("/", "") +
          "/sendInvalid"
      )
      .toPromise();
  };

  public downloadCsv = async (eventId: string): Promise<Blob> => {
    return this.httpClient
      .get<Blob>(
        this.configService.config.apiRoot +
          "events/" +
          eventId.replace("/", "") +
          "/export",
        { responseType: "blob" as "json" }
      )
      .toPromise();
  };

  public attend = async (eventId: string, userId: string): Promise<void> => {
    return this.httpClient
      .post<any>(
        this.configService.config.apiRoot +
          "events/" +
          eventId.replace("/", "") +
          "/attend",
        {
          userId
        }
      )
      .toPromise();
  };

  public giveDecaTag = async (): Promise<void> => {
    const data = await this.httpClient
      .get<any>(this.configService.config.apiRoot + "extra/deca")
      .toPromise();
    this.saveJwt(data.newToken);
  };

  public editEvent = async (
    eventId: string,
    data: EventModel
  ): Promise<EventModel> => {
    return (await this.httpClient
      .post<any>(
        this.configService.config.apiRoot +
          "events/" +
          eventId.replace("/", ""),
        { ...data }
      )
      .toPromise()) as EventModel;
  };

  public deleteEvent = async (eventId: string): Promise<EventModel> => {
    return (await this.httpClient
      .get<any>(
        this.configService.config.apiRoot +
          "events/" +
          eventId.replace("/", "") +
          "/delete"
      )
      .toPromise()) as EventModel;
  };

  public addEvent = async (data: EventModel): Promise<EventModel> => {
    return (await this.httpClient
      .post<any>(this.configService.config.apiRoot + "events/", { ...data })
      .toPromise()) as EventModel;
  };

  public getEvent = async (eventId: string): Promise<EventModel> => {
    return (await this.httpClient
      .get<any>(
        this.configService.config.apiRoot + "events/" + eventId.replace("/", "") // Prevent //'s from escaping the url
      )
      .toPromise()) as EventModel;
  };

  public getEvents = async (): Promise<EventModel[]> => {
    return this.httpClient
      .get<any>(this.configService.config.apiRoot + "events/")
      .toPromise();
  };

  public addTag = async (userId: string, tag: string): Promise<void> => {
    return this.httpClient
      .post<any>(
        this.configService.config.apiRoot +
          "users/" +
          userId.replace("/", "") +
          "/addTag",
        {
          tag
        }
      )
      .toPromise();
  };

  public removeTag = async (userId: string, tag: string): Promise<void> => {
    return this.httpClient
      .post<any>(
        this.configService.config.apiRoot +
          "users/" +
          userId.replace("/", "") +
          "/removeTag",
        {
          tag
        }
      )
      .toPromise();
  };

  public giveAdmin = async (userId: string): Promise<void> => {
    return this.httpClient
      .get<any>(
        this.configService.config.apiRoot +
          "users/" +
          userId.replace("/", "") +
          "/makeAdmin"
      )
      .toPromise();
  };

  public removeAdmin = async (userId: string): Promise<void> => {
    return this.httpClient
      .get<any>(
        this.configService.config.apiRoot +
          "users/" +
          userId.replace("/", "") +
          "/removeAdmin"
      )
      .toPromise();
  };

  public getUserByEmail = async (email: string): Promise<UserModel> => {
    return (await this.httpClient
      .post<any>(this.configService.config.apiRoot + "users/checkEmail", {
        email
      })
      .toPromise()) as UserModel;
  };

  public getUser = async (userId: string): Promise<UserModel> => {
    return (await this.httpClient
      .get<any>(
        this.configService.config.apiRoot + "users/" + userId.replace("/", "") // Prevent //'s from escaping the url
      )
      .toPromise()) as UserModel;
  };

  public getUsers = async (): Promise<UserModel[]> => {
    return (await this.httpClient
      .get<any>(this.configService.config.apiRoot + "users")
      .toPromise()) as UserModel[];
  };

  public signUp = async (eventId: string): Promise<void> => {
    return this.httpClient
      .post<any>(this.configService.config.apiRoot + "events/me/signUp/", {
        eventId
      })
      .toPromise();
  };

  public changeName = async (name: string): Promise<void> => {
    const data = (await this.httpClient
      .post<any>(this.configService.config.apiRoot + "users/me/updateName/", {
        name
      })
      .toPromise()) as {
      newToken: string;
    };
    this.saveJwt(data.newToken);
  };

  public changePhoneNumber = async (phoneNumber: string): Promise<void> => {
    const data = (await this.httpClient
      .post<any>(this.configService.config.apiRoot + "users/me/updatePhone/", {
        phoneNumber
      })
      .toPromise()) as {
      newToken: string;
    };
    this.saveJwt(data.newToken);
  };

  public drop = async (eventId: string): Promise<void> => {
    return this.httpClient
      .post<any>(this.configService.config.apiRoot + "events/me/drop/", {
        eventId
      })
      .toPromise();
  };

  public getMyEvents = async (): Promise<MyEventsResponse> => {
    return (await this.httpClient
      .get<any>(this.configService.config.apiRoot + "events/me/events/")
      .toPromise()) as MyEventsResponse;
  };

  public enterCode = async (eventId: string, code: string): Promise<void> => {
    return this.httpClient
      .post<any>(
        this.configService.config.apiRoot +
          "events/" +
          eventId.replace("/", "") +
          "/enterCode",
        {
          code
        }
      )
      .toPromise();
  };

  public getMyAvailableEvents = async (): Promise<EventModel[]> => {
    return (await this.httpClient
      .get<any>(this.configService.config.apiRoot + "events/me/available/")
      .toPromise()) as EventModel[];
  };

  public logOut = () => localStorage.removeItem("session");

  public saveJwt = (jwt: string) => localStorage.setItem("session", jwt);
}
