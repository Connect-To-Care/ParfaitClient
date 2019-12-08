import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashComponent} from './components/dash/dash.component';
import {AuthGuard} from './guards/auth.guard';
import {OAuthLoginComponent} from './components/oauth-login/oauth-login.component';
import {DeauthGuard} from './guards/deauth.guard';
import {OAuthSuccessComponent} from './components/oauth-success/oauth-success.component';
import {LogoutComponent} from './components/logout/logout.component';
import {OAuthFailureComponent} from './components/oauth-failure/oauth-failure.component';
import {AccountComponent} from './components/account/account.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ManageUsersComponent} from './components/manage-users/manage-users.component';
import {AdminGuard} from './guards/admin.guard';
import {EditUserComponent} from './components/edit-user/edit-user.component';
import {PhoneNagComponent} from './components/phone-nag/phone-nag.component';
import {EditEventComponent} from './components/edit-event/edit-event.component';
import {ManageEventsComponent} from './components/manage-events/manage-events.component';
import {GiveDecaTagComponent} from './components/give-deca-tag/give-deca-tag.component';
import {HomeComponent} from './components/home/home.component';
import {EventKioskManualComponent} from './components/event-kiosk-manual/event-kiosk-manual.component';
import {AboutComponent} from './components/about/about.component';
import {NameNagComponent} from './components/name-nag/name-nag.component';
import {EventKioskCodeComponent} from './components/event-kiosk-code/event-kiosk-code.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: []
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: []
  },
  {
    path: 'dash',
    component: DashComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'deca',
    component: GiveDecaTagComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nag/name',
    component: NameNagComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nag/phone',
    component: PhoneNagComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: OAuthLoginComponent,
    canActivate: [DeauthGuard]
  },
  {
    path: 'login/success/:jwt',
    component: OAuthSuccessComponent,
    canActivate: [DeauthGuard]
  },
  {
    path: 'login/failure',
    component: OAuthFailureComponent,
    canActivate: [DeauthGuard]
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/users',
    component: ManageUsersComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/users/:user',
    component: EditUserComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/events',
    component: ManageEventsComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/events/new',
    component: EditEventComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/events/:event',
    component: EditEventComponent,
    canActivate: [AuthGuard] // We handle this on the page itself because the user may be a facilitator
  },
  {
    path: 'admin/events/:event/kiosk/manual',
    component: EventKioskManualComponent,
    canActivate: [AuthGuard] // We handle this on the page itself because the user may be a facilitator
  },
  {
    path: 'admin/events/:event/kiosk/code',
    component: EventKioskCodeComponent,
    canActivate: [AuthGuard] // We handle this on the page itself because the user may be a facilitator
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
