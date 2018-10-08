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
import { Activity, Profile } from '../../../models/server_response.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable, throwError, pipe } from '../../../../../node_modules/rxjs';
import { isEmpty, tap, map, switchMap, catchError, debounceTime } from '../../../../../node_modules/rxjs/operators';
import { consumeBinding } from '../../../../../node_modules/@angular/core/src/render3/instructions';
import { AssignActivityDialogComponent } from '../assign-activity-dialog/assign-activity-dialog.component';

@Component({
  providers: [ AssignActivityDialogComponent],
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css']
})
export class UserActivityComponent implements OnInit {
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns = 
  ['___kp_Id', 'Name', 'CreationTimestamp', 'CreatedBy', 'ModificationTimestamp', 'ModifiedBy'];
 
  public dataSource;

  // Query parameters
  public filterKey  = '';
  public filterField  = '___kp_Id';
  public skip = 0;
  public limit  = 5;
  public sort = '___kp_Id';
  public order = 'asc';


  constructor(
    @Inject (MAT_DIALOG_DATA) public data: any,
    private filemakerDbService: FilemakerdbService,
    public dialog: MatDialog,
  ) {

      // Initializing Mat-table
      this.dataSource = new UserDataSource( 
        this.filemakerDbService,
        this.data.UserID,
        this.paginator,
        this.filterKey,
        this.filterField,
        this.sort,
        this.order
      );

   }

  ngOnInit() {
    console.log("Dialog data: "+this.data);

    // Adding paginator to Data source
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
   * Refresh DataTable
   */
  public refreshDataSource(){

    this.dataSource = new UserDataSource(
      this.filemakerDbService,
      this.data.UserID,
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

  /**
   * Show the selected row value of data table
   */
  selectRow(row){
    console.log(row);
  }

  /**
   * Open Assign activity dialog form
   */
  openAssignActivityDialog():void{
    
    const dialogRef = this.dialog.open( AssignActivityDialogComponent,{
      width: '500px',
      data:{ UserID: this.data.UserID}
    });

    dialogRef.afterClosed().subscribe( result => {
      this.refreshDataSource();
      console.log('Assign Activity dialog was closed!');
      
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
    private userId: number,
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
    return this.fmService.getAllActivity( this.userId, this.paginator, this.filterKey, this.filterField, this.sort, this.order).pipe(
      
      tap( data=>{
        
        console.log('Activity observable data: ',data);

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
