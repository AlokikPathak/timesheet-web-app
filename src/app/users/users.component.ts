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
import { MatPaginator, MatTableDataSource,Sort } from '@angular/material';
import { MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { Activity, Profile } from '../models/server_response.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable, throwError, pipe } from '../../../node_modules/rxjs';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { UserActivityComponent } from './dialogs/user-activity/user-activity.component';
import { DialogConfirmComponent} from '../dialog-confirm/dialog-confirm.component';
import { isEmpty, tap, map, switchMap, catchError, debounceTime } from '../../../node_modules/rxjs/operators';
import { consumeBinding } from '../../../node_modules/@angular/core/src/render3/instructions';

@Component({
  providers: [ UserActivityComponent ],
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

  public filterKey = "";
  public filterField = "___kp_UserID";
  public sort = "___kp_UserID";
  public order = 'asc';

  public spinnerFlag = false;

  constructor(
  
    private filemakerDbService:FilemakerdbService, 
    private route: ActivatedRoute,
    private router: Router,
    private sessionStorage: SessionStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar

  ) { 

      // Initializing Mat-table
      this.dataSource = new UserDataSource( 
        this.filemakerDbService,
        this.sessionStorage,
        this.paginator,
        this.filterKey,
        this.filterField,
        this.sort,
        this.order
      );
      
  }

  ngOnInit() {

    // Adding paginator
    this.dataSource.paginator = this.paginator;

  }

  /**
   * Filters the table as per the search keyword
   * 
   * @param string filterValue 
   */
  applyFilter(filterValue: string) {
   
    filterValue = filterValue.trim().toLowerCase();

    // Setting Paginator value to default
    this.setPaginatorDefault();

    this.filterField = 'all';
    this.filterKey = filterValue;

    this.refreshDataSource();
 
  }

  /**
   * Filters the table as per the column search keyword
   * 
   * @param string filterValue 
   */
  applyFilterColumn( filterKey, fieldName ){

    console.log('Coulmn search  ==> FilterKey: '+filterKey+" Field Name: "+fieldName); 
    this.filterKey= filterKey;
    this.filterField = fieldName;
    
    this.setPaginatorDefault();
    this.refreshDataSource();
  }
  

  /**
   * Fetches Paginator data
   * 
   */
  getPaginatorData(event){

    console.log(event);
    this.refreshDataSource();
  
  }

  /**
   * Refresh the Data Table DataSource
   */
  refreshDataSource(){
    
    this.spinnerFlag = true;
    // Refreshing Data Source
    this.dataSource = new UserDataSource( 
      this.filemakerDbService,
      this.sessionStorage,
      this.paginator,
      this.filterKey,
      this.filterField,
      this.sort,
      this.order
    );

    this.spinnerFlag = false;
  }
  
  /**
   * Setting Paginator values to default
   */
  setPaginatorDefault(){
    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0;
  }

  /**
   * Sort data table
   */
  sortData(sort: Sort){

    console.log(sort);
    this.sort = (sort.active);
    this.order = (sort.direction);
    this.refreshDataSource();

    console.log("sorted field: "+this.sort+" order: "+this.order);
  }

  /**
   * Active spinner
   */
  activateSpinner(){

   // this.spinnerFlag = true;
    var n=1000;
    while(n){
      n--;
      //console.log(n);
    }
    //this.spinnerFlag = false;
  }

  /**
   * Show the selected row value of data table
   */
  selectRow(row){
    console.log(row);
    this.showUserActivity(row.___kp_UserID);
  }

  /**
   * Shows user's activities 
   */
  showUserActivity(userID): void{

    const dialogRef = this.dialog.open( UserActivityComponent,{
      width: '900px',
      data:{UserID: userID}
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log('Activities dialog was closed!');
      
    });

  }
}


/**
 * Used for parsing server response and populating Activity list on data table
 * 
 */
export class UserDataSource extends DataSource<any> {

  constructor( 
    private fmService: FilemakerdbService,
    private sessionVariables: SessionStorageService,
    private paginator: MatPaginator,
    private filterKey: string,
    private filterField: string,
    private sort: string,
    private order: string
  ){
    super();
  }

	// Connect function called by the table to retrieve one stream containing the data to render.
  connect(): Observable<Profile[]>{
    
   // UsersComponent.spinnerFlag = true;
    
    return this.fmService.getUsers(this.paginator, this.filterKey, this.filterField, this.sort, this.order).pipe(
      
      tap(
        
        data => {
          console.log("Observable Get Data: ", data);
          
          if(!('code' in data)){
            // setting up paginator
            this.paginator.length = data[0].ResultsFound;
          }else{
            this.paginator.length = 0;
            console.log("No results found!");
          }

        }
      ),catchError(e=>throwError(e)),

    )
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
    private filterKey,
    private paginator: MatPaginator,
  ){
    
    super();

  }

	// Connect function called by the table to retrieve one stream containing the data to render.
  connect(): Observable<Profile[]>{

    return this.fmService.getUsersFiltered( this.filterKey, this.paginator ).pipe(
  
      tap(data => {
        
        console.log('Observable data ',data);

        this.paginator.length = data[0].ResultsFound;

        }
      )
    );
  }

  disconnect(){}
}

