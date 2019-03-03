import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { overAllStatus, listNamespace, status } from "../model/data.model";

@Injectable()
export class KubernetsService {

    private apiurl: string;
    private host: string;
    constructor(private http: HttpClient) {
        this.host = window.location.host;
        if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
            this.apiurl = "http://localhost:3000/";
        } else {
            this.apiurl = "https://workloads.openebs.ci/";
        }
    }

    getJivaVolumeDetails(workloadname:string,openebsengine:string) {
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
}
