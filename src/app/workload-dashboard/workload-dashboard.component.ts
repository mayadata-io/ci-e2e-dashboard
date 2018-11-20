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
  public cockdbcstorStatus: any;
  public wordpressStatus: any;
  public redisjivaStatus: any;
  public rediscstorStatus: any;
  public postgresqljivaStatus: any;
  public elasticsearchcstorStatus:any;
  public postgresqlcstorStatus:any;

  constructor(private kubernetsServices: KubernetsService, private meta: Meta,private titleService: Title) {
    this.titleService.setTitle( "workloads dashboard" );
    this.meta.updateTag({
      name: "description",
      content: "Live Deployments of all the application "
    });
  }

  ngOnInit() {
    timer(0, 5000).subscribe(x => {

   
      this.kubernetsServices.getAllstatus("percona-jiva").subscribe(res => {
        this.perconaStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("percona-cstor").subscribe(res => {
        this.perconacstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("prometheus-cstor").subscribe(res => {
        this.prometheuscstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("prometheus-jiva").subscribe(res => {
        this.prometheusStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("mongo-cstor").subscribe(res => {
        this.mongocstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("mongo-jiva").subscribe(res => {
        this.mongoStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("wordpress-nfs").subscribe(res => {
        this.wordpressStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("cockroachdb-jiva").subscribe(res => {
        this.cockdbjiva = res.status;
      });
      this.kubernetsServices.getAllstatus("cockroachdb-cstor").subscribe(res => {
        this.cockdbcstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("redis-jiva").subscribe(res => {
        this.redisjivaStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("redis-cstor").subscribe(res => {
        this.rediscstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("postgresql-jiva").subscribe(res => {
        this.postgresqljivaStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("postgresql-cstor").subscribe(res => {
        this.postgresqlcstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("logging").subscribe(res => {
        this.elasticsearchcstorStatus = res.status;
      });
      this.kubernetsServices.getAllstatus("grafana-cstor").subscribe(res => {
        this.grafanaStatus = res.status;
      });
    });
  }
}
