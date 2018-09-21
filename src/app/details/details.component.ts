/**
 * File Name: details.component.ts
 * Contains the dashboard of Profiles
 * 
 * Created On: 01/09/2018
 * Author: Alokik Pathak 
 */

import { Component, OnInit } from '@angular/core';
import { FilemakerdbService} from '../filemakerdb.service';
import { Observable } from 'rxjs'; //Holds data return from API
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})


/**
 * Shows logged In user details
 * 
 */
export class DetailsComponent implements OnInit {

  user$: Object;

  constructor( private data : FilemakerdbService, private route : ActivatedRoute) { 

    this.route.params.subscribe( params => this.user$ = params.id);
  }

  ngOnInit() {

    this.data.getUser( this.user$ ).subscribe(
      data => this.user$ = data
    )
  }

}
