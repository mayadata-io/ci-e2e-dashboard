import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Meta,Title } from '@angular/platform-browser';

@Injectable()
export class DashboardData {

    private apiurl: string;
    host: any;
    constructor(private http: HttpClient, private meta:Meta,private titleService: Title) {
        this.host = window.location.host;
        if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
          this.apiurl = "http://localhost:3000";
        } else if (this.host == "openebs.ci" || this.host == "wwww.openebs.ci" ) {
            this.apiurl = "https://openebs.ci/api";
        } else {
          this.apiurl = "https://staging.openebs.ci/api";
        }
    }

    getPacketv11Details() {
        return this.http.get<any[]>(this.apiurl + "/packet/v11");
    }

    getPacketv12Details() {
        return this.http.get<any[]>(this.apiurl + "/packet/v12");
    }

    getPacketv13Details() {
        return this.http.get<any[]>(this.apiurl + "/packet/v13");
    }
    getBuildDetails() {
        return this.http.get<any[]>(this.apiurl + "/build");
    }
}
