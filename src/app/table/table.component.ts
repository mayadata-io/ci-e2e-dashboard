import { Component, OnInit, Pipe } from '@angular/core';
import { Subscription, Observable, timer, from } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
// import Chart from 'chart.js'
import * as moment from 'moment';
import * as dateformat from 'dateformat';
import * as $ from 'jquery';
import { DashboardData } from "../services/ci-dashboard.service";
// import { HttpClient } from "@angular/common/http";
// import { map } from "rxjs/operators";
import { Meta, Title } from '@angular/platform-browser';
import { Router } from "@angular/router";
import { TranslateService } from 'angular-intl';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  public pipelineDetailStatus: boolean = false;
  public showSpinnerTable: boolean = true;
  public showSpinnerDetails: boolean = true;
  private selectCell: ISubscription;
  private getData: ISubscription;
  public index = 1;
  public initialCount = 0;
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
  public packetV11Data: any;
  public packetV12Data: any;
  public packetV13Data: any;
  public buildData: any;
  public vendor: any = false;

  constructor(private router: Router, private DashboardDatas: DashboardData, private meta: Meta, private titleService: Title, public translateService: TranslateService) {
    this.meta.addTag({ name: 'description', content: 'Openebs.ci is the CI and E2E portal for OpenEBS github PRs. Using this portal, OpenEBS community uses this portal to find the build quality against each PR that is merged. It also hosts stateful application workloads with various deployment scenarios. The example workloads include MongoDB, Percona, WordPress, Prometheus, Redis, CockroachDB etc.' });
    this.meta.addTag({ name: 'keywords', content: 'Openebs,EBS,workload,mongo,jiva,cstor' });
    this.titleService.setTitle("CI/E2E dashboard for OpenEBS");
    // Routing to overview page is vendor is true
    this.translateService.getByFileName('VENDOR', 'default-en').subscribe(value => {
      this.vendor = value;
      if (this.vendor == "true") {
        this.router.navigate(['/overview']);
      }
    });
  }

  ngOnInit() {
    localStorage.removeItem('row');
    //Highlight the row
    $('#data').on('click', 'tbody tr', function (e) {
      $(this).addClass('row_color').siblings().removeClass('row_color');
      // Store selected row in localStorage
      var selectedRow = $(this).index();
      localStorage.setItem('row', selectedRow);
      // Highlight the cell
      $("#data span").removeClass("highlight");
      var clickedCell = $(e.target).closest("span");
      clickedCell.addClass("highlight");
    });

    this.getData = timer(0, 5000).subscribe(x => {
      this.DashboardDatas.getPacketv11Details().subscribe(data => {
        this.showSpinnerTable = false;
        this.packetV11Data = data;
      });
      this.DashboardDatas.getPacketv12Details().subscribe(data => {
        this.showSpinnerTable = false;
        this.packetV12Data = data;
      });
      this.DashboardDatas.getPacketv13Details().subscribe(data => {
        this.showSpinnerTable = false;
        this.packetV13Data = data;
      });
      this.DashboardDatas.getBuildDetails().subscribe(data => {
        this.showSpinnerTable = false;
        this.buildData = data;
      });
    });

    this.selectCell = timer(0, 1000).subscribe(x => {
      if (this.index == 1 && this.buildData != undefined && this.packetV11Data != undefined) {
        this.index = 0;
        this.detailPannel(0, this.packetV11Data.dashboard, this.buildData.dashboard, 'packetv11');
      }
    });

  }

  ngOnDestroy() {
    this.getData.unsubscribe();
    this.selectCell.unsubscribe();
  }

  rowCount() {
    var rowValue = localStorage.getItem('row');
    if (rowValue == null) {
      rowValue = (this.initialCount).toString();
    }
    return rowValue;
  }

  buildStatus(index, buildItems) {
    try {
      return buildItems[index].status;
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
  ifFail(index, data) {
    if (data[index].status == "pending") {
      return "fa fa-clock-o btn btn-txt btn-outline-warning"
    } else {
      return "fa fa-ban fa-fw"
    }
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

  //Get master build count
  masterBuildsCount(data) {
    var buildCount = 0;
    for (let i in data) {
      var now = moment(dateformat((new Date()), "yyyy-mm-dd'T'HH:MM:ss"), 'YYYY-M-DD,HH:mm:ss');
      var buildTime = moment(data[i].jobs[0].created_at, 'YYYY-M-DD,HH:mm:ss');
      var difference = moment.duration((now.diff(buildTime, 'second')), "second").days();
      if (difference <= 7) {
        buildCount++;
      }
    }
    return buildCount;
  }

  buildWeburl(index, buildItems) {
    try {
      if (buildItems[index].web_url) {
        var generatedURL = buildItems[index].web_url.replace("openebs100.io", "openebs.ci");
        return generatedURL;
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
      var now = moment(dateformat((new Date()), "IST:yyyy-mm-dd'T'HH:MM:ss"), 'YYYY-M-DD,HH:mm:ss');
      var buildTime = moment(data[index].jobs[0].created_at, 'YYYY-M-DD,HH:mm:ss');
      var difference = moment.duration((now.diff(buildTime, 'second')), "second");
      var days = difference.days();
      var hours = difference.hours();
      var minutes = difference.hours();
      if (days != 0) {
        return days + "d " + hours + "h" + " ago";
      }
      return hours + "h " + minutes + "m" + " ago";
    } catch (e) {
      return "_";
    }
  }

  // getCommit returns commit id
  getCommit(index, data) {
    try {
      return data[index].sha;
    } catch (e) {
      return "n/a";
    }
  }
  // getCommitName returns commit name
  getCommitName(index, data) {
    try {
      var repoName = data[index].web_url.split('/');
      return repoName[4];
    } catch (e) {
      return "n/a";
    }
  }

  getJobPercentFromPipeline(i, data) {
    try {
      if (data[i].status == "success") {
        return "95 5";
      }
      else if (data[i].status == "canceled") {
        return "0 0";
      }
      else if (data[i].status == "pending") {
        return "0 0";
      }
      else if (data[i].status == "failed") {
        var count = 0;
        for (var j = 0; j < data[i].jobs.length; j++) {
          if (data[i].jobs[j].status == "success") {
            count++;
          }
        }
        var percentage = (count / data[i].jobs.length) * 100;
        return `${percentage} ${100 - percentage}`
      }
      else if (data[i].status == "running") {
        return "95 5";
      }
    }
    catch {
      return "0 0";
    }
  }
  pipelineTooltip(index, data) {
    try {
      if (data[index].status == "running") {
        return "running"
      } else if (data[index].status == "pending") {
        return "pending"
      } else if (data[index].status == "cancelled") {
        return "cancelled"
      } else if (data[index].status == "" || data[index].status == "none") {
        return ""
      } else {
        var passedJobs = this.passed(data[index].jobs)
        var failedJobs = this.failed(data[index].jobs)
        return "Passed: " + passedJobs + " Failed: " + failedJobs;
      }
    } catch (e) {
      return "n/a"
    }
  }
  pipelineStatus(index, data) {
    try {
      if (data[index].status == "running") {
        return "running"
      } else if (data[index].status == "pending") {
        return "pending"
      } else if (data[index].status == "cancelled") {
        return "cancelled"
      } else if (data[index].status == "none") {
        return "none"
      } else if (data[index].status == "created") {
        return "created"
      } else if (data[index].status == "failed") {
        return "failed"
      }
    } catch (e) {
      return "n/a"
    }
  }

  pipelineClass(status) {
    if (status == "none") {
      return "fa fa-ban"
    } else if (status == "pending") {
      return "fa fa-clock-o btn btn-txt btn-outline-warning"
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

  detailPannel(index, pipelineData, buildData, cloud) {
    this.pipelineDetailStatus = false;
    this.showSpinnerDetails = true;
    setTimeout(() => {
      this.showSpinnerDetails = false;
    }, 500);
    if (pipelineData[index].status == "none" || pipelineData[index].status == "") {
      this.status = 'NA';
    } else {
      if (cloud == "packetv11") {
        this.image = 'packet.svg'
        this.name = "PACKET";
        this.kubernetesVersion = "1.11.8";
        this.status = 1;
        this.detailsDatas(index, pipelineData, buildData)
      } else if (cloud == "packetv12") {
        this.image = 'packet.svg'
        this.name = "PACKET";
        this.kubernetesVersion = "1.12.6";
        this.status = 2;
        this.detailsDatas(index, pipelineData, buildData)
      } else if (cloud == "packetv13") {
        this.image = 'packet.svg'
        this.name = "PACKET";
        this.kubernetesVersion = "1.13.4";
        this.status = 3;
        this.detailsDatas(index, pipelineData, buildData)
      }
    }
  }

  detailsDatas(index, pipelineData, buildData) {
    this.commitMessage = buildData[index].jobs[0].message;
    this.pullRequest = this.pullRequestURL(buildData[index])
    this.commitUser = this.commitUsr(buildData[index].jobs[0].author_name, pipelineData[index].sha);
    this.rating = this.ratingCalculation(pipelineData[index].jobs)
    this.gitlabPipelineUrl = this.gitlabPipelineURL(pipelineData[index].web_url);
    this.log_url = pipelineData[index].kibana_url;
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
  gitlabPipelineURL(url) {
    return url.replace("openebs100.io", "openebs.ci");
  }

  getClusterSetupStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-SETUP" && data[i].status == "success") {
        statusObj.successJobCount++;
      }

    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }


    return statusObj;
  }


  getProviderInfraSetupStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "success") {
        statusObj.successJobCount++;
      }

    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }


    return statusObj;
  }

  getStatefulAppDeployStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "success") {
        statusObj.successJobCount++;
      }

    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }


    return statusObj;
  }
  getAppFunctionTestStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-FUNC-TEST" && data[i].status == "success") {
        statusObj.successJobCount++;
      }

    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }


    return statusObj;
  }

  getAppChaosTestStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-CHAOS-TEST" && data[i].status == "success") {
        statusObj.successJobCount++;
      }

    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }


    return statusObj;
  }
  getAppDeprovisionStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "APP-DEPROVISION" && data[i].status == "success") {
        statusObj.successJobCount++;
      }

    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }


    return statusObj;
  }
  getClusterCleanupStatus(data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP") {
        statusObj.jobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "running") {
        statusObj.status = "Running"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP") {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "success") {
        statusObj.successJobCount++;
      }

    }

    if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }


    return statusObj;
  }

  pullRequestURL(data) {
    var commitSha = data.sha;
    var repoName = data.web_url.split('/');
    var pullRequestURL = "https://github.com/" + repoName[3] + "/" + repoName[4] + "/commit/" + commitSha;
    return pullRequestURL;
  }

  clickit(url) {
    window.open(url, "_blank");
  }

  ratingCalculation(data) {
    var executed = this.executed(data);
    var passed = this.passed(data);
    var rating = ((passed / executed) * 100);
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

  commitUsr(user, sha) {
    var commitId = sha.slice(0, 8);
    return commitId + '  @' + user;
  }

  gitlabStageBuildClass(status) {
    if (status === "Success") {
      return "gitlab_stage_build_success";
    }
    else if (status === "CANCELED" || status === "Skipped") {
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
}
