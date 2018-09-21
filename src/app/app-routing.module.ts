import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, ExtraOptions, Router} from '@angular/router';
import { UsersComponent } from './users/users.component';
import { DetailsComponent } from './details/details.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavDashboardComponent} from './nav-dashboard/nav-dashboard.component';
import { ActivityComponent } from './activity/activity.component';
import { LogoutComponent } from './logout/logout.component';


const routes: Routes = [
  {
    path: '',
    component: LoginFormComponent
  },
  {
    path: 'details/:id',
    component: DetailsComponent
  },
  {
    path: 'register',
    component: RegisterFormComponent
  },
  {
    path: 'dashboard',
    component: NavDashboardComponent,
    children:[
      { path: 'activity', component: ActivityComponent, outlet: 'dashboard-outlet'},
      { path: 'logout', component: LogoutComponent, outlet:'dashboard-outlet' },
      { path: 'profiles', component: UsersComponent, outlet:'dashboard-outlet' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})]
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
