import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import {Observable} from "rxjs/Observable";
import { forkJoin } from "rxjs/observable/forkJoin";
import 'rxjs/add/operator/map'

import { overAllStatus, listNamespace, status,allApplication } from "../model/data.model";

@Injectable()
export class KubernetsService {

   private apiurl: string;
   private host: string;
   private clusterDomain:any;
   private requestservice :any;
   constructor(private http: HttpClient) {

       this.host = window.location.host;
       if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
        this.http.get("http://localhost:4000/workloads/").subscribe(res => {
            this.clusterDomain =res;
        });
       } else {
        this.http.get('https://'+ this.host+'/workloads/workloads/').subscribe(res => {
            this.clusterDomain =res;
        });
       } 
       this.apiurl = localStorage.getItem('apiurlkey')
   }
  
   setApiUrl(apiUrl: string){
       this.apiurl = apiUrl;
   }
   getApiUrl(){
       return this.apiurl;
   }
   getVolumeDetails(workloadname:string,openebsengine:string) {
       return this.http.get(this.apiurl + "openebs/volume",{
           params:{
               workloadname:workloadname,
               openebsengine:openebsengine
           }
       });
   }

   getPodDetails(appnamespace: string, volumenamespace: string) {
       return this.http.get<overAllStatus>(this.apiurl + "pods/sequence", {
           params: {
               appnamespace: appnamespace,
               volumenamespace: volumenamespace
           }
       });
   }

   getAllstatus(namespaces: string) {
       return this.http.get<status>(this.apiurl + "pod/status", {
           params: {
               namespace: namespaces,
           }
       })
   }
   getOpenebsVersion() {
       return this.http.get<listNamespace>(this.apiurl + "pod/openebsversion");
   }

   getAllApplication(){
       this.requestservice  = []
       this.clusterDomain.forEach(element => {
           this.requestservice.push(this.http.get<allApplication[]>(element+ "pod/statuses").map(res => res));     
       });
       return forkJoin(this.requestservice);
   }

}
