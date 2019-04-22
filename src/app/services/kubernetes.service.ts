import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { forkJoin } from "rxjs/observable/forkJoin";
import 'rxjs/add/operator/map'
import { overAllStatus, listNamespace, status, allApplication, mayapvc } from "../model/data.model";
import { concatMap, mergeMap } from "rxjs/operators";

@Injectable()
export class KubernetsService {

    private apiurl: string;
    private host: string;
    private requestservice: any;
    constructor(private http: HttpClient) {
        this.apiurl = localStorage.getItem('apiurlkey')
    }

    setApiUrl(apiUrl: string) {
        this.apiurl = apiUrl;
    }
    getApiUrl() {
        return this.apiurl;
    }
    getVolumeDetails(workloadname: string, openebsengine: string, pvcDetails: mayapvc) {
        return this.http.get(this.apiurl + "openebs/volume", {
            params: {
                workloadname: workloadname,
                openebsengine: openebsengine,
                pvcDetails: JSON.stringify(pvcDetails)
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

    getAllApplication() {
        this.requestservice = []
        this.host = window.location.host;
        let url = '';
        if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
            url = "http://localhost:4000/workloads";
        } else {
            url = 'https://' + this.host + '/workloads/workloads'
        }
        return this.http.get(url).pipe(mergeMap((clusterDomain: any[]) => {
            clusterDomain.forEach(element => {
                this.requestservice.push(this.http.get<allApplication[]>(element + "pod/statuses").map(res => res));
            })
            return forkJoin(this.requestservice);
        }));
    }
}
