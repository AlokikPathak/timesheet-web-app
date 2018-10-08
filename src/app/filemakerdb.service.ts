/**
 * File Name: filemakerdb.service.ts
 * Handles http requests 
 * Created On: 25/08/2018
 * 
 * Author: Alokik Pathak 
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CATCH_ERROR_VAR } from '../../node_modules/@angular/compiler/src/output/abstract_emitter';
import { Observable } from '../../node_modules/rxjs';
import { HttpHeaders } from '@angular/common/http';
import { catchError, retry, skip } from 'rxjs/operators';
import { Activity, Log } from './models/server_response.model';
import { Profile } from './models/server_response.model';

@Injectable({
  providedIn: 'root'
})


export class FilemakerdbService {

  /**
   * Contructor
   * 
   * @param HttpClient Object http 
   */
  constructor( private http: HttpClient) { }


  /**
   * Fetches all the users details
   */
  getUsers(paginator, filterKey, filterField, sort, order): Observable<Profile[]>{

   var skipRecords = paginator.pageIndex * paginator.pageSize;
   var limit = paginator.pageSize;

   return this.http.get<Profile[]>('http://localhost:8080/Project/timesheet/public/index.php/api/users?search='+filterKey+'&field='+filterField+'&skip='+skipRecords+'&limit='+limit+'&sort='+sort+'&order='+order);
  
  }

  /**
   * Fetches a single user details
   * @param interger userId 
   */
  getUser(userId){

   return this.http.get('http://localhost:8080/Project/timesheet/public/index.php/api/users/'+userId);
  }

  /**
   * Fetches all the users details
   */
  getUsersFiltered( filterKey, paginator ): Observable<Profile[]>{

    var skipRecords = paginator.pageIndex * paginator.pageSize;
    var limit = paginator.pageSize;

    return this.http.get<Profile[]>('http://localhost:8080/Project/timesheet/public/index.php/api/users?search='+filterKey+'&field=all&skip='+skipRecords+'&limit='+limit);
     
  }

  /**
   * Fetches all the users details
   */
  getUsersColumnFiltered( filterKey, filterField ): Observable<Profile[]>{

    return this.http.get<Profile[]>('http://localhost:8080/Project/timesheet/public/index.php/api/users?search='+filterKey+'&field='+filterField );
    
  }

  /**
   * Authenticate Login credentials
   * 
   * @param string email 
   * @param string password 
   */
  authenticateLogin(email , password): Observable<{}>{

     let loginData = new HttpParams();
     loginData = loginData.set('email', email);
     loginData = loginData.set('password', password);
   
    return this.http.post(
    'http://localhost:8080/Project/timesheet/public/index.php/api/users/login',
    loginData
    ); 
    
  }

  /**
   * Adds a new record in the table
   * 
   * @param firstName 
   * @param lastName 
   * @param email 
   * @param mobile 
   * @param address 
   * @param password 
   * @param designation
   */
  addRecord( firstName, lastName, email, mobile, address, password, designation): Observable<{}>{
    
    let newRecordData = new HttpParams();
    
    newRecordData = newRecordData.set('FirstName', firstName);
    newRecordData = newRecordData.set('LastName', lastName);
    newRecordData = newRecordData.set('_ka_Mobile', mobile);
    newRecordData = newRecordData.set('_ka_Email', email);
    newRecordData = newRecordData.set('Designation', designation);
    newRecordData = newRecordData.set('Address', address);
    newRecordData = newRecordData.set('Password', password);
  
    return this.http.post(
      'http://localhost:8080/Project/timesheet/public/index.php/api/users',
  
      newRecordData
      ); 

  }


  /**
   * Fetches all the users details
   */
  getAllActivity( userId, paginator, filterKey, filterField, sort, order ): Observable<Activity[]>{

    var skipRecords = paginator.pageIndex * paginator.pageSize;
    var limit = paginator.pageSize;

    return this.http.get<Activity[]>('http://localhost:8080/Project/timesheet/public/index.php/api/activities/'+userId+'?search='+filterKey+'&field='+filterField+'&skip='+skipRecords+'&limit='+limit+'&sort='+sort+'&order='+order);
     
   }

  /**
   * Fetches all the users details
   */
  filterActivity( userId, keyWord ): Observable<Activity[]>{

    return this.http.get<Activity[]>('http://localhost:8080/Project/timesheet/public/index.php/api/activities/'+userId+'/'+ keyWord);
     
  }

  /**
   * Add a new Activity to database
   */
  addActivity( userId, name, createdBy){

    let newRecordData = new HttpParams();
    
    newRecordData = newRecordData.set('__kf_UserID', userId);
    newRecordData = newRecordData.set('Name', name);
    newRecordData = newRecordData.set('CreatedBy', createdBy);

    console.log("Activity details, UserID: "+userId+" Description: "+name+" CreatedBy: "+createdBy);


    return this.http.post(
      'http://localhost:8080/Project/timesheet/public/index.php/api/activities',
  
      newRecordData
      ); 
  }

  deleteActivity( activityId ){
     
    return this.http.delete('http://localhost:8080/Project/timesheet/public/index.php/api/activities/'+activityId);
  }

  updateActivity(activityId, details){
   
    let newRecordData = new HttpParams();
    
    newRecordData = newRecordData.set('___kp_Id', activityId);
    newRecordData = newRecordData.set('Name', details);

    return this.http.put(
      'http://localhost:8080/Project/timesheet/public/index.php/api/activities',
  
      newRecordData
    );


  }

  /**
   * Fetches all logs of a particular activity
   */
  getActivityLogs( activityId, paginator, filterKey, filterField, sort, order ): Observable<Log[]>{

    var skipRecords = paginator.pageIndex * paginator.pageSize;
    var limit = paginator.pageSize;

    return this.http.get<Log[]>('http://localhost:8080/Project/timesheet/public/index.php/api/logs/'+activityId+'?search='+filterKey+'&field='+filterField+'&skip='+skipRecords+'&limit='+limit+'&sort='+sort+'&order='+order);
     
   }

  /**
   * Add a new Activity to database
   */
  addActivityLog( activityId, note){

    let newRecordData = new HttpParams();
    
    newRecordData = newRecordData.set('__kf_ActivityId', activityId);
    newRecordData = newRecordData.set('Note', note);

    console.log("Activity Log details, ActivityID: "+activityId+" Note: "+note);


    return this.http.post(
      'http://localhost:8080/Project/timesheet/public/index.php/api/logs',
  
      newRecordData
      ); 
  }
}