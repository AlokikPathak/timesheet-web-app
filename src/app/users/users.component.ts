/**
 * File Name: users.component.ts
 * Shows all users profile on Data Table
 * Created On: 25/08/2018
 * 
 * Author: Alokik Pathak 
 */

import { FilemakerdbService} from '../filemakerdb.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSnackBar} from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { Activity, Profile } from '../models/server_response.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from '../../../node_modules/rxjs';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { DialogConfirmComponent} from '../dialog-confirm/dialog-confirm.component';
import { isEmpty } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

/**
 * Profiles Data tables and other functions are performed
 * 
 */
export class UsersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = 
  ['___kp_UserID', 'FirstName', 'LastName', '_ka_Email', '_ka_Mobile', 'Designation', 'Address'];
 
  public dataSource;
  
  // Stores service response
  private responseData: any = {};   

  // Paginator properties 
  public pageSize : number = 10;
  public currentPage : number = 0;
  public totalSize : number = 50;

  constructor(
  
    private filemakerDbService:FilemakerdbService, 
    private route: ActivatedRoute,
    private router: Router,
    private sessionStorage: SessionStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar

  ) { 

      // Initializing Mat-table
      this.dataSource = new UserDataSource( this.filemakerDbService, this.sessionStorage );
  }

  ngOnInit() {

    // Adding paginator
    this.dataSource.paginator = this.paginator;
    
    console.log(
      "length: "+this.paginator.length+
      " Index"+this.paginator.pageIndex+
      " PageSize: "+this.paginator.pageSize
    );
    
    console.log("DataSource Length: "+this.dataSource.length);
  }

  /**
   * Filters the table as per the search keyword
   * 
   * @param string filterValue 
   */
  applyFilter(filterValue: string) {
   
    filterValue = filterValue.trim().toLowerCase();
    
    if(  filterValue !== "" ){

      this.dataSource = new FilterUserDataSource( 
        this.filemakerDbService, this.sessionStorage, filterValue 
      );

    }else{
      
      this.dataSource = new FilterUserDataSource( this.filemakerDbService, this.sessionStorage, "*" );
    }
   
  }

  /**
   * Fetches Paginator data
   * 
   */
  getPaginatorData(event){
    
    console.log(event);
    
    console.log(
      "length: "+this.paginator.length+
      " Index"+this.paginator.pageIndex+
      " PageSize: "+this.paginator.pageSize
    );
    
  }

}


/**
 * Used for parsing server response and populating Activity list on data table
 * 
 */
export class UserDataSource extends DataSource<any> {

  constructor( private fmService: FilemakerdbService, private sessionVariables: SessionStorageService){
    super();
  }

	// Connect function called by the table to retrieve one stream containing the data to render.
  connect(): Observable<Profile[]>{
    return this.fmService.getUsers();
  }

  disconnect(){}
}

/**
 * Used for parsing server response and populating Activity list on data table 
 * based on filter keyword
 * 
 */
export class FilterUserDataSource extends DataSource<any> {

  constructor( 
    private fmService: FilemakerdbService,
    private sessionVariables: SessionStorageService,
    private filterKey){
    
    super();

  }

	// Connect function called by the table to retrieve one stream containing the data to render.
  connect(): Observable<Profile[]>{
    return this.fmService.getUsersFiltered( this.filterKey );
  }

  disconnect(){}
}

