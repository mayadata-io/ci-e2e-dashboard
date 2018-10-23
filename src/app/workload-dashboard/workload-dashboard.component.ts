import { Component, OnInit } from "@angular/core";
import { KubernetsService } from "../services/kubernetes.service";
import * as $ from "jquery";
import { Subscription, Observable, timer } from "rxjs";
import { Meta,Title } from "@angular/platform-browser";

@Component({
  selector: "app-workload-dashboard",
  templateUrl: "./workload-dashboard.component.html",
  styleUrls: ["./workload-dashboard.component.scss"]
})
export class WorkloadDashboardComponent implements OnInit {
  public grafanaStatus: any;
  public mongoStatus: any;
  public perconaStatus: any;
  public mongocstorStatus: any;
  public perconacstorStatus: any;
  public prometheusStatus: any;
  public prometheuscstorStatus: any;
  public cockdbjiva: any;
  public wordpressStatus: any;

  constructor(private kubernetsServices: KubernetsService, private meta: Meta,private titleService: Title) {
    this.titleService.setTitle( "workloads dashboard" );
    this.meta.updateTag({
      name: "description",
      content: "Live Deployments of all the application "
    });
  }

  ngOnInit() {
    timer(0, 5000).subscribe(x => {
      this.kubernetsServices.getAllstatus("grafana-cstor").subscribe(res => {
        this.grafanaStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("percona-cstor").subscribe(res => {
        this.perconacstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("prometheus-cstor").subscribe(res => {
        this.prometheuscstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("mongo-cstor").subscribe(res => {
        this.mongocstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("mongo-jiva").subscribe(res => {
        this.mongoStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("percona-jiva").subscribe(res => {
        this.perconacstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("prometheus-jiva").subscribe(res => {
        this.prometheusStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("wordpress-nfs").subscribe(res => {
        this.wordpressStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("cockroachdb-jiva").subscribe(res => {
        this.cockdbjiva = res.status;
      });
    });
  }
}
