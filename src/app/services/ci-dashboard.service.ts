import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        const promise = this.http.get(`${GlobalConstants.apiURL()}/${platform}/${branch}/job/${id}/raw`, { headers, responseType: 'text' as 'json' }).toPromise();
        promise.then((data) => {
            this.log = JSON.stringify(data)
            return this.log
        }).catch((error) => {
            console.log('Promise rejected with ' + JSON.stringify(error));
        });
        return this.log;
    }

    getAnyEndpointData(endpoint: string) {
        const data = this.http.get<any[]>(GlobalConstants.apiURL() + `${endpoint}`);
        return data;
    }
    getMayastorTest() {
        const data = this.http.get<any[]>('https://staging.openebs.ci/xray/mayastor'); // hardcoded with staging URL
        return data;

    }
}
