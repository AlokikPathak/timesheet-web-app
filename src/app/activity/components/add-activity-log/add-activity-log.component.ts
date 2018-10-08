import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '../../../../../node_modules/@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilemakerdbService} from '../../../filemakerdb.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-add-activity-log',
  templateUrl: './add-activity-log.component.html',
  styleUrls: ['./add-activity-log.component.css']
})
export class AddActivityLogComponent implements OnInit {

  public form : FormGroup;
  public serviceResponse: any;

  constructor(
    public dialogRef: MatDialogRef<AddActivityLogComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private fileMakerData: FilemakerdbService,
    private sessionStorage: SessionStorageService

  ) { }

  ngOnInit() {

    this.form = this.formBuilder.group ( {
      logDescription: [null , Validators.compose ( [ Validators.required ] )]
    } );

    console.log("Activity Id: "+this.data.ActivityId);
  }

  /**
   * When Add Activity-Log form is submitted
   */
  onSubmit(){
    // Http request service to Add Activity to server database 
    this.fileMakerData.addActivityLog( this.data.ActivityId, this.form.controls.logDescription.value).subscribe(

      fileMakerData => {
        
        this.serviceResponse= fileMakerData,
        error => console.log(error),
        this.afterServiceResponse(this.serviceResponse);
      }
    )
  }

  /**
   * When Add Activity-Log is cancelled
   */
  onNoClick(){
    this.dialogRef.close();
  }

  /** 
   * Performs  opertation after service gives response 
   */
  afterServiceResponse(response){
    console.log(response);
    this.dialogRef.close();
  }
}
