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

  constructor(private router: Router, private DashboardDatas: DashboardData, private meta: Meta, private titleService: Title, public translateService: TranslateService) {
    this.meta.addTag({ name: 'description', content: 'Openebs.ci is the CI and E2E portal for OpenEBS github PRs. Using this portal, OpenEBS community uses this portal to find the build quality against each PR that is merged. It also hosts stateful application workloads with various deployment scenarios. The example workloads include MongoDB, Percona, WordPress, Prometheus, Redis, CockroachDB etc.' });
    this.meta.addTag({ name: 'keywords', content: 'Openebs,EBS,workload,mongo,jiva,cstor' });
    this.titleService.setTitle("CI/E2E dashboard for OpenEBS");
  }


  private getData: ISubscription;
  public openshiftRelease: any;
  pageLoaded: boolean = false;
  selectedPipeline: any;
  activePipeline: object;
  doNut: boolean = false;

  ngOnInit() {
    this.getData = timer(0, 15000000).subscribe(x => {
      this.DashboardDatas.getOpenshiftReleaseDetails().subscribe(res => {
        this.openshiftRelease = res;
        if (this.openshiftRelease) {
          this.pageLoaded = true;
        }
        this.getJobDetails(this.openshiftRelease.dashboard[0]);
        console.log('activePipeline', this.activePipeline);
      });
    })
  }
  getJobDetails(pipeline) {
    this.activePipeline = {
      id : pipeline.id,
      status : pipeline.status,
      webURL : pipeline.web_url,
      version : pipeline.release_tag
    }
    console.log(pipeline);
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
    this.selectedPipeline =  obj;
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
        return "fas fa-circle-notch text-secondary mx-2 font-size-18";
      default:
        return "far fa-dot-circle text-warning mx-2 font-size-18";
    }

  }

  getJobPercentForPipeline(data){
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
