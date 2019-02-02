import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Meta,Title } from '@angular/platform-browser';

@Injectable()
export class DashboardData {

    private apiurl: string;
    constructor(private http: HttpClient, private meta:Meta,private titleService: Title) {
        this.apiurl = "http://localhost:3000";
    }

    async getAwsDetails() {
        return await this.http.get<any[]>(this.apiurl + "/aws").toPromise();
    }

    getEksDetails() {
        return this.http.get<any[]>(this.apiurl + "/eks");
    }

    getAksDetails() {
        return this.http.get<any[]>(this.apiurl + "/aks");
    }

    getGkeDetails() {
        return this.http.get<any[]>(this.apiurl + "/gke");
    }

    getGcpDetails() {
        return this.http.get<any[]>(this.apiurl + "/gcp");
    }

    getPacketDetails() {
        return this.http.get<any[]>(this.apiurl + "/packet");
    }

    getBuildDetails() {
        return this.http.get<any[]>(this.apiurl + "/build");
    }
}
