import { Component, OnInit } from '@angular/core';
import { DashboardData } from "../../services/ci-dashboard.service";
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {


  platform: any;
  branch: any;
  constructor(private ApiService: DashboardData, private route: ActivatedRoute, private router: Router, private titleService: Title) { }

  ngOnInit() {
    let url = window.location.pathname.split('/')
    this.platform = url[3]
    this.branch = url[2]
    let id = url[4]
    this.titleService.setTitle(`${id} | ${this.platform} | ${this.branch} of OpenEBS E2E pipeline`)
    this.getPipelineData(this.platform, this.branch, id)
  }
  public pipData: any;
  Data: any;
  error: any;
  pipeD: any;
  jobLogs: any;
  actJob: any;
  actJobData: any;
  totalJobs: any;
  successJobs: any;
  failedJobs: any;

  // navbarCollapsed = true;
  getPipelineData(platform: string, branch: string, id: string) {
    let B = this.genbranch(branch)
    // this.Data = timer(0, 10000000).subscribe(x => {
    this.Data = this.ApiService.getPipelineData(platform, B, id).subscribe(res => {
      this.pipData = res
      this.pipData = this.pipData.pipeline;
      this.sortData(this.pipData)
      // if (!this.jobLogs) {
      //   this.activeJob(this.platform, this.branch, this.pipData.jobs[0].id, this.pipData.jobs[0])
      //   setTimeout(function () {
      //     if (!this.jobLogs) {
      //       this.activeJob(this.platform, this.branch, this.actJob)
      //     }
      //   }, 1000);
      // }

    },
      err => {
        this.error = err
        console.log(err);
      }
    )
    // })

  }

  sortData(D: any) {
    let stages = []
    let obj = []
    this.successJobs = D.jobs.filter(job => job.status == 'success').length
    this.failedJobs = D.jobs.filter(job => job.status == 'failed').length
    this.totalJobs = D.jobs.length
    D.jobs.forEach(j => {
      if (!this.actJob) {
        this.actJob = j.id
      }
      if (!stages.includes(j.stage)) {
        stages.push(j.stage)
      }
    });
    stages.forEach(stage => {
      const stageObj = {
        stageName: stage.toLowerCase(),
        allJobs: D.jobs.filter(job => job.stage == stage),
        status: this.stageStatusForObj(stage, D.jobs),
        noOfSuccessJobs: D.jobs.filter(job => job.stage == stage).filter(job => job.status == "success").length,
        noOfFailedJobs: D.jobs.filter(job => job.stage == stage).filter(job => job.status == "failed").length
      };
      obj.push(stageObj);
    })
    this.pipeD = obj
  }
  stageStatusForObj(stage, jobs) {
    let stageJobs = jobs.filter(job => job.stage == stage);
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
  genbranch(branch) {
    if (branch == 'cstor') {
      return 'openebs-cstor'
    } else if (branch == 'release-branch' || branch == "lvm-localpv" || branch == "jiva-operator" || branch == "device-localpv") {
      return branch
    } else {
      return `openebs-${branch}`
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
  // activeJob(p: string, b: string, id: any, job: any) {
  //   var d: any
  //   this.actJobData = job
  //   let data = this.ApiService.getJobLogs(p, b, id)
  //   // console.log("\t d a t a : : - ", p,b,id, "\n\n\n\n\n ***");
  //   this.jobLogs = data
  //   const c = new Convert();
  //   //  nst txt = "\u001b[38;5;196mHello\u001b[39m \u001b[48;5;226mWorld\u001b[49m";
  //   // console.log(c.toHtml(d, { use_classes: true }));
  //   this.jobLogs = c.toHtml(d, { use_classes: true })

  // }

  statusBadge(s: string) {
    switch (s) {
      case 'success':
        return "text-success border-success";
      case 'failed':
        return "text-danger border-danger"


      default:
        return "text-light border-light"
    }
  }
  // [ngClass]="statusBadge(stages.status)"
  statusBadgeforJob(s: string) {
    switch (s) {
      case 'success':
        return "badge-success"
      case 'failed':
        return "badge-danger"
      default:
        return "badge-light"
    }
  }

  pipeDuration(data) {
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
  triggerDate(data) {
    try {
      var date = data.jobs[0].started_at
      var dateFormat = moment.utc(date).local().calendar();
      return dateFormat
    } catch (error) {
      console.log("error", error);
      return "_";
    }
  }
  timeConverter(t) {
    try {
      var date = t
      var dateFormat = moment.utc(date).local().calendar();
      return dateFormat
    } catch (error) {
      console.log("error", error);
      return "_";
    }
  }
  onClickClose() {
    let url = window.location.pathname.split('/')
    if (url.includes('home')) {
      this.router.navigate(['/home'])
    } else {
      this.router.navigate(['../'], { relativeTo: this.route })
    }
  }

  ngOnDestroy() {
    this.Data.unsubscribe();
  }


}
