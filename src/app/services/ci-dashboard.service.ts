import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Meta,Title } from '@angular/platform-browser';

@Injectable()
export class DashboardData {

    private apiurl: string;
    constructor(private http: HttpClient, private meta:Meta,private titleService: Title) {
        this.apiurl = "https://openebs.ci/api";
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
