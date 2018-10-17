import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { litmusstatus } from "../model/data.model";

@Injectable()
export class LitmusService {
  private apiurl: string;
  private host: string;
  constructor(private http: HttpClient) {
    this.host = window.location.host;
    if (
      this.host.toString().indexOf("localhost") + 1 &&
      this.host.toString().indexOf(":")
    ) {
      this.apiurl = "http://localhost:3000/";
    } else {
      this.apiurl = "https://workloadsbackend.openebs.ci/api/";
    }
  }

  runChaosTestService(
    type: string,
    volumename: string,
    appnamespace: string,
    targetnamespace: string,
    appname: string
  ) {
    this.http
      .get(
        this.apiurl +
          "litmus?app=" +
          appname +
          "&type=" +
          type +
          "&appnamespace=" +
          appnamespace +
          "&targetnamespace=" +
          targetnamespace +
          "&volumename=" +
          volumename
      )
      .subscribe();
  }
  getLitmusStatus(appnamespace: string) {
    return this.http.get<litmusstatus>(this.apiurl + "litmus/litmusstatus", {
      params: {
        appnamespace: appnamespace
      }
    });
  }
}
