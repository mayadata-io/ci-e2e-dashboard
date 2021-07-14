import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { contactDetails } from "../model/data.model";

@Injectable()
export class AgileService {
 private contactAdd: contactDetails[] = [];
 private contactUpdated = new Observable<contactDetails[]>();
 private agileApiUrl: string;
 host: string;
 constructor(private http: HttpClient) {
   this.host = window.location.host;
   if (this.host == "localhost:4200") {
     this.agileApiUrl = "http://localhost:3000/";
   } else if (this.host == "staging.openebs.ci") {
     this.agileApiUrl = "https://staging.mayadata.io/api/";
   } else {
     this.agileApiUrl = "https://openebs.com/api/";
   }
 }

 headerHeading(heading: string) {
   return heading;
 }
 saveFormdata( firstName: string, emailId: string, companyName: string, addTag: string) {
   const contactAdd: contactDetails = {
     name: firstName,
     email: emailId,
     company: companyName,
     tag: addTag
   };
   this.http
     .post<{ message: string }>(this.agileApiUrl + "openebs/formsubmit", contactAdd)
     .subscribe(responseData => {
       this.contactAdd.push(contactAdd);
     });
 }
}
