import { Component, OnInit } from "@angular/core";
import { KubernetsService } from "../services/kubernetes.service";
import * as $ from "jquery";
import { Subscription, Observable, timer } from "rxjs";
import { Meta,Title } from "@angular/platform-browser";
import {
  allApplication
} from "../model/data.model";
@Component({
  selector: "app-workload-dashboard",
  templateUrl: "./workload-dashboard.component.html",
  styleUrls: ["./workload-dashboard.component.scss"]
})


export class WorkloadDashboardComponent implements OnInit {
  public grafanaStatus: any;
  public mongocstorStatus: any;
  public perconacstorStatus: any;
  public prometheuscstorStatus: any;
  public cockdbcstorStatus: any;
  public wordpressStatus: any;
  public rediscstorStatus: any;
  public elasticsearchcstorStatus:any;
  public postgresqlcstorStatus:any;
  public nuodbcstorStatus:any;
  public miniocstorStatus:any;
  public jivastatuscount = 0;
  public cStorstatuscount =0; 
  public viewType:number = 0;  // 0: grid view 1:table view
  public openebsVersion : any ;
  public allApplications: allApplication;
  public gitlabApplication : allApplication;

  constructor(private kubernetsServices: KubernetsService, private meta: Meta,private titleService: Title) {
    this.titleService.setTitle( "workloads dashboard" );
    this.meta.updateTag({
      name: "description",
      content: "Live Deployments of all the application "
    });
  }

  ngOnInit() {

    timer(0, 500000).subscribe(x => {
      this.kubernetsServices.getOpenebsVersion().subscribe( res => {
        this.openebsVersion = res ;
      });
  
      this.kubernetsServices.getAllApplication().subscribe(res =>{
        this.allApplications=res;
      })
      this.kubernetsServices.getGitLabApplication().subscribe(res =>{
        this.gitlabApplication=res;
      })
    });


    $(document).ready(function(){
      $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
    });
  }
}
