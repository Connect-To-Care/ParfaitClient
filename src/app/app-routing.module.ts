import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {AuthGuard} from './guards/auth.guard';
import {OAuthLoginComponent} from './components/oauth-login/oauth-login.component';
import {DeauthGuard} from './guards/deauth.guard';
import {OAuthSuccessComponent} from './components/oauth-success/oauth-success.component';
import {LogoutComponent} from './components/logout/logout.component';
import {OAuthFailureComponent} from './components/oauth-failure/oauth-failure.component';
import {AccountComponent} from './components/account/account.component';
import {NotFoundComponent} from './components/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    component: AccountComponent,
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
