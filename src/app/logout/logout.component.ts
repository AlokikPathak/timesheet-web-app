/**
 * File Name: logout.component.ts
 * Logout the user from the dashboard
 * 
 * Created On: 03/09/2018
 * Author: Alokik Pathak 
 */

import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

/**
 * Actions needed for logout are performed
 * 
 */
export class LogoutComponent implements OnInit {

  constructor(private sessionStorage: SessionStorageService,
    private router:Router
  ) { }

  ngOnInit() {

    // Checking sessions
    this.sessionStorage.clear('Login');
    this.sessionStorage.clear('user');
    this.sessionStorage.clear('loggedInUserId');

    // Navigating to Login form page
    this.router.navigate(['']);
    
  }

}
