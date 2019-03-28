import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { overAllStatus, listNamespace, status, allApplication } from "../model/data.model";

@Injectable()
export class KubernetsService {
    private apiurl: string;
    private host: string;
    private gitLabApiUrl: string = '';
    constructor(private http: HttpClient) {
        this.host = window.location.host;
        if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
            this.apiurl = "http://localhost:3000/";
        } else if (this.host.toString().indexOf("workload-dashboard") == 0) {
            this.apiurl = `/workloads/`;
            this.gitLabApiUrl = '';
        } else {
            this.apiurl = `https://workloads.openebs.ci/`;
            this.gitLabApiUrl = 'https://workload-gitlab.openebs.ci/';
        }
    }

    setApiUrl(apiUrl: string) {
        this.apiurl = apiUrl;
    }
    getApiUrl() {
        return this.apiurl;
    }
    getJivaVolumeDetails(workloadname: string, openebsengine: string) {
        console.log(this.apiurl);
        return this.http.get(this.apiurl + "openebs/volume", {
            params: {
                workloadname: workloadname,
                openebsengine: openebsengine
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
    getListNamespaces() {
        return this.http.get<listNamespace>(this.apiurl + "pod/applications")
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

    getAllApplication() {
        return this.http.get<allApplication>(this.apiurl + "pod/statuses")
    }
    getGitLabApplication() {
        return this.http.get<allApplication>(this.gitLabApiUrl + "pod/statuses")
    }
}
