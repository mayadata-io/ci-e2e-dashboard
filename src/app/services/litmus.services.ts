import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { litmusstatus,litmuslog,jobname } from "../model/data.model";

@Injectable()
export class LitmusService {
  private apiurl: string;
  private host: string;
  constructor(private http: HttpClient) {
    this.host = window.location.host;
    if (
      this.host.toString().indexOf("localhost") + 1 &&
      this.host.toString().indexOf(":")
    ) {
      this.apiurl = "http://localhost:3000/";
    } else {
      this.apiurl = "http://workloads.openebs.ci/";
    }
  }

  runChaosTestService(type: string, volumename: string, appnamespace: string, targetnamespace: string, appname: string) {
    return this.http.get( this.apiurl + 
       "litmus?app=" + appname + 
       "&type=" + type +
       "&appnamespace=" + appnamespace +
       "&targetnamespace=" + targetnamespace +
       "&volumename=" + volumename
    );
  }
  getLitmusStatus1(appnamespace: string) {
    return this.http.get<litmusstatus>(this.apiurl + "litmus/litmusstatus", {
      params: {
        appnamespace: appnamespace
      }
    });
  }
  getLitmusStatus(appnamespace: string,jobname: string) {
    console.log(jobname);
    return this.http.get<litmuslog>(this.apiurl + "litmus/litstatus", {
      params: {
        appnamespace: appnamespace,
        jobname:jobname
      }
    });
  }
  getJobName( nameSpace: string){
    return this.http.get<jobname>(this.apiurl + "litmus/getjob", {
      params: {
        nameSpace: nameSpace
      }
    })
  }

}
