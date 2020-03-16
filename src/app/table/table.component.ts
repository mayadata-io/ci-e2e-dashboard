import { Component, OnInit, Pipe } from '@angular/core';
import { Subscription, Observable, timer, from } from "rxjs";
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
  public packetV15Data: any;
  public packetV14Data: any;
  public packetV13Data: any;
  public konvoyData: any;
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

    this.getData = timer(0, 5000000).subscribe(x => {
      this.DashboardDatas.getEndPointData("packet-antepenultimate").subscribe(data => {
        this.showSpinnerTable = false;
        this.packetV13Data = data;
      });
      this.DashboardDatas.getEndPointData("packet-penultimate").subscribe(data => {
        this.showSpinnerTable = false;
        this.packetV14Data = data;
      });
      this.DashboardDatas.getEndPointData("packet-ultimate").subscribe(data => {
        this.showSpinnerTable = false;
        this.packetV15Data = data;
      });
    });
    this.selectCell = timer(0, 1000).subscribe(x => {
      if (this.index == 1 && this.packetV13Data != undefined) {
        this.index = 0;
        this.detailPannel(0, this.packetV13Data.dashboard, 'packetv14');
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
  buildTooltip(index, build) {
    try {
      if (build[index].status == "success") {
        var sort_id = (build[index].sha).slice(0, 8)
        var name: any = "";
        if (build[index].project == "maya") {
          name = "m-apiserver"
        }
        else if (build[index].project == "jiva") {
          name = "jiva"
        }
        else if (build[index].project == "cStor") {
          name = "cstor-pool"
        }
        else if (build[index].project == "istgt") {
          name = "cstor-istgt"
        }
        return "Docker Image:-" + name + ":" + sort_id
      } else if (build[index].status == "failed") {
        return "Build failed";
      }
    } catch (e) {
      return "n/a"
    }
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
      } else if (data[index].status == "canceled") {
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

  detailPannel(index, pipelineData, cloud) {
    this.pipelineDetailStatus = false;
    this.showSpinnerDetails = true;
    setTimeout(() => {
      this.showSpinnerDetails = false;
    }, 500);
    if (pipelineData[index].status == "none" || pipelineData[index].status == "") {
      this.status = 'NA';
    } else {
      if (cloud == "packetv15") {
        this.image = 'packet.svg'
        this.name = "PACKET";
        this.kubernetesVersion = "1.15.3";
        this.status = 2;
        this.detailsDatas(index, pipelineData)
      } else if (cloud == "packetv14") {
        this.image = 'packet.svg'
        this.name = "PACKET";
        this.kubernetesVersion = "1.14.5";
        this.status = 1;
        this.detailsDatas(index, pipelineData)
      } else if (cloud == "packetv16") {
        this.image = 'packet.svg'
        this.name = "PACKET";
        this.kubernetesVersion = "1.16.1";
        this.status = 3;
        this.detailsDatas(index, pipelineData)
      } else if (cloud == "konvoy") {
        this.image = 'D2IQ.svg'
        this.name = "KONVOY";
        this.kubernetesVersion = "1.15.5";
        this.status = 4;
        this.detailsDatas(index, pipelineData)
      }
    }
  }

  detailsDatas(index, pipelineData) {
    this.rating = this.ratingCalculation(pipelineData[index].jobs)
    this.gitlabPipelineUrl = this.gitlabPipelineURL(pipelineData[index].web_url);
    this.log_url = pipelineData[index].kibana_url;
    this.totalJobs = pipelineData[index].jobs.length;
    this.executedJobs = this.executed(pipelineData[index].jobs)
    this.passedJobs = this.passed(pipelineData[index].jobs)
    this.failedJobs = this.failed(pipelineData[index].jobs)
    let gitlabStages = ["CLUSTER-SETUP", "PROVIDER-INFRA-SETUP", "STATEFUL-APP-DEPLOY", "APP-FUNC-TEST", "APP-CHAOS-TEST", "APP-DEPROVISION", "CLUSTER-CLEANUP"];
    this.clusterSetupStatus = this.getStageStatus(gitlabStages[0], pipelineData[index].jobs)
    this.providerInfraSetup = this.getStageStatus(gitlabStages[1], pipelineData[index].jobs)
    this.statefulAppDeploy = this.getStageStatus(gitlabStages[2], pipelineData[index].jobs)
    this.appFunctionTest = this.getStageStatus(gitlabStages[3], pipelineData[index].jobs)
    this.appChaosTest = this.getStageStatus(gitlabStages[4], pipelineData[index].jobs)
    this.appDeprovision = this.getStageStatus(gitlabStages[5], pipelineData[index].jobs)
    this.clusterCleanup = this.getStageStatus(gitlabStages[6], pipelineData[index].jobs)
    this.barChart(pipelineData[index]);
  }
  getStageStatus(stageName, data) {
    var statusObj = {
      status: "",
      successJobCount: 0,
      failedJobCount: 0,
      skippedJobCount: 0,
      jobCount: 0,
      runningJobCount: 0
    }
    for (var i = 0; i < data.length; i++) {
      if (data[i].stage == stageName) {
        statusObj.jobCount++;
      }
      if (data[i].stage == stageName && data[i].status == "running") {
        statusObj.runningJobCount++;
      }
      if (data[i].stage == stageName && data[i].status == "failed") {
        statusObj.failedJobCount++;
      }
      if (data[i].stage == stageName && data[i].status == "skipped") {
        statusObj.skippedJobCount++;
      }
      if (data[i].stage == stageName && data[i].status == "canceled") {
        statusObj.status = "CANCELLED"
      }
      if (data[i].stage == stageName) {
        if (data[i].status == "created" || data[i].status == "pending") {
          statusObj.status = "Pending"
        }
      }
      if (data[i].stage == stageName && data[i].status == "success") {
        statusObj.successJobCount++;
      }
    }
    if (statusObj.runningJobCount > 0) {
      statusObj.status = "Running"
    } else if (statusObj.successJobCount == statusObj.jobCount) {
      statusObj.status = "Success"
    } else if (statusObj.skippedJobCount == statusObj.jobCount) {
      statusObj.status = "Skipped"
    } else if (statusObj.runningJobCount == 0 && statusObj.failedJobCount > 0) {
      statusObj.status = "Failed"
    }
    return statusObj;
  }

  gitlabPipelineURL(url) {
    return url.replace("openebs100.io", "openebs.ci");
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

  barChart(pipeline) {
    $('#chart').empty();
    $('#chart').html('<canvas id="myChart"></canvas>'); // then load chart.

    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.getJobsName(pipeline, 'labels'),
        datasets: [{
          label: this.name + '  PipelineID :  ' + pipeline.id + '  ',
          data: this.getJobsName(pipeline, 'data'),
          backgroundColor: this.getJobsName(pipeline, 'bgcolor'),
          borderColor: this.getJobsName(pipeline, 'bordercolor'),
          borderWidth: 2
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Duration of Jobs'
        },
        responsive: true,
        pointLabelFontSize: 5,
        tooltips: {
          mode: 'nearest'
        },
        scales: {
          yAxes: [{
            id: 'left-y-axis',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Time in Minutes'
            }
          }]
        }
      }
    });
    /**
     * Clicking Bar graphs open gitlab job logs page.
     */
    document.getElementById("myChart").onclick = function (evt) {
      try {
        var activePoints = myChart.getElementsAtEvent(evt);
        var firstPoint = activePoints[0];
        var label = myChart.data.labels[firstPoint._index];
        var getJobId = pipeline.jobs.filter(job => job.name === label)[0]
        var pipelineURL = pipeline.web_url.split('pipelines/')
        var url = pipelineURL[0] + '-/jobs/' + getJobId.id
        window.open(url, '_blank');
      } catch (error) {
        console.log('Got issue in fetching job URL', error)
      }
    };
  }
  getJobsName(pipeline, data) {
    let sampleArray = []
    let diff = [];
    let bgColor = [];
    let borderColor = [];
    sampleArray.length = 0;
    diff.length = 0;
    bgColor.length = 0;
    borderColor.length = 0;
    pipeline.jobs.forEach(job => {
      sampleArray.push(this.genJobName(job.name));
      var startedAt = moment(job.started_at, 'YYYY-M-DD,HH:mm:ss');
      var finishedAt = moment(job.finished_at, 'YYYY-M-DD,HH:mm:ss');
      var difference = moment.duration((finishedAt.diff(startedAt, 'second')), "second").asMinutes();
      diff.push(difference.toFixed(2));
      let color;
      if (job.status == "success") {
        color = "138,177,255";
      }
      else if (job.status == "failed") {
        color = "255,184,189";
      }
      else if (job.status == "skipped") {
        color = "169,169,169";
      } else {
        color = "35,36,35"
      }

      //  Gradient colour for bar graph
      var ctx = <HTMLCanvasElement>document.getElementById('myChart');
      var ctxx = ctx.getContext("2d");
      var gradientFill = ctxx.createLinearGradient(0, 500, 30, 50);
      for (let dec = 0.1; dec <= 1; dec=dec+0.1) {
        gradientFill.addColorStop(dec, `rgba(${color},${dec})`);
      }
      bgColor.push(gradientFill);
      borderColor.push(gradientFill)

    });
    if (data == 'labels') {
      return sampleArray
    } else if (data == 'data') {
      return diff
    } else if (data == 'bgcolor') {
      return bgColor
    } else if (data == 'bordercolor') {
      return borderColor
    } else 'N/A'
  }
  genJobName(name) {
    return name;
  }
}
