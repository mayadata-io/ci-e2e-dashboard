import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Meta, Title } from '@angular/platform-browser';


@Injectable()
export class DashboardData {

    private apiurl: string;
    host: any;
    log: any;
    constructor(private http: HttpClient, private meta: Meta, private titleService: Title) {
        this.host = window.location.host;
        if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
            this.apiurl = "http://localhost:3000";
        } else if (this.host == "openebs.ci" || this.host == "wwww.openebs.ci") {
            this.apiurl = "https://openebs.ci/api";
        } else {
            this.apiurl = "https://staging.openebs.ci/api";
        }
    }

    getEndPointData(platform) {
        switch (platform) {
            case "packet-ultimate":
                return this.http.get<any[]>(this.apiurl + "/packet/ultimate");
            case "packet-penultimate":
                return this.http.get<any[]>(this.apiurl + "/packet/penultimate");
            case "packet-antepenultimate":
                return this.http.get<any[]>(this.apiurl + "/packet/antepenultimate");
            case "konvoy":
                return this.http.get<any[]>(this.apiurl + "/konvoy");
            case "openshift":
                return this.http.get<any[]>(this.apiurl + "/openshift/release");
            case "nativek8s":
                return this.http.get<any[]>(this.apiurl + "/nativek8s");
            default:
                console.log('Unable To Find Platform');
                break;
        }
    }
    getAPIData(platform, branch) {
        var data = this.http.get<any[]>(this.apiurl + `/${platform}/${branch}`);
        return data;
    }
    gitLabStatus() {
        let data = this.http.get<any[]>(this.apiurl + `/status`);
        return data
    }
    getPipelineData(platform: string, branch: string, id: string) {
        let data = this.http.get<any[]>(this.apiurl + `/${platform}/${branch}/pipeline/${id}`);
        return data
    }
    getJobLogs(platform: string, branch: string, id: string) {
        // var log: any
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        // await this.http.get<string>(`${this.apiurl}/${platform}/${branch}/job/${id}/raw`, { headers, responseType: 'text' as 'json' }).subscribe(res => {
        //     console.log("----Data----", res);
        //     log = res
        // })
        const promise = this.http.get(`${this.apiurl}/${platform}/${branch}/job/${id}/raw`, { headers, responseType: 'text' as 'json' }).toPromise();
        // console.log(promise);
        promise.then((data) => {
            this.log = JSON.stringify(data)
            // console.log("----> Data <------",data);
            return this.log
        }).catch((error) => {
            console.log("Promise rejected with " + JSON.stringify(error));
        });
        return this.log
    }

    getAnyEndpointData(endpoint:string){
        var data = this.http.get<any[]>(this.apiurl + `${endpoint}`);
        return data;
    }
}
