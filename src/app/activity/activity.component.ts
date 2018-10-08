/**
 * File Name: activity.component.ts
 * Shows activity data table
 * 
 * Created On: 05/09/2018
 * Author: Alokik Pathak 
 */

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher} from '@angular/material/core';
import { MatSnackBar, Sort } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { FilemakerdbService } from '../filemakerdb.service';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { Activity } from '../models/server_response.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from '../../../node_modules/rxjs';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { ActivityLogsComponent } from './components/activity-logs/activity-logs.component';
import { isEmpty, tap, map, switchMap, catchError } from '../../../node_modules/rxjs/operators';

// Dialog contents 
export interface DialogData{
  name: string;
  description: string;
}

// Error when invalid control is dirty, touched, or submitted
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({

  providers: [ ActivityDialogComponent, ActivityLogsComponent  ],
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})

/**
 * Handles Activity Data Table
 * 
 */
export class ActivityComponent implements OnInit {

  public name: string;
  public description: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = 
  ['___kp_Id', 'Name', 'CreationTimestamp', 'CreatedBy', 'ModificationTimestamp', 'ModifiedBy', 'actionsColumn'];
 
  public dataSource;

  // Query parameters
  public filterKey  = '';
  public filterField  = '___kp_Id';
  public skip = 0;
  public limit  = 10;
  public sort = '___kp_Id';
  public order = 'asc';

  
  // Stores service response
  private responseData: any = {};   
  
  private deleteFlag = false;
  private modifyFlag = false;
  public spinnerFlag = false;


  constructor( 
   
    private filemakerDbService:FilemakerdbService, 
    private route: ActivatedRoute,
    private router: Router,
    private sessionStorage: SessionStorageService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  
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

    // Adding paginator to Data source
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Filters the table as per the search keyword
   * 
   * @param string filterValue
   */
  applyFilter(filterValue: string) {
   
    filterValue = filterValue.trim().toLowerCase();
    this.filterKey = filterValue;

    console.log('Search key: '+filterValue+" type: global");
    // 'all' for global search
    this.filterField = 'all';

    this.setPaginatorDefault();
    this.refreshDataSource();
  }

  /** 
   * Open Add Activity Dialog form
   * 
   */
  public openAddActivityDialog(): void{

    this.refreshDataSource();
    const dialogRef = this.dialog.open( DialogForm,{
      width: '500px',
      data: { }
    });

    dialogRef.afterClosed().subscribe( result => {
      
      this.spinnerFlag = true;
      console.log('Activity dialog was closed!');
      this.description = result;
      this.refreshDataSource();
      this.spinnerFlag = false;
      
    });
  }

  /**
   * Refresh DataTable
   */
  public refreshDataSource(){

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
  
  /**
   * Fetches the data of selected row
   * 
   * @param Object row stores the selected data table row field values
   */
  selectRow(row) {
    
    console.log(row);

    if( this.deleteFlag ){
      
      console.log("Delete activity id: "+ row.___kp_Id);
      this.deleteSelectedActivity(row.___kp_Id);
      this.deleteFlag = false;
      
    }else if( this.modifyFlag ){

      this.modifySelectedActivity(row.___kp_Id, row.Name);
      this.modifyFlag = false;
    } else {

      this.showActivityLogs(row.___kp_Id);
    }
  }

  /**
   * Open dialog to show activity logs
   * @param activityId 
   */
  showActivityLogs(activityId){

    console.log('open activity log dialog: ActivityId'+activityId);
    const dialogRef = this.dialog.open(ActivityLogsComponent,{

      width: '700px',
      data:{ ActivityId: activityId }
    });

    dialogRef.afterClosed().subscribe( result => {

      console.log('Activity Logs dialog was closed!');
      this.description = result;

    });

  }

  /**
   * Deletes the selected record from the table
   * 
   */
  deleteSelectedActivity( id ){

    const dialogRef = this.dialog.open(DialogConfirmComponent,{

      width: '300px',
      data:{ activityId: id }
    });

    dialogRef.afterClosed().subscribe( result => {

      console.log('Delete Activity dialog was closed!');
      this.description = result;
      this.refreshDataSource();
      
    });

    this.deleteFlag = false;
    
  }

  /**
   * Modify  the  selected activity
   * 
   */
  modifySelectedActivity( id, activityDetails ):void {
  
    const dialogRef = this.dialog.open( ActivityDialogComponent,{
      width: '500px',
      data:{ activityDescription: activityDetails, activityId: id }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log('Modify Activity dialog was closed!');
      this.description = result;
      this.refreshDataSource();
      
    });

    this.modifyFlag = false;
  
  }

  /** 
   * Performs modify
   * 
   */
  performModify(){
    this.modifyFlag = true;
  }

  /**
   * Sets the deleteFlag to true for performing delete operation
   * 
   */
  performDelete(){
    this.deleteFlag = true;
  }

  /** 
   * Performs  opertation after service gives response 
   * 
   */
  afterServiceResponse(){
   
    if(this.responseData.code = 200 ){
      
      this.refreshDataSource();
      this.openSnackBar("Activity Deleted!","");
      console.log(this.responseData.status);

    }else{
      
      this.openSnackBar("Couldn't perform delete!","");
      console.log(this.responseData.status);
    }

    this.deleteFlag= false;    
  }

  /**
   * Show snack back component with message and action
   *
   * @param string message
   * @param string action
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
    });
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

    console.log("Sorted field: "+this.sort+" order: "+this.order);
  }

  /**
   * Fetches Paginator data
   * 
   */
  getPaginatorData(event){

    console.log(event);
    this.refreshDataSource();
  
  }

}

// Custom Dialog Form component
@Component({
  selector: 'dialog-form',
  templateUrl: 'dialog-form.html',
})

/**
 * Handles Custom Dialog Form of Add Activity Dialog
 */
export class DialogForm {

  private modifyFlag = true;
  
  private serviceResponse: any = {};

  /**
   * Cheking validation of Add Activity dialog form
   */
  activityDescription = new FormControl('', [
    Validators.required
  ]);

  // Creating object of Custon MatInput form field validator class
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogForm>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fileMakerData: FilemakerdbService,
    private sessionStorage : SessionStorageService 
  ) {}

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
    var name =jsonDataObject.activityDescription
  
    // Http request service to Add Activity to server database 
    this.fileMakerData.addActivity( this.sessionStorage.retrieve('loggedInUserId'), name, this.sessionStorage.retrieve('Name') ).subscribe(
      
      fileMakerData => {
        
        this.serviceResponse= fileMakerData,
        error => console.log(error),
        this.afterServiceResponse()
      }
    )

  }

  /** 
   * Performs  opertation after service gives response 
   */
  afterServiceResponse(){
    console.log("Activiy added");
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
    private paginator : MatPaginator,
    private filterKey: string,
    private filterField: string,
    private sort: string,
    private order: string
  ){
    super();
  }

	// Connect function called by the table to retrieve one stream containing the data to render
  connect(): Observable<Activity[]>{
    return this.fmService.getAllActivity( this.sessionVariables.retrieve('loggedInUserId'), this.paginator, this.filterKey, this.filterField, this.sort, this.order ).pipe(
      
      tap( data=>{
        
        console.log('Observable data: ',data);

        if (!('code' in data)) {
          // setting up paginator
          this.paginator.length = data[0].ResultsFound;
        } else {
          this.paginator.length = 0;
          console.log("No results found!");
        }
      
      })
    );
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
  connect(): Observable<Activity[]>{
    return this.fmService.filterActivity(this.sessionVariables.retrieve('loggedInUserId'), this.filterKey);
  }

  disconnect(){}
}