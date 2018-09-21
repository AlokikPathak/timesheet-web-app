/**
 * File Name: dialog-confirm.component.ts
 * Shows the confirmation dialog form
 * 
 * Created On: 01/09/2018
 * Author: Alokik Pathak 
 */


import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilemakerdbService} from '../filemakerdb.service';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';
import { MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { Activity } from '../models/server_response.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from '../../../node_modules/rxjs';

/** Dialog contents */
export interface DialogData{
  name: string;
  description: string;
}

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})

/**
 * Confirm Dialog Form fucntionalities are performed
 * 
 */
export class DialogConfirmComponent implements OnInit {

  private serviceResponse: any = {};
  //dialogForm : FormGroup;

  constructor(

    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private filemakerDbService:FilemakerdbService,
    private sessionStorage: SessionStorageService,
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  /**
   * Cheking validation of Add Activity dialog form
   */
  dialogForm  = new FormGroup({
   activityId : new FormControl({ disabled:true}, [
   ])
  })
  

  ngOnInit() {
  }

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

    console.log('Delete activity: '+id);

    // Http request Service to Add Activity to Server database 
      this.filemakerDbService.deleteActivity( id ).subscribe(
      
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
    console.log(JSON.stringify(this.serviceResponse));
 
  }

  
}
