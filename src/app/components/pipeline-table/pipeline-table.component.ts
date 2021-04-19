import { Component, Input, OnInit } from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd, Params} from '@angular/router';
import { DashboardData } from "../../services/ci-dashboard.service";
import { ISubscription } from "rxjs/Subscription";
import { Subscription, Observable, timer, from, pipe } from "rxjs";

import * as moment from 'moment';
import * as dateformat from 'dateformat';

@Component({
  selector: 'app-pipeline-table',
  templateUrl: './pipeline-table.component.html',
  styleUrls: ['./pipeline-table.component.scss']
})
export class PipelineTableComponent implements OnInit {
  mySubscription: any;
  constructor(private router: Router ,private ApiService: DashboardData,private activatedRoute: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
   }
  public url: any;
  public pipData: any;
  private Data: ISubscription;
  public platform : string;
  error : any;
  ngOnInit() {
    this.url = window.location.pathname.split('/')
    let branch:string = this.url[2]
    this.platform = this.url[3]
    this.getPipeline(this.platform,branch)
    
  }

  getPipeline(platform:string,branch:string){
    let E = this.genbranch(branch)
    this.Data = timer(0, 10000).subscribe(x => {
      this.ApiService.getAPIData(platform,E).subscribe(res => {
      this.pipData = res
    },
    err => {this.error = err}
    )
  }) 
  }
  genbranch(branch){
    console.log("branch is ", branch);
    
    if (branch == 'cstor'){
      return 'openebs-cstor'
    } else if(branch == 'release-branch' || branch == "lvm-localpv"){
      return branch
    } else{
      return `openebs-${branch}`
    }
  }
  triggerDate(data){
    try {
      var date = data.jobs[0].started_at
      var dateFormat = moment.utc(date).local().calendar();
      return dateFormat
    } catch (error) {
      console.log("error", error);
      return "_";
    }
  }
  pipeDuration(data){
    try {
      var startedAt = moment(data.jobs[0].started_at, 'YYYY-M-DD,HH:mm:ss');
      var finishedAt = moment(data.jobs[data.jobs.length - 1].finished_at, 'YYYY-M-DD,HH:mm:ss');
      var difference = moment.duration((finishedAt.diff(startedAt, 'second')), "second");
      var days = difference.days();
      var hours = difference.hours();
      var minutes = difference.minutes();
      var seconds = difference.seconds();
      let status = data.status;
      if (status == 'success' || status == 'failed') {
        if (days != 0) {
          return days + "d :" + hours + "h :" + minutes + "m :" + seconds + "sec";
        } else if (hours != 0) {
          return hours + "h :" + minutes + "m :" + seconds + "sec";
        }
        return minutes + "m :" + seconds + "sec";
      } else if (status == 'canceled') { return 'Cancelled' }
      else if (status == 'running') { return 'Running' }
      return "_"
    } catch (e) {
      console.log('error' + e);
    }
  }
  statusIcon(status) {
    switch (status) {
      case "success":
        return "far fa-check-circle text-success mx-2 font-size-18";
      case "failed":
        return "far fa-times-circle text-danger mx-2 font-size-18";
      case "running":
        return "fas fa-circle-notch text-primary mx-2 font-size-18 fa-spin";
      case "skipped":
        return "fas fa-angle-double-right text-secondary mx-2 font-size-18";
      case "canceled":
        return "fas fa-ban text-muted mx-2 font-size-18";
      default:
        return "far fa-dot-circle text-warning mx-2 font-size-18";
    }
  }
  ngOnDestroy() {
    this.Data.unsubscribe();
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  

}
