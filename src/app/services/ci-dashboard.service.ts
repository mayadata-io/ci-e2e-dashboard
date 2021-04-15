import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Meta, Title } from '@angular/platform-browser';

@Injectable()
export class DashboardData {

    private apiurl: string;
    host: any;
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
    getAPIData(platform , branch){
       var data = this.http.get<any[]>(this.apiurl + `/${platform}/${branch}`);
    //    return this.http.get<any[]>( `https://openebs.ci/api/openshift/release`);
              return data;
       

    }
    gitLabStatus(){
        // console.log(" \n gitlab api status \n");
        
        let data= this.http.get<any[]>(this.apiurl + `/status`);
        // console.log(data);
        return data
        
    }
}
