import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { litmusstatus,litmuslog,jobName } from "../model/data.model";

@Injectable()
export class LitmusService {
  private apiUrl: string;
  
  constructor(private http: HttpClient) {
    this.apiUrl = localStorage.getItem('apiUrlKey')
  }

  runChaosTestService(type: string, volumeName: string, appNamespace: string, targetNamespace: string, appName: string) {
    return this.http.get( this.apiUrl +
       "litmus?app=" + appName +
       "&type=" + type +
       "&appnamespace=" + appNamespace +
       "&targetnamespace=" + targetNamespace +
       "&volumename=" + volumeName
    );
  }
  getLitmusStatus1(appNamespace: string) {
    return this.http.get<litmusstatus>(this.apiUrl + "litmus/litmusstatus", {
      params: {
        appnamespace: appNamespace
      }
    });
  }
  getLitmusStatus(appNamespace: string,jobName: string) {
    console.log(jobName);
    return this.http.get<litmuslog>(this.apiUrl + "litmus/litstatus", {
      params: {
        appnamespace: appNamespace,
        jobname:jobName
      }
    });
  }
  getJobName( namespace: string){
    return this.http.get<jobName>(this.apiUrl + "litmus/getjob", {
      params: {
        nameSpace: namespace
      }
    })
  }

}
