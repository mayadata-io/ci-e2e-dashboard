import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";

import { contactDetails } from "../model/data.model";

@Injectable()
export class AgileService {
  private contactAdd: contactDetails[] = [];
  private contactUpdated = new Observable<contactDetails[]>();
  private apiurl: string;
  host: string;
  constructor(private http: HttpClient) {
    this.host = window.location.host;
    if (this.host == "localhost:4200") {
      this.apiurl = "http://localhost:3000/";
    } else if (this.host == "staging.openebs.io") {
      this.apiurl = "https://staging.mayadata.io/api/";
    } else {
      this.apiurl = "https://openebs.io/api/";
    }
  }

  headerHeading(heading: string) {
    return heading;
  }
  saveFormdata(
    firstName: string,
    emailId: string,
    companyName: string,
    addtag: string
  ) {
    const contactAdd: contactDetails = {
      name: firstName,
      email: emailId,
      company: companyName,
      tag: addtag
    };
    this.http
      .post<{ message: string }>(this.apiurl + "openebs/formsubmit", contactAdd)
      .subscribe(responseData => {
        this.contactAdd.push(contactAdd);
      });
  }
}
