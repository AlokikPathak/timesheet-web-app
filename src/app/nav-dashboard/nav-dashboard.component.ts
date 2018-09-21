/**
 * File Name: nav-dashboard.component.ts
 * Logout the user from the dashboard
 * 
 * Created On: 03/09/2018
 * Author: Alokik Pathak 
 */

import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityComponent } from '../activity/activity.component';

@Component({
  selector: 'app-nav-dashboard',
  templateUrl: './nav-dashboard.component.html',
  styleUrls: ['./nav-dashboard.component.css']
})

/**
 * Handles Master Dashboard functionalities
 * 
 */
export class NavDashboardComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    
  constructor(private breakpointObserver: BreakpointObserver) {}
  
  }
