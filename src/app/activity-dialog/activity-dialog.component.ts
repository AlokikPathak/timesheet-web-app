/**
 * File Name: activity-dialog.component.ts
 * Shows Dialog box with according to different operations
 * 
 * Created On: 05/09/2018
 * Author: Alokik Pathak 
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilemakerdbService} from '../filemakerdb.service';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';
import { MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { Activity } from '../models/server_response.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from '../../../node_modules/rxjs';
import { DISABLED } from '../../../node_modules/@angular/forms/src/model';


/** Dialog contents */
export interface DialogData{
  name: string;
  description: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.css']
})

/**
 * Handles Activity Dialog Form 
 * 
 */
export class ActivityDialogComponent implements OnInit {


  
  public name: string;
  public description: string;

  private activityId;
  private activityDetails;
 
  activityDescription = new FormControl('', [Validators.required]);
  
  private serviceResponse: any = {};

  // Creating object of Custon MatInput form field validator class
  matcher = new MyErrorStateMatcher();

  constructor(

    public dialog: MatDialog,
    private filemakerDbService:FilemakerdbService,
    private sessionStorage: SessionStorageService,
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit() {}


  /**
   * Invoked when cancel button is pressed in Dialog form
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   *  Add new Activity when submit button is pressed in Dialog form to add new Activity
   */
  onSubmit(): void {

    var jsonData = JSON.stringify(this.data);
    var jsonDataObject = JSON.parse( jsonData);
    var name =jsonDataObject.activityDescription;
    var id = jsonDataObject.activityId;

    // Http request Service to Add Activity to Server database 
    this.filemakerDbService.updateActivity( id, name ).subscribe(
      
      filemakerDbService => {
        
        this.serviceResponse= filemakerDbService,
        error => console.log(error),
        this.afterServiceResponse()
      }
    )
    
  }

  /** 
   * Performs  opertation after service gives response 
   * 
   */
  afterServiceResponse(){
    console.log("Operation performed");
  }






}
