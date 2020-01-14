import { Component, OnInit, Pipe } from '@angular/core';
import { Subscription, Observable, timer, from, pipe } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import Chart from 'chart.js'
import * as moment from 'moment';
import * as dateformat from 'dateformat';
import * as $ from 'jquery';
import { DashboardData } from "../services/ci-dashboard.service";
import { Meta, Title } from '@angular/platform-browser';
import { Router } from "@angular/router";
import { TranslateService } from 'angular-intl';
@Component({
  selector: 'app-stable-release',
  templateUrl: './stable-release.component.html',
  styleUrls: ['./stable-release.component.scss']
})
export class StableReleaseComponent implements OnInit {

  constructor(private DashboardDatas: DashboardData, private meta: Meta, private titleService: Title) {
    this.meta.addTag({ name: 'description', content: 'Openebs.ci is the CI and E2E portal for OpenEBS github PRs. Using this portal, OpenEBS community uses this portal to find the build quality against each PR that is merged. It also hosts stateful application workloads with various deployment scenarios. The example workloads include MongoDB, Percona, WordPress, Prometheus, Redis, CockroachDB etc.' });
    this.meta.addTag({ name: 'keywords', content: 'Openebs,EBS,workload,mongo,jiva,cstor' });
    this.titleService.setTitle("CI/E2E dashboard for OpenEBS");
  }

  private getData: ISubscription;
  private selectCell: ISubscription;
  public openshiftRelease: any;
  pageLoaded: boolean = false;
  selectedPipeline: any;
  activePipeline: object;
  doNut: boolean = false;
  public status: any = 1;
  index: boolean = true;
  public initialCount: any = 0;
  detailPannelReady: boolean = false;

  ngOnInit() {
    localStorage.removeItem('rowop');
    //Highlight the row
    $('#data').on('click', 'tbody tr', function (e) {
      $(this).addClass('row_color').siblings().removeClass('row_color');
      // Store selected row in localStorage
      var selectedRow = $(this).index();
      localStorage.setItem('rowop', selectedRow);
      // Highlight the cell
      $("#data span").removeClass("highlight");
      var clickedCell = $(e.target).closest("span");
      clickedCell.addClass("highlight");
    });

    this.getData = timer(0, 10000).subscribe(x => {
      this.DashboardDatas.getOpenshiftReleaseDetails().subscribe(res => {
        this.openshiftRelease = res;
        if (this.openshiftRelease) {
          this.pageLoaded = true;
          if (this.index){
              this.getJobDetails(this.openshiftRelease.dashboard[0], 0);
              this.index = false;
          }
        }
      });
    })
  }

  ngOnDestroy() {
    this.getData.unsubscribe();
  }

  rowCount() {
    var rowValue = localStorage.getItem('rowop');
    if (rowValue == null) {
      rowValue = (this.initialCount).toString();
    }
    return rowValue;
  }

  urlOpenNewTab(url) {
    window.open(url, "_blank");
  }
  // Updated returns commit id
  triggered(data) {
    try {
      var now = moment(dateformat((new Date()), "IST:yyyy-mm-dd'T'HH:MM:ss"), 'YYYY-M-DD,HH:mm:ss');
      var buildTime = moment(data.jobs[0].created_at, 'YYYY-M-DD,HH:mm:ss');
      var difference = moment.duration((now.diff(buildTime, 'second')), "second");
      var days = difference.days();
      var hours = difference.hours();
      var minutes = difference.hours();
      if (days != 0) {
        return days + "d " + hours + "h" + " ago";
      }
      return hours + "h " + minutes + "m" + " ago";
    } catch (e) {
      console.log("error",e);
      return "_";
    }
  }
  startedAt(data ){
    try {
      var date = data.jobs[0].started_at
      var dateFormat = moment.utc(date, 'YYYY-M-DD,HH:mm:ss').local().calendar();
      return dateFormat;
    } catch (error) {
      console.log("error",error);
      return "_";
    }
  }
  finishedAt(data ){
    try {
      if (data.status == 'success' || data.status == 'failed'){
      var date = data.jobs[data.jobs.length-1].finished_at
      var dateFormat = moment.utc(date, 'YYYY-M-DD,HH:mm:ss').local().calendar();
      return dateFormat;
      }else{
        // Capatilize ref : https://www.freecodecamp.org/forum/t/how-to-capitalize-the-first-letter-of-a-string-in-javascript/18405
        return data.status.charAt(0).toUpperCase()+data.status.slice(1);
      }
    } catch (error) {
      console.log("error",error);
      return "_";
    }
  }

