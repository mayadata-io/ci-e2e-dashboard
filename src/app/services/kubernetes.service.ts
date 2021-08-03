import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";
import { overAllStatus, allApplication, mayaPvc } from "../model/data.model";
import { mergeMap } from "rxjs/operators";

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
        // there is a better way to define params  which will be implemented after due discussion
        // https://stackoverflow.com/questions/44280303/angular-http-get-with-parameter
        const params = {
            workloadname: workloadName,
            openebsengine: openebsEngine,
            pvcDetails: JSON.stringify(pvcDetails)
        }
        return this.http.get(`${this.apiUrl}openebs/volume`, { params });
    }
    getPodDetails(appNamespace: string, volumeNamespace: string) {
        const params = {
            appnamespace: appNamespace,
            volumenamespace: volumeNamespace
        }
        return this.http.get<overAllStatus>(this.apiUrl + "pods/sequence", { params });
    }

    getAllApplication() {
        this.collectionOfApplication = []
        this.host = window.location.host;
        const url = (this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":") ? "http://localhost:4000/workloads" : `https://${this.host}/workloads/workloads`;
        return this.http.get(url).pipe(mergeMap((clusterDomain: any[]) => {
            clusterDomain.forEach(element => {
                this.collectionOfApplication.push(this.http.get<allApplication[]>(element + "pod/statuses"));
            })
            return forkJoin(this.collectionOfApplication);
        }));
    }
}
