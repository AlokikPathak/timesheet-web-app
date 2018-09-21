/**
 * File Name: register-form.component.ts
 * Shows Registration form and register new users
 * 
 * Created On: 03/09/2018
 * Author: Alokik Pathak 
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,  Validators } from '@angular/forms';
import { FilemakerdbService} from '../filemakerdb.service';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})

/**
 * Handles Registration Form functionalities
 * 
 */
export class RegisterFormComponent implements OnInit {

  registerForm : FormGroup;
  submitted = false;
  model: any = {};
  response$ : any = {};
  
  constructor(  private formBuilder: FormBuilder,
     private fileMakerData: FilemakerdbService,
     private router: Router,
     private sessionStorage : SessionStorageService ) { }

  ngOnInit() {

      // Checking sessions 
      if( this.sessionStorage.retrieve('Login') ){
          this.router.navigate(['/dashboard']);
      }

      this.registerForm = this.formBuilder.group({

      firstName: [
        '',[
          Validators.required,
          Validators.pattern(/^[a-zA-Z]*$/)
        ]
      ],

      lastName: [
        '',[
          Validators.pattern(/^[a-zA-Z]*$/)
        ]
      ],


      email:  [
        '',[
        Validators.required,
        Validators.pattern(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
        ]
      ],

      mobile:  [
        '',[
        Validators.required,
        Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)
        ]
      ],

      address:  [
        '',[
        
        ]
      ],

      password: [
        '',[
        Validators.required,
        Validators.minLength(6)
        ]
      ],

      designation: [
        '',[
        Validators.required
        ]
      ]

    });
  }

  /**
   * Get the form-control field values
   * 
   */
  get f(){
    return this.registerForm.controls;
  }

  /**
   * Validates and register form data
   * 
   */
  onSubmit(){
    
    this.submitted = true;

    // Returns when the any of form-input is invalid
    if( this.registerForm.invalid){
      return ;
    }

    var firstName = this.model.firstName;
    var lastName = ""+this.model.lastName;
    var email = this.model.email;
    var mobile = this.model.mobile;
    var address = ""+this.model.address;
    var password = this.model.password;
    var designation = ""+this.model.designation;
    
    this.fileMakerData.addRecord( firstName, lastName,
      email, mobile, address, password, designation).subscribe(
      fileMakerData =>{ 
        
        this.response$ = fileMakerData,
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

      if( this.response$.code == 201 ){
        
        alert("Registration successful, Please login");
        // Navigating to Dashboard component
        this.router.navigate(['']);
      }
    } 
  }
}
