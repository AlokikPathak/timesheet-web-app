import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '../../../../../node_modules/@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilemakerdbService} from '../../../filemakerdb.service';
import { SessionStorageService } from 'ngx-webstorage';



@Component({
  selector: 'app-assign-activity-dialog',
  templateUrl: './assign-activity-dialog.component.html',
  styleUrls: ['./assign-activity-dialog.component.css']
})
export class AssignActivityDialogComponent implements OnInit {

  public form: FormGroup;
  public serviceResponse : any;
  constructor(
    public dialogRef: MatDialogRef<AssignActivityDialogComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private fileMakerData: FilemakerdbService,
    private sessionStorage: SessionStorageService

  ) { }

  ngOnInit() {

    this.form = this.formBuilder.group ( {
      activityDescription: [null , Validators.compose ( [ Validators.required ] )]
    } );

    console.log(this.data);
  }

  /**
   *  Add new Activity when submit button is pressed in Dialog form to add new Activity
   */
  onSubmit(): void {
  
    // Http request service to Add Activity to server database 
    this.fileMakerData.addActivity( this.data.UserID, this.form.controls.activityDescription.value, this.sessionStorage.retrieve('Name')  ).subscribe(

      fileMakerData => {
        
        this.serviceResponse= fileMakerData,
        error => console.log(error),
        this.afterServiceResponse(this.serviceResponse);
      }
    )

  }

  /** 
   * Performs  opertation after service gives response 
   */
  afterServiceResponse(response){
    console.log(response);
    this.dialogRef.close();
  }

  onNoClick(): void{
    this.dialogRef.close();
  }

}
