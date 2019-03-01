import { Component, OnInit, Pipe } from '@angular/core';
import Chart from 'chart.js'
import * as moment from 'moment';
import * as dateformat from 'dateformat';
import * as $ from 'jquery';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Meta,Title } from '@angular/platform-browser';
import { Router } from "@angular/router";
import { TranslateService } from 'angular-intl';

const PIPELINE_MAP = {
  gke: 0,
  aks: 1,
  eks: 2,
  packet: 3,
  gcp: 4,
  aws: 5
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  id: any;
  host: any;
  items = [];
  restItems: any;
  restItemsUrl: string;
  initialCount = 0;
  public showSpinnerTable:boolean = true; 
  public showSpinnerDetails:boolean = true; 
  public vendor: any = false;
  constructor(private router: Router, private http: HttpClient,private meta:Meta,private titleService: Title, public translateService: TranslateService ) {
    // Routing to overview page is vendor is true
    this.translateService.getByFileName('VENDOR', 'default-en').subscribe(value => {
      this.vendor = value;
      if (this.vendor == "true") {
        this.router.navigate(['/overview']);
      }
    });
    // ------------------
    this.host = window.location.host;
    if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
      this.restItemsUrl = "http://localhost:3000";
    } else if (this.host == "openebs.ci" || this.host == "wwww.openebs.ci" ) {
        this.restItemsUrl = "https://openebs.ci/api/";
    } else {
      this.restItemsUrl = "https://staging.openebs.ci/api/";
    }
    this.meta.addTag({ name: 'description', content: 'Openebs.ci is the CI and E2E portal for OpenEBS github PRs. Using this portal, OpenEBS community uses this portal to find the build quality against each PR that is merged. It also hosts stateful application workloads with various deployment scenarios. The example workloads include MongoDB, Percona, WordPress, Prometheus, Redis, CockroachDB etc.' });
    this.meta.addTag({ name: 'keywords', content: 'Openebs,EBS,workload,mongo,jiva,cstor' });
    this.titleService.setTitle( "CI/E2E dashboard for OpenEBS" );
  }

  ngOnInit() {
    localStorage.removeItem('row');
    //for Highlight the row
    $('#data').on('click', 'tbody tr', function(e) {
     $(this).addClass('row_color').siblings().removeClass('row_color');
     // store selected row in localStorage
     var selectedRow = $(this).index();
     localStorage.setItem('row', selectedRow);
     // For highlight the cell
      $("#data span").removeClass("highlight");
      var clickedCell= $(e.target).closest("span");
      clickedCell.addClass("highlight");
    });


    // TODO
    var index = 1;
    this.getRestItems();
    setInterval(() => {
      if (index == 1) {
        var data = this.getRestItems();
          for (var i = 0; i < data.pipelines[0].length; i++) {
            if(data.pipelines[0][i].status == "pending" || data.pipelines[0][i].status == "created") {
              this.initialCount ++;
              break;
            }
          }
        this.detailPannel('GKE', this.initialCount, data);
        index = 0;
      }
    }, 500);

    this.id = setInterval(() => {
      this.getRestItems();
    }, 60000);

  }

  rowCount() {
    var rowValue = localStorage.getItem('row');
    if(rowValue == null) {
      rowValue = (this.initialCount).toString();
    }
    return rowValue;
  }

  // Read all REST Items
  getRestItems() {
    this.restItemsServiceGetRestItems().subscribe(restItems => {
      this.showSpinnerTable = false;
      this.showSpinnerDetails = false;
      this.restItems = restItems;
      this.items = JSON.parse(JSON.stringify(restItems));
    });
    var data = JSON.parse(JSON.stringify(this.items));
    return data.dashboard;
  }

  // Rest Items Service: Read all REST Items
  restItemsServiceGetRestItems() {
    return this.http.get<any[]>(this.restItemsUrl).pipe(map(data => data));
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  // getCommitName returns commit name
  getCommitName(index, commits) {
    try {
      return commits[index].name;
    } catch (e) {
      return "n/a";
    }
  }

  //Get master build count
  masterBuildsCount(data) {
    var buildCount = 0;
    for (var i=0; i < data.length; i++) {
      if (data[i].jobs != undefined ) {
        var now = moment(dateformat((new Date()), "UTC:yyyy-mm-dd'T'HH:MM:ss"), 'YYYY-M-DD,HH:mm:ss');
        var buildTime = moment(data[i].jobs[0].created_at, 'YYYY-M-DD,HH:mm:ss');
        var difference = moment.duration((now.diff(buildTime, 'second')), "second").days();
        if (difference < 7) {
          buildCount++;
        }
      }
    }
    return buildCount;
  }

  // getCommit returns commit id
  getCommit(index, commits) {
    try {
      if (commits[index].sha) {
        var test = (commits[index].sha)
        return test;
      } else {
        return "n/a";
      }
    } catch (e) {
      return "n/a";
    }
  }

  // getCommit returns commit url
  commitUrl(index, commits) {
    try {
      if (commits[index].commit_url) {
        return commits[index].commit_url;
      } else {
        return "#";
      }
    } catch (e) {
      return "#";
    }
  }

  // Updated returns commit id
  updated(index, data) {
    try {
      return data[index].jobs[0].updated;
    } catch (e) {
      return "n/a";
    }
  }
  iconClass(status) {
    if (status == "success") return "fa fa-check-circle";
    else if (status == "canceled") return "fa fa-ban";
    else if (status == "pending") return "fa fa-clock-o";
    else if (status == "failed") return "fa fa-exclamation-triangle";
    else if (status == "running") return "fa fa-circle-o-notch fa-spin";
  }

  buttonStatusClass(status) {
    if (status == "success") return "btn btn-txt btn-outline-success";
    else if (status == "pending")
      return "btn btn-txt btn-outline-warning";
    else if (status == "canceled")
      return "btn btn-txt btn-outline-secondary";
    else if (status == "failed")
      return "btn btn-txt btn-outline-danger";
    else if (status == "running")
      return "btn btn-txt btn-outline-primary";
    else if (status == "n/a")
      return "btn btn-txt btn-outline-secondary";
  }

  buildTooltip(index, build) {
    try {
      if (build[index].status == "success") {
        var sort_id = (build[index].sha).slice(0,8)
        if(build[index].name == "maya") {
          var name = "m-apiserver"
        }
        if(build[index].name == "jiva") {
          var name = "jiva"
        }
        if(build[index].name == "cStor") {
          var name = "cstor-pool"
        }
        if(build[index].name == "istgt") {
          var name = "cstor-istgt"
        }
        return "Docker Image:-" + name + ":" + sort_id
      } else if (build[index].status == "failed") {
        return "Build failed";
      }
    } catch (e) {
      return "n/a"
    }
  }

  pipelineTooltip(index, data) {
    try {
      if(data[index].status == "running") {
        return "running"
      } else if(data[index].status == "pending") {
        return "pending"
      } else if(data[index].status == "cancelled") {
        return "cancelled"
      } else {
        var passedJobs = this.passed(data[index].jobs)
        var failedJobs = this.failed(data[index].jobs)
        return "Passed: " + passedJobs + " Failed: " + failedJobs;
      }
    } catch (e) {
      return "n/a"
    }
  }

  // This function extracts the Run status in GCP pipeline using current index
  buildStatus(index, buildItems) {
    try {
      if (buildItems[index].status) {
        return buildItems[index].status;
      }
      else {
        return "n/a"
      }
    } catch (e) {
      return "n/a";
    }
  }

  buildWeburl(index, buildItems) {
    try {
      if (buildItems[index].web_url) {
        return buildItems[index].web_url;
      } else {
        return "#";
      }
    } catch (e) {
      return "#";
    }
  }

  getJobPercentFromPipeline(i, dashboard, pipe){
    try {
      // if(dashboard.build[i].status == "success") {
        var pipeline = dashboard.pipelines[PIPELINE_MAP[pipe]];
        if (pipeline[i].status == "success") {
          return "95 5";
        }
        else if (pipeline[i].status == "canceled") {
          return "0 0";
        }
        else if (pipeline[i].status == "pending") {
          return "0 0";
        }
        else if (pipeline[i].status == "failed") {
          var count = 0;
          for (var j = 0; j < pipeline[i].jobs.length; j++) {
            if(pipeline[i].jobs[j].status == "success") {
              count++;
            }
          }
          var percentage = (count/pipeline[i].jobs.length)*100;
          return `${percentage} ${100-percentage}`
        }
        else if (pipeline[i].status == "running") {
          return "95 5";
        }
    }
    catch {
      return "0 0";
    }
  }

  gitlabStageBuildClass(status) {
    if (status === "Success") {
      return "gitlab_stage_build_success";
    }
    else if (status === "canceled" || status === "Skipped") {
      return "gitlab_stage_build_skipped";
    }
    else if (status === "Pending") {
      return "gitlab_stage_build_pending";
    }
    else if (status === "Running") {
      return "gitlab_stage_build_running";
    }
    else if (status === "Failed") {
      return "gitlab_stage_build_failed";
    }
  }

  clickit(url) {
    window.open(url, "_blank");
  }

  public name: any;
  public image: any;
  public gitlabPipelineUrl: any;
  public log_url: any;
  public totalJobs: any;
  public executedJobs: any;
  public passedJobs: any;
  public failedJobs: any;
  public commitMessage: any;
  public commitUser: any;
  public baseline: any;
  public litmus: any;
  public rating: any;
  public pullRequest: any;
  public status: any;
  public clusterSetupStatus: any;
  public providerInfraSetup: any;
  public statefulAppDeploy: any;
  public appFunctionTest: any;
  public appChaosTest: any;
  public clusterCleanup: any;
  public appDeprovision: any;
  public kubernetesVersion: any;


  detailPannel(cloud, index, data) {
    this.showSpinnerDetails = true;
    setTimeout( () => {
      this.showSpinnerDetails = false;
    }, 500);
    if (cloud == 'GKE') {
      this.image = 'gke.svg'
      this.name = cloud;
      this.kubernetesVersion = "1.9.7";
      if (data != undefined) {
        if (data.build[index].jobs != undefined && data['pipelines'][0][index].jobs != undefined) {
          var pipelineData = data['pipelines'][0]
          this.status = 1;
          this.detailsDatas(index, pipelineData, data)
        }
      }
    }
    else if (cloud == 'AKS') {
      this.image = 'aks.svg'
      this.name = cloud;
      this.kubernetesVersion = "1.9.11";
      if (data != undefined) {
        if (data.build[index].jobs != undefined && data['pipelines'][1][index].jobs != undefined) {
          var pipelineData = data['pipelines'][1]
          this.status = 2;
          this.detailsDatas(index, pipelineData, data)
        }
      }
    }
    else if (cloud == 'EKS') {
      this.image = 'eks.svg'
      this.name = cloud;
      this.kubernetesVersion = "1.10.3";
      if (data != undefined) {
        if (data.build[index].jobs != undefined && data['pipelines'][2][index].jobs != undefined) {
          var pipelineData = data['pipelines'][2]
          this.status = 3;
          this.detailsDatas(index, pipelineData, data)
        }
      }
    }
    else if (cloud == 'Packet') {
      this.image = 'packet.svg'
      this.name = cloud;
      this.kubernetesVersion = "1.10.0";
      if (data != undefined) {
        if (data.build[index].jobs != undefined && data['pipelines'][3][index].jobs != undefined) {
          var pipelineData = data['pipelines'][3]
          this.status = 4;
          this.detailsDatas(index, pipelineData, data)
        }
      }
    }
    else if (cloud == 'GCP') {
      this.image = 'gcp.svg'
      this.name = cloud;
      this.kubernetesVersion = "1.11.1";
      if (data != undefined) {
        if (data.build[index].jobs != undefined && data['pipelines'][4][index].jobs != undefined) {
          var pipelineData = data['pipelines'][4]
        this.status = 5;
          this.detailsDatas(index, pipelineData, data)
        }
      }
    }

    else if (cloud == 'AWS') {
      this.image = 'aws.svg'
      this.name = cloud;
      this.kubernetesVersion = "1.10.0";
      if (data != undefined) {
        if (data.build[index].jobs != undefined && data['pipelines'][5][index].jobs != undefined) {
          var pipelineData = data['pipelines'][5]
          this.status = 6;
          this.detailsDatas(index, pipelineData, data)
        }
      }
    }
  }

  detailsDatas(index, pipelineData, data) {
    this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
    this.pullRequest = data.build[index].commit_url
    this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
    this.rating = this.ratingCalculation(pipelineData[index].jobs)
    this.gitlabPipelineUrl = pipelineData[index].web_url;
    this.log_url = pipelineData[index].log_link;
    this.totalJobs = pipelineData[index].jobs.length;
    this.executedJobs = this.executed(pipelineData[index].jobs)
    this.passedJobs = this.passed(pipelineData[index].jobs)
    this.failedJobs = this.failed(pipelineData[index].jobs)
    this.clusterSetupStatus = this.getClusterSetupStatus(pipelineData[index].jobs)
    this.providerInfraSetup = this.getProviderInfraSetupStatus(pipelineData[index].jobs)
    this.statefulAppDeploy = this.getStatefulAppDeployStatus(pipelineData[index].jobs)
    this.appFunctionTest = this.getAppFunctionTestStatus(pipelineData[index].jobs)
    this.appChaosTest = this.getAppChaosTestStatus(pipelineData[index].jobs)
    this.appDeprovision = this.getAppDeprovisionStatus(pipelineData[index].jobs)
    this.clusterCleanup = this.getClusterCleanupStatus(pipelineData[index].jobs)

  }

  ratingCalculation(data) {
    var executed = this.executed(data);
    var passed = this.passed(data);
    var rating = ((passed/executed)*100);
    return rating + "%"
  }

  executed(data) {
    var executed = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].status == "success" || data[i].status == "failed") {
        executed = executed + 1;
      }
    }
    return executed;
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

  commitUsr(data) {
    var commitId = data.short_id;
    var username = data.author_name;
    return commitId + '  @' + username;
  }

  commitMess(data) {
    var message = data.message;
    return message;
  }

  getClusterSetupStatus(data) {
    var statusObj={
      status: "",
      successJobCount: 0,
      failedJobCount:0,
      skippedJobCount:0,
      jobCount :0
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-SETUP") {
        statusObj.jobCount ++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-SETUP" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-SETUP" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-SETUP" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-SETUP" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-SETUP") {
        if(data[i].status == "created" || data[i].status == "pending") { 
          statusObj.status = "Pending"
         }
      }
    }
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-SETUP" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
      
    }

    if(statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount){
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
   

    return statusObj;
  }


  getProviderInfraSetupStatus(data) {
    var statusObj={
      status: "",
      successJobCount: 0,
      failedJobCount:0,
      skippedJobCount:0,
      jobCount:0
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "PROVIDER-INFRA-SETUP") {
        statusObj.jobCount ++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "PROVIDER-INFRA-SETUP") {
        if(data[i].status == "created" || data[i].status == "pending") { 
          statusObj.status = "Pending"
         }
      }
    }
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
      
    }

    if(statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount){
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
   

    return statusObj;
  }

  getStatefulAppDeployStatus(data) {
    var statusObj={
      status: "",
      successJobCount: 0,
      failedJobCount:0,
      skippedJobCount:0,
      jobCount:0
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "STATEFUL-APP-DEPLOY") {
        statusObj.jobCount ++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "STATEFUL-APP-DEPLOY") {
        if(data[i].status == "created" || data[i].status == "pending") { 
          statusObj.status = "Pending"
         }
      }
    }
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
      
    }

    if(statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount){
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
   

    return statusObj;
  }
  getAppFunctionTestStatus(data) {
    var statusObj={
      status: "",
      successJobCount: 0,
      failedJobCount:0,
      skippedJobCount:0,
      jobCount:0
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-FUNC-TEST") {
        statusObj.jobCount ++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-FUNC-TEST" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-FUNC-TEST" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-FUNC-TEST" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-FUNC-TEST" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-FUNC-TEST") {
        if(data[i].status == "created" || data[i].status == "pending") { 
          statusObj.status = "Pending"
         }
      }
    }
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-FUNC-TEST" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
      
    }

    if(statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount){
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
   

    return statusObj;
  }

  getAppChaosTestStatus(data) {
    var statusObj={
      status: "",
      successJobCount: 0,
      failedJobCount:0,
      skippedJobCount:0,
      jobCount : 0
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-CHAOS-TEST") {
        statusObj.jobCount ++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-CHAOS-TEST" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-CHAOS-TEST" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-CHAOS-TEST" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-CHAOS-TEST" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-CHAOS-TEST") {
        if(data[i].status == "created" || data[i].status == "pending") { 
          statusObj.status = "Pending"
         }
      }
    }
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-CHAOS-TEST" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
      
    }

    if(statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount){
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
   

    return statusObj;
  }
  getAppDeprovisionStatus(data) {
    var statusObj={
      status: "",
      successJobCount: 0,
      failedJobCount:0,
      skippedJobCount:0,
      jobCount : 0
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-DEPROVISION") {
        statusObj.jobCount ++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-DEPROVISION" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-DEPROVISION" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-DEPROVISION" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-DEPROVISION" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-DEPROVISION") {
        if(data[i].status == "created" || data[i].status == "pending") { 
          statusObj.status = "Pending"
         }
      }
    }
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-DEPROVISION" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
      
    }

    if(statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount){
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
   

    return statusObj;
  }
  getClusterCleanupStatus(data) {
    var statusObj={
      status: "",
      successJobCount: 0,
      failedJobCount:0,
      skippedJobCount:0,
      jobCount:0
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-CLEANUP") {
        statusObj.jobCount ++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-CLEANUP") {
        if(data[i].status == "created" || data[i].status == "pending") { 
          statusObj.status = "Pending"
         }
      }
    }
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "success") {
        statusObj.successJobCount++;
      }
      
    }

    if(statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount){
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
   

    return statusObj;
  }
}
