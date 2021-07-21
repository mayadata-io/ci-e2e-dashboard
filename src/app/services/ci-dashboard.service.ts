import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConstants } from '../common/check';


@Injectable()
export class DashboardData {

    log: any;
    constructor(private http: HttpClient) { }
    getAPIData(platform, branch) {
        const data = this.http.get<any[]>(GlobalConstants.apiURL() + `/${platform}/${branch}`);
        return data;
    }
    gitLabStatus() {
        const data = this.http.get<any[]>(GlobalConstants.apiURL() + `/status`);
        return data;
    }
    getPipelineData(platform: string, branch: string, id: string) {
        const data = this.http.get<any[]>(GlobalConstants.apiURL() + `/${platform}/${branch}/pipeline/${id}`);
        return data;
    }
    getJobLogs(platform: string, branch: string, id: string) {
        // var log: any
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        // await this.http.get<string>(`${GlobalConstants.apiURL()}/${platform}/${branch}/job/${id}/raw`, { headers, responseType: 'text' as 'json' }).subscribe(res => {
        //     console.log("----Data----", res);
        //     log = res
        // })
        const promise = this.http.get(`${GlobalConstants.apiURL()}/${platform}/${branch}/job/${id}/raw`, { headers, responseType: 'text' as 'json' }).toPromise();
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

    getAnyEndpointData(endpoint: string) {
        var data = this.http.get<any[]>(GlobalConstants.apiURL() + `${endpoint}`);
        return data;
    }
}
