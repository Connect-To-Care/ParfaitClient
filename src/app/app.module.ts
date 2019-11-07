import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, Injectable, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavbarComponent} from './components/navbar/navbar.component';
import {HomeComponent} from './components/home/home.component';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PageTitleComponent} from './components/page-title/page-title.component';
import {OAuthSuccessComponent} from './components/oauth-success/oauth-success.component';
import {OAuthLoginComponent} from './components/oauth-login/oauth-login.component';
import {OAuthFailureComponent} from './components/oauth-failure/oauth-failure.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {APIInterceptor} from './interceptors/api.interceptor';
import {TokenInterceptor} from './interceptors/token.interceptor';
import {LogoutComponent} from './components/logout/logout.component';
import {AccountComponent} from './components/account/account.component';
import {NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule} from 'ngx-google-analytics';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ManageUsersComponent} from './components/manage-users/manage-users.component';
import {AddTagDialogComponent, EditUserComponent, RemoveTagDialogComponent} from './components/edit-user/edit-user.component';
import {PhoneNagComponent, PhoneNagDialogComponent} from './components/phone-nag/phone-nag.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://0c84ea0d000c41958b0be30eccc3fa81@sentry.connect-tocare.org/2'
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {
  }

  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({eventId});
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
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
    AddTagDialogComponent,
    RemoveTagDialogComponent
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
    NgxGoogleAnalyticsModule.forRoot('UA-149435955-2'),
    NgxGoogleAnalyticsRouterModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
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
    },
    // {
    //   provide: ErrorHandler, useClass: SentryErrorHandler
    // }
  ],
  entryComponents: [
    PhoneNagDialogComponent,
    AddTagDialogComponent,
    RemoveTagDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
