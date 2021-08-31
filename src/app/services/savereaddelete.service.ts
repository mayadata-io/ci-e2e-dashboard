import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { personDetail, deletePerson, personDetails, getResponse, postResponse, yaml } from "../model/data.model";

@Injectable()
export class PersonService {
  private saveDetails: personDetail[] = [];
  private deletePersonDetails: deletePerson[] = [];
  private personDetails: personDetails[] = [];
  private yamls: yaml;
  private apiUrl: string;
  private rnumber = Math.floor(Math.random() * 10000000);

  constructor(private http: HttpClient) {
    this.apiUrl = localStorage.getItem('apiUrlKey')
  }


  save100PersonDetails(allDetails: any, route: string) {
    const saveDetails: personDetail = allDetails;
    return this.http.post<postResponse>(
      this.apiUrl + "person/"+route+"/save",
      saveDetails
    );
  }

  get100personDetails(num: number, route: string) {
    return this.http.get<getResponse>(this.apiUrl + "person/"+route+"/read/" + num);
  }
  savePersonDetails(name: string, email: string, age: number) {
    const saveDetails: personDetail = {
      rNumber: this.rnumber,
      name: name,
      email: email,
      age: age
    };
    this.http
      .post(this.apiUrl + "person/save", saveDetails)
      .subscribe(responseData => {
        this.saveDetails.push(saveDetails);
      });
  }
  deletePerson(name: string) {
    const deletePersonDetails: deletePerson = {
      rNumber: this.rnumber,
      name: name
    };
    this.http
      .post<{ message: string }>(
        this.apiUrl + "person/delete",
        deletePersonDetails
      )
      .subscribe(responseData => {
        this.deletePersonDetails.push(deletePersonDetails);
      });
  }
  getPersonDetails() {
    return this.http.get<{ message: string; posts: personDetails[] }>(
      this.apiUrl + "person/read/" + this.rnumber
    );
  }
  getYamls(route: string) {
    return this.http.get<yaml>(this.apiUrl + "workloads/yaml/" + route)
  }
}
