import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { litmusstatus,litmuslog,jobname } from "../model/data.model";

@Injectable()
export class LitmusService {
  private apiUrl: string;
  
  constructor(private http: HttpClient) {
    this.apiUrl = localStorage.getItem('apiUrlKey')
  }

  runChaosTestService(type: string, volumename: string, appnamespace: string, targetnamespace: string, appname: string) {
    return this.http.get( this.apiUrl +
       "litmus?app=" + appname + 
       "&type=" + type +
       "&appnamespace=" + appnamespace +
       "&targetnamespace=" + targetnamespace +
       "&volumename=" + volumename
    );
  }
  getLitmusStatus1(appnamespace: string) {
    return this.http.get<litmusstatus>(this.apiUrl + "litmus/litmusstatus", {
      params: {
        appnamespace: appnamespace
      }
    });
  }
  getLitmusStatus(appnamespace: string,jobname: string) {
    console.log(jobname);
    return this.http.get<litmuslog>(this.apiUrl + "litmus/litstatus", {
      params: {
        appnamespace: appnamespace,
        jobname:jobname
      }
    });
  }
  getJobName( nameSpace: string){
    return this.http.get<jobname>(this.apiUrl + "litmus/getjob", {
      params: {
        nameSpace: nameSpace
      }
    })
  }

}
