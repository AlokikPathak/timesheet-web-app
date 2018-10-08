/**
 * File Name: login-form.component.ts
 * Shows Login form and perform login-authentication
 * 
 * Created On: 03/09/2018
 * Author: Alokik Pathak 
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,  Validators } from '@angular/forms';
import { FilemakerdbService} from '../filemakerdb.service';
import { Observable } from 'rxjs'; //Holds data return from API
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { MatTableDataSource, MatSort} from '@angular/material';
import { DataSource } from '@angular/cdk/table';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

/**
 * Login form functionalities such login-authentication are performed
 * 
 */
export class LoginFormComponent implements OnInit {

  loginForm : FormGroup;
  submitted = false;

  model: any = {};

  response$ : any = {};

  constructor( private formBuilder: FormBuilder,
     private serviceData: FilemakerdbService,
     private router: Router,
     private sessionStorage: SessionStorageService
    ) { }

  ngOnInit() {

    // Checking sessions
    if( this.sessionStorage.retrieve('Login') ){
      this.router.navigate(['/dashboard']);
    }


    this.loginForm = this.formBuilder.group({

      email:  [
        '',[
        Validators.required,
        Validators.pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
        ]
      ],

      password: [
        '',[
        Validators.required,
        Validators.minLength(6)
        ]
      ]
    });
  }

  /**
   * Get the values of form-control elements from Login-Form
   * 
   */
  get f(){
    return this.loginForm.controls;
  }

  /**
   * Performs login-authentication after form-submission
   * 
   */
  onSubmit(){
     this.submitted = true;

     //stops here if form is invalid
     if( this.loginForm.invalid){
       return ;
     }

    this.serviceData.authenticateLogin(this.model.email, this.model.password).subscribe(
      serviceData => {
        this.response$ = serviceData,
        error => console.log(error),
        this.onResponse()
      }
    )
    

  }

  /**
   * Gets the Server response and preform operation accordingly 
   * 
   */
  onResponse(){
    
    // Storing session variables
    if( this.response$.hasOwnProperty( 'code' ) ){

      if( this.response$.code == 200 ){
       
        this.sessionStorage.store( "Login", true );
        this.sessionStorage.store( 'user', this.model.email );
        this.sessionStorage.store("loggedInUserId", this.response$.UserID);
        this.sessionStorage.store("Name", this.response$.Name);
        this.sessionStorage.store("Designation", this.response$.Designation);
        
        // Navigating to Dashboard component
        this.router.navigate(['dashboard']);
      }
    } 
  }

}