  duration(data) {
    try {
      var startedAt = moment(data.jobs[0].started_at, 'YYYY-M-DD,HH:mm:ss');
      var finishedAt = moment(data.jobs[data.jobs.length-1].finished_at, 'YYYY-M-DD,HH:mm:ss');
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

  getJobDetails(pipeline, row) {
    this.initialCount = row;
    this.activePipeline = {
      id: pipeline.id,
      status: pipeline.status,
      webURL: pipeline.web_url,
      version: pipeline.release_tag,
      logURL: pipeline.kibana_url,
      jobs: pipeline.jobs.length,
      successJobs: this.passed(pipeline.jobs),
      failedJobs: this.failed(pipeline.jobs),
      triggered : this.triggered(pipeline),
      startedAt: this.startedAt(pipeline),
      finishedAt: this.finishedAt(pipeline),
      duration: this.duration(pipeline)
    }    
    var stages = [];
    var obj = [];
    pipeline.jobs.forEach(job => {
      if (!stages.includes(job.stage)) {
        stages.push(job.stage);
      }
    });
    stages.forEach(stage => {
      const stageObj = {
        stageName: stage,
        allJobs: pipeline.jobs.filter(job => job.stage == stage),
        status: this.stageStatusForObj(stage, pipeline.jobs),
        noOfSuccessJobs: pipeline.jobs.filter(job => job.stage == stage).filter(job => job.status == "success").length,
        noOfFailedJobs: pipeline.jobs.filter(job => job.stage == stage).filter(job => job.status == "failed").length
      };
      obj.push(stageObj);
    })
    this.selectedPipeline = obj;
    this.detailPannelReady = true;
  }


  stageStatusForObj(stage, jobs) {
    let stageJobs = jobs.filter(job => job.stage == stage);
    // console.log('forStageObj',stageJobs);
    let successJ = stageJobs.filter(j => j.status == "success").length
    let failedLength = stageJobs.filter(j => j.status == "failed").length
    let canceledLength = stageJobs.filter(j => j.status == "canceled").length
    let runningLength = stageJobs.filter(j => j.status == "running").length
    let skippedLength = stageJobs.filter(j => j.status == "skipped").length
    if (runningLength) {
      return "running"
    } else if (canceledLength) {
      return "canceled"
    } else if (skippedLength) {
      return "skipped"
    } else if (failedLength) {
      return "failed"
    } else {
      return 'success'
    }
  }

  statusIcon(status) {
    switch (status) {
      case "success":
        return "far fa-check-circle text-success mx-2 font-size-18";
      case "failed":
        return "far fa-times-circle text-danger mx-2 font-size-18";
      case "running":
        return "fas fa-circle-notch text-secondary mx-2 font-size-18 fa-spin";
      default:
        return "far fa-dot-circle text-warning mx-2 font-size-18";
    }
  }

  getJobPercentForPipeline(data) {
    try {
      if (data.status == "success") {
        return "95 5";
      }
      else if (data.status == "pending") {
        return "0 0";
      }
      else if (data.status == "failed" || data.status == "canceled") {
        var count = 0;
        for (var j = 0; j < data.jobs.length; j++) {
          if (data.jobs[j].status == "success") {
            count++;
          }
        }
        var percentage = (count / data.jobs.length) * 100;
        return `${percentage} ${100 - percentage}`
      }
      else if (data.status == "running") {
        return "95 5";
      }
    }
    catch {
      return "0 0";
    }
  }

  pipelineTooltip(data) {
    try {
      if (data.status == "running") {
        return "running"
      } else if (data.status == "none") {
        return ""
      } else {
        var passedJobs = this.passed(data.jobs)
        var failedJobs = this.failed(data.jobs)
        return "Passed: " + passedJobs + " Failed: " + failedJobs;
      }
    } catch (e) {
      return "n/a"
    }
  }

  passed(data) {
    var passed = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].status === ("success")) {
        passed = passed + 1;
      }
    }
    return passed;
  }

  failed(data) {
    var failed = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].status === ("failed")) {
        failed = failed + 1;
      }
    }
    return failed;
  }
}
