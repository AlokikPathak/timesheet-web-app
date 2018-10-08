import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2Webstorage} from 'ngx-webstorage';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { UsersComponent } from './users/users.component';
import { DetailsComponent } from './details/details.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RegisterFormComponent } from './register-form/register-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavDashboardComponent } from './nav-dashboard/nav-dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSnackBarModule,MatToolbarModule, MatTooltipModule, MatFormFieldModule, MatButtonModule,MatPaginatorModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatMenuModule, MatFormField, MatInputModule, MatTableModule,  MatSelectModule, MatSortModule, MatProgressSpinnerModule, MatSidenav } from '@angular/material';
import { ActivityComponent, DialogForm } from './activity/activity.component';
import { LogoutComponent } from './logout/logout.component';
import { ServeComponent } from './serve/serve.component';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { UserActivityComponent } from './users/dialogs/user-activity/user-activity.component';
import { AssignActivityDialogComponent } from './users/dialogs/assign-activity-dialog/assign-activity-dialog.component';
import { ActivityLogsComponent } from './activity/components/activity-logs/activity-logs.component';
import { AddActivityLogComponent } from './activity/components/add-activity-log/add-activity-log.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    UsersComponent,
    DetailsComponent,
    RegisterFormComponent,
    DashboardComponent,
    NavDashboardComponent,
    ActivityComponent,
    LogoutComponent,
    ServeComponent,
    DialogForm,
    ActivityDialogComponent,
    DialogConfirmComponent,
    UserActivityComponent,
    AssignActivityDialogComponent,
    ActivityLogsComponent,
    AddActivityLogComponent,
    
    
  ],
  exports:[
    DialogForm,
    DialogConfirmComponent,
  ],
  entryComponents:[
    DialogForm,
    ActivityDialogComponent,
    DialogConfirmComponent,
    UserActivityComponent,
    AssignActivityDialogComponent,
    ActivityLogsComponent,
    AddActivityLogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng2Webstorage,
    BrowserAnimationsModule,
    LayoutModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
