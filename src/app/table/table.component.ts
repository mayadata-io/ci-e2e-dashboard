import { Component, OnInit, Pipe } from '@angular/core';
import Chart from 'chart.js'
import * as $ from 'jquery';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Meta,Title } from '@angular/platform-browser';

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

  constructor(private http: HttpClient,private meta:Meta,private titleService: Title ) {
    this.host = window.location.host;
    if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
      this.restItemsUrl = "http://localhost:3000";
    } else if (this.host == "openebs.ci") {
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

    $(document).ready(function(){
      $("#btn1").click(function(){
        $(".divClass").slideToggle("slow",function()
        {
        });
      });
    });

    // TODO
    var index = 1;
    this.getRestItems();
    setInterval(() => {
      if (index == 1) {
        var data = this.getRestItems();
        if (data.build != undefined) {
          for (var i = 0; i < data.build.length; i++) {
            if(data.build[i].status == "running") {
              this.initialCount ++;
            }
          }
        }
        this.detailPannel('GKE', this.initialCount, data);
        index = 0;
      }
    }, 500);

    this.id = setInterval(() => {
      this.getRestItems();
    }, 60000);

    // var chBar = document.getElementById("chBar");
    // var chartData = {
    //   labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    //   datasets: [{
    //     data: [589, 445, 483, 503, 689, 692, 634, 732, 579, 806],
    //     backgroundColor: 'blue'
    //   },
    //   { data: [409, 245, 383, 403, 589, 692, 580, 532, 879, 406],
    //     backgroundColor: '#000000'
    //   }]
    // };
    // if (chBar) {
    //   new Chart(chBar, {
    //   type: 'bar',data: chartData,
    //   options: {
    //     scales: {
    //       xAxes: [{ barPercentage: 0.7,categoryPercentage: 0.5 }],
    //       yAxes: [{ ticks: { beginAtZero: false } }]
    //     },
    //     legend: { display: false }
    //   }
    //   });
    // }
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

  //todo
  masterBuildsCount(data) {
    // var count = 0;
    // for (var i=0; i < data.length; i++) {
    //   if (data[i].jobs[0].updated <= "7d 0h 0m") {
    //     count++;
    //   }
    // }
    return data.length;
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
  // Fa Icon a/c to the status
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

  // GCP Pipeline
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
    if (status === "SUCCESS") {
      return "gitlab_stage_build_success";
    }
    else if (status === "CANCELED" || status === "SKIPPED") {
      return "gitlab_stage_build_skipped";
    }
    else if (status === "PENDING") {
      return "gitlab_stage_build_pending";
    }
    else if (status === "RUNNING") {
      return "gitlab_stage_build_running";
    }
    else if (status === "FAILED") {
      return "gitlab_stage_build_failed";
    }
  }

  clickit(url) {
    window.open(url, "_blank");
  }

  public name: any;
  public image: any;
  public gitlabPipelineUrl: any;
  // public clusterCreationJobUrl: any;
  // public infraSetupJobUrl: any;
  // public clusterDeletionJobUrl: any;
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

  detailPannel(cloud, index, data) {
    if (cloud == 'GKE') {
      var pipelineData = data['pipelines'][0]
      // var length = pipelineData[index].jobs.length - 1;
      this.image = 'gke.svg'
      this.name = cloud;
      this.gitlabPipelineUrl = pipelineData[index].web_url;
      // this.clusterCreationJobUrl = pipelineData[index].jobs[0].web_url;
      // this.infraSetupJobUrl = pipelineData[index].jobs[1].web_url;
      // this.clusterDeletionJobUrl = pipelineData[index].jobs[length].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      this.pullRequest = data.build[index].commit_url
      this.status = 1;
      this.clusterSetupStatus = this.getClusterSetupStatus(pipelineData[index].jobs)
      this.providerInfraSetup = this.getProviderInfraSetupStatus(pipelineData[index].jobs)
      this.statefulAppDeploy = this.getStatefulAppDeployStatus(pipelineData[index].jobs)
      this.appFunctionTest = this.getAppFunctionTestStatus(pipelineData[index].jobs)
      this.appChaosTest = this.getAppChaosTestStatus(pipelineData[index].jobs)
      this.clusterCleanup = this.getClusterCleanupStatus(pipelineData[index].jobs)
      // this.litmus = "https://github.com/openebs/e2e-gke/tree/master/script"

    }
    else if (cloud == 'AKS') {
      var pipelineData = data['pipelines'][1]
      // var length = pipelineData[index].jobs.length - 1;
      this.image = 'aks.svg'
      this.name = cloud;
      this.gitlabPipelineUrl = pipelineData[index].web_url;
      // this.clusterCreationJobUrl = pipelineData[index].jobs[0].web_url;
      // this.infraSetupJobUrl = pipelineData[index].jobs[1].web_url;
      // this.clusterDeletionJobUrl = pipelineData[index].jobs[length].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      this.pullRequest = data.build[index].commit_url
      this.status = 2;
      this.clusterSetupStatus = this.getClusterSetupStatus(pipelineData[index].jobs)
      this.providerInfraSetup = this.getProviderInfraSetupStatus(pipelineData[index].jobs)
      this.statefulAppDeploy = this.getStatefulAppDeployStatus(pipelineData[index].jobs)
      this.appFunctionTest = this.getAppFunctionTestStatus(pipelineData[index].jobs)
      this.appChaosTest = this.getAppChaosTestStatus(pipelineData[index].jobs)
      this.clusterCleanup = this.getClusterCleanupStatus(pipelineData[index].jobs)
      // this.litmus = "https://github.com/openebs/e2e-azure/tree/master/script"
    }
    else if (cloud == 'EKS') {
      var pipelineData = data['pipelines'][2]
      // var length = pipelineData[index].jobs.length - 1;
      this.image = 'eks.svg'
      this.name = cloud;
      this.gitlabPipelineUrl = pipelineData[index].web_url;
      // this.clusterCreationJobUrl = pipelineData[index].jobs[0].web_url;
      // this.infraSetupJobUrl = pipelineData[index].jobs[1].web_url;
      // this.clusterDeletionJobUrl = pipelineData[index].jobs[length].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      this.pullRequest = data.build[index].commit_url
      this.status = 3;
      this.clusterSetupStatus = this.getClusterSetupStatus(pipelineData[index].jobs)
      this.providerInfraSetup = this.getProviderInfraSetupStatus(pipelineData[index].jobs)
      this.statefulAppDeploy = this.getStatefulAppDeployStatus(pipelineData[index].jobs)
      this.appFunctionTest = this.getAppFunctionTestStatus(pipelineData[index].jobs)
      this.appChaosTest = this.getAppChaosTestStatus(pipelineData[index].jobs)
      this.clusterCleanup = this.getClusterCleanupStatus(pipelineData[index].jobs)
      // this.litmus = "https://github.com/openebs/e2e-eks/tree/eks-test/script"
    }
    else if (cloud == 'Packet') {
      var pipelineData = data['pipelines'][3]
      // var length = pipelineData[index].jobs.length - 1;
      this.image = 'packet.svg'
      this.name = cloud;
      this.gitlabPipelineUrl = pipelineData[index].web_url;
      // this.clusterCreationJobUrl = pipelineData[index].jobs[0].web_url;
      // this.infraSetupJobUrl = pipelineData[index].jobs[1].web_url;
      // this.clusterDeletionJobUrl = pipelineData[index].jobs[length].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      this.pullRequest = data.build[index].commit_url
      this.status = 4;
      this.clusterSetupStatus = this.getClusterSetupStatus(pipelineData[index].jobs)
      this.providerInfraSetup = this.getProviderInfraSetupStatus(pipelineData[index].jobs)
      this.statefulAppDeploy = this.getStatefulAppDeployStatus(pipelineData[index].jobs)
      this.appFunctionTest = this.getAppFunctionTestStatus(pipelineData[index].jobs)
      this.appChaosTest = this.getAppChaosTestStatus(pipelineData[index].jobs)
      this.clusterCleanup = this.getClusterCleanupStatus(pipelineData[index].jobs)
      // this.litmus = "https://github.com/openebs/e2e-packet/tree/master/script"
    }
    else if (cloud == 'GCP') {
      var pipelineData = data['pipelines'][4]
      // var length = pipelineData[index].jobs.length - 1;
      this.image = 'gcp.svg'
      this.name = cloud;
      this.gitlabPipelineUrl = pipelineData[index].web_url;
      // this.clusterCreationJobUrl = pipelineData[index].jobs[0].web_url;
      // this.infraSetupJobUrl = pipelineData[index].jobs[1].web_url;
      // this.clusterDeletionJobUrl = pipelineData[index].jobs[length].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      this.pullRequest = data.build[index].commit_url
      this.status = 5;
      this.clusterSetupStatus = this.getClusterSetupStatus(pipelineData[index].jobs)
      this.providerInfraSetup = this.getProviderInfraSetupStatus(pipelineData[index].jobs)
      this.statefulAppDeploy = this.getStatefulAppDeployStatus(pipelineData[index].jobs)
      this.appFunctionTest = this.getAppFunctionTestStatus(pipelineData[index].jobs)
      this.appChaosTest = this.getAppChaosTestStatus(pipelineData[index].jobs)
      this.clusterCleanup = this.getClusterCleanupStatus(pipelineData[index].jobs)
      // this.litmus = "https://github.com/openebs/e2e-gcp/tree/master/script"
    }
    else if (cloud == 'AWS') {
      var pipelineData = data['pipelines'][5]
      // var length = pipelineData[index].jobs.length - 1;
      this.image = 'aws.svg'
      this.name = cloud;
      this.gitlabPipelineUrl = pipelineData[index].web_url;
      // this.clusterCreationJobUrl = pipelineData[index].jobs[0].web_url;
      // this.infraSetupJobUrl = pipelineData[index].jobs[1].web_url;
      // this.clusterDeletionJobUrl = pipelineData[index].jobs[length].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      this.pullRequest = data.build[index].commit_url
      this.status = 6;
      this.clusterSetupStatus = this.getClusterSetupStatus(pipelineData[index].jobs)
      this.providerInfraSetup = this.getProviderInfraSetupStatus(pipelineData[index].jobs)
      this.statefulAppDeploy = this.getStatefulAppDeployStatus(pipelineData[index].jobs)
      this.appFunctionTest = this.getAppFunctionTestStatus(pipelineData[index].jobs)
      this.appChaosTest = this.getAppChaosTestStatus(pipelineData[index].jobs)
      this.clusterCleanup = this.getClusterCleanupStatus(pipelineData[index].jobs)
      // this.litmus = "https://github.com/openebs/e2e-aws/tree/master/script"
    }
  }

  ratingCalculation(data) {
    var executed = this.executed(data);
    var passed = this.passed(data);
    var rating = ((passed/executed)*100) - 5;
    return rating + "%"
  }

  executed(data) {
    var executed = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].status === "success" || data[i].status === "failed") {
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
    var jobCount = 0;
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-SETUP") {
        jobCount ++;
        if(data[i].status == "running") {
          return "RUNNING";
        } else if(data[i].status == "failed") {
          return "FAILED";
        } else if(data[i].status == "skipped") {
          return "SKIPPED";
        } else if(data[i].status == "canceled") {
          return "CANCELED";
        } else if(data[i].status == "created" || data[i].status == "pending") {
          return "PENDING";
        } else {
          continue;
        }
      }
    }
    var successCount = 0;
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-SETUP" && data[i].status == "success") {
        successCount++;
        continue;
      }
    }
    if (jobCount == successCount) {
      return "SUCCESS";
    }
  }

  getProviderInfraSetupStatus(data) {
    var jobCount = 0;
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "PROVIDER-INFRA-SETUP") {
        jobCount ++;
        if(data[i].status == "running") {
          return "RUNNING";
        } else if(data[i].status == "failed") {
          return "FAILED";
        } else if(data[i].status == "skipped") {
          return "SKIPPED";
        } else if(data[i].status == "canceled") {
          return "CANCELED";
        } else if(data[i].status == "created" || data[i].status == "pending") {
          return "PENDING";
        } else {
          continue;
        }
      }
    }
    var successCount = 0;
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "PROVIDER-INFRA-SETUP" && data[i].status == "success") {
        successCount++;
        continue;
      }
    }
    if (jobCount == successCount) {
      return "SUCCESS";
    }
  }

  getStatefulAppDeployStatus(data) {
    var jobCount = 0;
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "STATEFUL-APP-DEPLOY") {
        jobCount ++;
        if(data[i].status == "running") {
          return "RUNNING";
        } else if(data[i].status == "failed") {
          return "FAILED";
        } else if(data[i].status == "skipped") {
          return "SKIPPED";
        } else if(data[i].status == "canceled") {
          return "CANCELED";
        } else if(data[i].status == "created" || data[i].status == "pending") {
          return "PENDING";
        } else {
          continue;
        }
      }
    }
    var successCount = 0;
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "STATEFUL-APP-DEPLOY" && data[i].status == "success") {
        successCount++;
        continue;
      }
    }
    if (jobCount == successCount) {
      return "SUCCESS";
    }
  }

  getAppFunctionTestStatus(data) {
    var jobCount = 0;
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-FUNC-TEST") {
        jobCount ++;
        if(data[i].status == "running") {
          return "RUNNING";
        } else if(data[i].status == "failed") {
          return "FAILED";
        } else if(data[i].status == "skipped") {
          return "SKIPPED";
        } else if(data[i].status == "canceled") {
          return "CANCELED";
        } else if(data[i].status == "created" || data[i].status == "pending") {
          return "PENDING";
        } else {
          continue;
        }
      }
    }
    var successCount = 0;
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-FUNC-TEST" && data[i].status == "success") {
        successCount++;
        continue;
      }
    }
    if (jobCount == successCount) {
      return "SUCCESS";
    }
  }
  getAppChaosTestStatus(data) {
    var jobCount = 0;
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-CHAOS-TEST") {
        jobCount ++;
        if(data[i].status == "running") {
          return "RUNNING";
        } else if(data[i].status == "failed") {
          return "FAILED";
        } else if(data[i].status == "skipped") {
          return "SKIPPED";
        } else if(data[i].status == "canceled") {
          return "CANCELED";
        } else if(data[i].status == "created" || data[i].status == "pending") {
          return "PENDING";
        } else {
          continue;
        }
      }
    }
    var successCount = 0;
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "APP-CHAOS-TEST" && data[i].status == "success") {
        successCount++;
        continue;
      }
    }
    if (jobCount == successCount) {
      return "SUCCESS";
    }
  }

  getClusterCleanupStatus(data) {
    var jobCount = 0;
    for (var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-CLEANUP") {
        jobCount ++;
        if(data[i].status == "running") {
          return "RUNNING";
        } else if(data[i].status == "failed") {
          return "FAILED";
        } else if(data[i].status == "skipped") {
          return "SKIPPED";
        } else if(data[i].status == "canceled") {
          return "CANCELED";
        } else if(data[i].status == "created" || data[i].status == "pending") {
          return "PENDING";
        } else {
          continue;
        }
      }
    }
    var successCount = 0;
    for(var i = 0; i < data.length; i++) {
      if(data[i].stage == "CLUSTER-CLEANUP" && data[i].status == "success") {
        successCount++;
        continue;
      }
    }
    if (jobCount == successCount) {
      return "SUCCESS";
    }
  }
}
