import { FilemakerdbService} from '../../../filemakerdb.service';
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
import { Activity, Profile, Log } from '../../../models/server_response.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable, throwError, pipe } from '../../../../../node_modules/rxjs';
import { isEmpty, tap, map, switchMap, catchError, debounceTime } from '../../../../../node_modules/rxjs/operators';
import { consumeBinding } from '../../../../../node_modules/@angular/core/src/render3/instructions';
import { AddActivityLogComponent } from '../add-activity-log/add-activity-log.component';

@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.css']
})
export class ActivityLogsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = 
  ['___kp_LogId', 'Note', 'CreationTimestamp'];
 
  public dataSource;

  // Query parameters
  public filterKey  = '';
  public filterField  = '___kp_LogId';
  public skip = 0;
  public limit  = 3;
  public sort = '___kp_LogId';
  public order = 'asc';


  constructor(
    @Inject (MAT_DIALOG_DATA) public data: any,
    private filemakerDbService:FilemakerdbService, 
    private sessionStorage: SessionStorageService,
    public dialog: MatDialog,
  ) {

      // Initializing Mat-table
      this.dataSource = new LogDataSource(
        this.data.ActivityId,
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
    console.log("Recieved data activity id: "+this.data.ActivityId);
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
   * Show the selected row value of data table
   */
  selectRow(row){
    console.log(row);
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
  
    // Refreshing Data Source
    this.dataSource = new LogDataSource( 
      this.data.ActivityId,
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
   * Open Add Activity-Log from dialog
   * 
   */
  openAddLogDialog(){

    const dialogRef = this.dialog.open( AddActivityLogComponent,{
      width: '500px',
      data: { ActivityId: this.data.ActivityId }
    });

    dialogRef.afterClosed().subscribe( result => {

      console.log('Add Log dialog was closed!');
      this.refreshDataSource();
      
    });
  }

}


/**
 * Used for parsing server response and populating Activity list on data table
 * 
 */
export class LogDataSource extends DataSource<any> {

  constructor( 
    private activityId: number,
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
  connect(): Observable<Log[]>{
    
    return this.fmService.getActivityLogs(this.activityId, this.paginator, this.filterKey, this.filterField, this.sort, this.order).pipe(
      
      tap(
        
        data => {
          console.log("Observable Log Data: ", data);
          
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
