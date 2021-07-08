import { Component, OnInit, OnDestroy } from "@angular/core";
import { KubernetsService } from "../services/kubernetes.service";
import * as $ from "jquery";
import { timer } from "rxjs";
import { Meta, Title } from "@angular/platform-browser";
import { allApplication } from "../model/data.model";
import { concatMap } from 'rxjs/operators';
import { SubscriptionLike } from "rxjs";
@Component({
  selector: "app-workload-dashboard",
  templateUrl: "./workload-dashboard.component.html",
  styleUrls: ["./workload-dashboard.component.scss"]
})

export class WorkloadDashboardComponent implements OnInit, OnDestroy {

  public openEBSVersion: any;
  public allApplications: allApplication[];
  private timerSub: SubscriptionLike;
  public showSpinner: boolean = true;
  constructor(private kubernetsServices: KubernetsService, private meta: Meta, private titleService: Title) {
    this.titleService.setTitle("workloads dashboard");
    this.meta.updateTag({
      name: "description",
      content: "Live Deployments of all the application "
    });

  }

  ngOnInit() {
    this.timerSub = timer(0, 3000)
      .pipe(concatMap(() => this.kubernetsServices.getAllApplication()))
      .subscribe(res => {
        const arrayOfApplication = [].concat(...res)
        if (arrayOfApplication == []) {
          this.showSpinner = true;
        } else {
          try {
            this.allApplications = arrayOfApplication.filter(app => app.podStatus.length !== 0);
            this.setApiUrl(this.allApplications[0].apiurl)
            this.getOpenEBSVersion(this.allApplications[0].namespace);
            this.showSpinner = false;
          } catch (error) {
            console.log('error' , error);
          }
        }
      });
    $(document).ready(function () {
      $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#workloadAppTable tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
    });
  }
  getOpenEBSVersion(namespace: string){
    try {
      this.kubernetsServices.getPodDetails(namespace , namespace).subscribe(res =>{
        this.openEBSVersion = res.jivaController[0].openebsVersion
      })
    } catch (err) {
      console.log('issue in fetching openebs version' ,err);
    }
  }

  setApiUrl(apiUrl: string) {
    localStorage.setItem('apiUrlKey', apiUrl);
    this.kubernetsServices.setApiUrl(localStorage.getItem('apiUrlKey'));
  }

  ngOnDestroy() {
    this.timerSub.unsubscribe();
  }
}
