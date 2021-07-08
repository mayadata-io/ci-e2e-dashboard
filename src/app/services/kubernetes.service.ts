import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";
import { overAllStatus, allApplication, mayaPvc } from "../model/data.model";
import {  mergeMap } from "rxjs/operators";

@Injectable()
export class KubernetsService {

    private apiUrl: string;
    private host: string;
    private collectionOfApplication: any;
    constructor(private http: HttpClient) {
        this.apiUrl = localStorage.getItem('apiUrlKey')
    }

    setApiUrl(apiUrl: string) {
        this.apiUrl = apiUrl;
    }
    getApiUrl() {
        return this.apiUrl;
    }
    getVolumeDetails(workloadName: string, openebsEngine: string, pvcDetails: mayaPvc) {
        return this.http.get(this.apiUrl + "openebs/volume", {
            params: {
                workloadname: workloadName,
                openebsengine: openebsEngine,
                pvcDetails: JSON.stringify(pvcDetails)
            }
        });
    }
    getPodDetails(appNamespace: string, volumeNamespace: string) {
        return this.http.get<overAllStatus>(this.apiUrl + "pods/sequence", {
            params: {
                appnamespace: appNamespace,
                volumenamespace: volumeNamespace
            }
        });
    }

    getAllApplication() {
        this.collectionOfApplication = []
        this.host = window.location.host;
        let url = '';
        if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
            url = "http://localhost:4000/workloads";
        } else {
            url = 'https://' + this.host + '/workloads/workloads'
        }
        return this.http.get(url).pipe(mergeMap((clusterDomain: any[]) => {
            clusterDomain.forEach(element => {
                this.collectionOfApplication.push(this.http.get<allApplication[]>(element + "pod/statuses"));
            })
            return forkJoin(this.collectionOfApplication);
        }));
    }
}
