/**
 * File Name: server_response.model.ts
 * Contains different architecture of server response
 * 
 * Created On: 03/09/2018
 * Author: Alokik Pathak 
 */

/**
 * Structure of Activities data
 */
export interface Activity{

  ___kp_Id:          string;
  __kf_UserID:       string;
  Name:              string;
  CreationTimestamp: string;
  CreatedBy:         string;
  ModificationTimestamp: string;
  ModifiedBy:          string;
}

/**
 * Structure of Profiles data
 */
export interface Profile{

  ___kp_UserID: string;
  FirstName: string;
  LastName: string;
  Name: string;
  _ka_Email: string;
  _ka_Mobile: string;
  Address: string;
  Designation: string;
}