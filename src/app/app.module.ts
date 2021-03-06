import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, Injectable, NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app/app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {AlertSheetComponent, NavbarComponent} from "./components/navbar/navbar.component";
import {
  DashComponent,
  FacilitatorAddDialogComponent
} from "./components/dash/dash.component";
import {
  MatBadgeModule, MatBottomSheet, MatBottomSheetModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PageTitleComponent } from "./components/page-title/page-title.component";
import { OAuthSuccessComponent } from "./components/oauth-success/oauth-success.component";
import { OAuthLoginComponent } from "./components/oauth-login/oauth-login.component";
import { OAuthFailureComponent } from "./components/oauth-failure/oauth-failure.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { APIInterceptor } from "./interceptors/api.interceptor";
import { TokenInterceptor } from "./interceptors/token.interceptor";
import { LogoutComponent } from "./components/logout/logout.component";
import { AccountComponent } from "./components/account/account.component";
import {
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule
} from "ngx-google-analytics";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { ManageUsersComponent } from "./components/manage-users/manage-users.component";
import { EditUserComponent } from "./components/edit-user/edit-user.component";
import {
  PhoneNagComponent,
  PhoneNagDialogComponent
} from "./components/phone-nag/phone-nag.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import * as Sentry from "@sentry/browser";
import { ManageEventsComponent } from "./components/manage-events/manage-events.component";
import {
  DeleteEventDialogComponent,
  EditEventComponent,
  EditWarningDialogComponent
} from "./components/edit-event/edit-event.component";
import { EventDetailsComponent } from "./components/event-details/event-details.component";
import {
  MatDatepickerModule,
  MatMomentDateModule
} from "@coachcare/datepicker";
import { GiveDecaTagComponent } from "./components/give-deca-tag/give-deca-tag.component";
import { HomeComponent } from "./components/home/home.component";
import { EventKioskManualComponent } from "./components/event-kiosk-manual/event-kiosk-manual.component";
import { AboutComponent } from "./components/about/about.component";
import { NameNagComponent } from "./components/name-nag/name-nag.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { EventKioskCodeComponent } from "./components/event-kiosk-code/event-kiosk-code.component";
import { EventSigninClockComponent } from "./components/event-signin-clock/event-signin-clock.component";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { FacilitatorActionsDialogComponent } from "./components/facilitator-actions/facilitator-actions.component";
import { EventSigninComponent } from "./components/event-signin/event-signin.component";
import { ExportDataComponent } from './components/export-data/export-data.component';

// Sentry.init({
//   dsn: 'https://0c84ea0d000c41958b0be30eccc3fa81@sentry.connect-tocare.org/2'
// });

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({ eventId });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashComponent,
    PageTitleComponent,
    OAuthSuccessComponent,
    OAuthLoginComponent,
    OAuthFailureComponent,
    LogoutComponent,
    AccountComponent,
    NotFoundComponent,
    ManageUsersComponent,
    EditUserComponent,
    PhoneNagComponent,
    PhoneNagDialogComponent,
    ManageEventsComponent,
    EditEventComponent,
    FacilitatorAddDialogComponent,
    DeleteEventDialogComponent,
    EventDetailsComponent,
    GiveDecaTagComponent,
    HomeComponent,
    EventKioskManualComponent,
    AboutComponent,
    NameNagComponent,
    EventKioskCodeComponent,
    EventSigninClockComponent,
    FacilitatorActionsDialogComponent,
    EditWarningDialogComponent,
    EventSigninComponent,
    AlertSheetComponent,
    ExportDataComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatTabsModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatCardModule,
    MatBadgeModule,
    MatTooltipModule,
    MatListModule,
    MatSnackBarModule,
    NgxGoogleAnalyticsModule.forRoot("UA-149435955-2"),
    NgxGoogleAnalyticsRouterModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatMenuModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    NgxQRCodeModule,
    MatBottomSheetModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
    // {
    //   provide: ErrorHandler, useClass: SentryErrorHandler
    // }
  ],
  entryComponents: [
    PhoneNagDialogComponent,
    FacilitatorAddDialogComponent,
    DeleteEventDialogComponent,
    FacilitatorActionsDialogComponent,
    EditWarningDialogComponent,
    AlertSheetComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
