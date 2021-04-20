import { Component, OnInit } from '@angular/core';
import { DashboardData } from "../../services/ci-dashboard.service";
import { ISubscription } from "rxjs/Subscription";
import { Subscription, Observable, timer, from, pipe } from "rxjs";

@Component({
  selector: 'app-pipeline-detail',
  templateUrl: './pipeline-detail.component.html',
  styleUrls: ['./pipeline-detail.component.scss']
})
export class PipelineDetailComponent implements OnInit {



  platform : any;
  branch : any;
  constructor(private ApiService: DashboardData) { }

  ngOnInit() {
    let url = window.location.pathname.split('/')
    console.log("url", url);
    this.platform = url[3]
    this.branch = url[2]
    let id = url[5]
    console.log(`Platform : ${this.platform} \n Branch: ${this.branch} \n ID: ${id} \n\n`);

    this.getPipelineData(this.platform, this.branch, id)
  }
  public pipData: any;
  Data: any;
  error: any;
  pipeD: any;
  jobLogs: any;
  actJob : any;

  // navbarCollapsed = true;
  getPipelineData(platform: string, branch: string, id: string) {
    let B = this.genbranch(branch)
    this.Data = timer(0, 10000000).subscribe(x => {
      this.ApiService.getPipelineData(platform, B, id).subscribe(res => {
        this.pipData = res
        this.pipData = this.pipData.pipeline;
        this.sortData(this.pipData)
        if (!this.jobLogs){
          this.activeJob(this.platform,this.branch,this.actJob)
        }

      },
        err => {
          this.error = err
          console.log(err);
        }
      )
    })

  }
  sortData(D: any) {
    let stages = []
    let obj = []
    D.jobs.forEach(j => {
      if (!this.actJob){
        this.actJob = j.id
        console.log("------JobID----",this.actJob);
      }
      if (!stages.includes(j.stage)) {
        stages.push(j.stage)
      }
    });
    stages.forEach(stage => {
      const stageObj = {
        stageName: stage,
        allJobs: D.jobs.filter(job => job.stage == stage),
        status: this.stageStatusForObj(stage, D.jobs),
        noOfSuccessJobs: D.jobs.filter(job => job.stage == stage).filter(job => job.status == "success").length,
        noOfFailedJobs: D.jobs.filter(job => job.stage == stage).filter(job => job.status == "failed").length
      };
      obj.push(stageObj);
    })
    this.pipeD = obj
    console.log("\n\n\n stages \n\n\n ", obj);
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
  genbranch(branch) {
    console.log("branch is ", branch);

    if (branch == 'cstor') {
      return 'openebs-cstor'
    } else if (branch == 'release-branch' || branch == "lvm-localpv") {
      return branch
    } else {
      return `openebs-${branch}`
    }
  }
   activeJob(p: string, b: string, id: any) {
    var d:any
     let data = this.ApiService.getJobLogs(p,b,id)
    console.log("\t d a t a : : - ",data);
    this.jobLogs = data
    
  }



  ngOnDestroy() {
    this.Data.unsubscribe();
  }

}
