import { Component, OnInit, Pipe } from '@angular/core';
import Chart from 'chart.js'
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Meta,Title } from '@angular/platform-browser';

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

  constructor(private http: HttpClient,private meta:Meta,private titleService: Title ) {
    this.host = window.location.host;
    if ((this.host.toString().indexOf("localhost") + 1) && this.host.toString().indexOf(":")) {
      this.restItemsUrl = "http://localhost:3000/";
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
    // This need to be change 
    var index = 1;
    this.getRestItems();
    setInterval(() => {
      if (index == 1) {
        var data = this.getRestItems();
        this.detailPannel('GKE', 0, data);
        index = 0;
      }
    }, 500);
    this.id = setInterval(() => {
      this.getRestItems();
    }, 10000);

    // var data = this.getRestItems();
    // this.detailPannel('GKE', 0, data)

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

    // // var colors = ['#007bff','#000000'];      
    // var donutOptions = {
    //   cutoutPercentage: 50
    // };
    // var chDonutData1 = {
    //     datasets: [
    //       {
    //         backgroundColor: ['#007bff','#000000'],
    //         borderWidth: 0,
    //         data: [70,30]
    //       }
    //     ]
    // };
    // var chDonut1 = document.getElementById("graph");
    // if (chDonut1) {
    //   new Chart(chDonut1, {
    //       type: 'pie',
    //       data: chDonutData1,
    //       options: donutOptions
    //   });

    // }
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

  masterCommitsCount(data) {
    var count = 0;
    for (var i=0; i < data.length; i++) {
      if (data[i].jobs[0].updated <= "7d 0h 0m") {
        count++;
      }
    }
    return count -1;
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

  tooltipData(index, build) {
    try {
      if (build[index].status == "success") {
        var sort_id = (build[index].sha).slice(0,8)
        return "Docker Image : " + build[index].name + "/" + sort_id
      } else if (build[index].status == "failed") {
        return "Build failed";
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

  gkestatus(i, dashboard) {
    try {
      if(dashboard.build[i].status == "success") {
        var pipeline = dashboard.pipelines[0];
        if (pipeline[i].status == "success") {
          return "fa fa-check-circle btn-txt btn-outline-success";
        }
        else if (pipeline[i].status == "canceled") {
          return "fa fa-ban btn-txt btn-outline-secondary";
        }
        else if (pipeline[i].status == "pending") {
          return "fa fa-clock-o btn-txt btn-outline-warning";
        }
        else if (pipeline[i].status == "failed") {
          var count = 0;
          for (var j = 0; j < pipeline[i].jobs.length; j++) {
            if(pipeline[i].jobs[j].status == "success") {
              count++;
            }
          }
          var percentage = (count/pipeline[i].jobs.length)*100;
          if (percentage > 50) {
            return "fa fa-check-circle btn-txt btn-outline-success btn-status-warning";
          } else {
            return "fa fa-exclamation-triangle btn-txt btn-outline-danger";
          }
        }
        else if (pipeline[i].status == "running") {
          return "fa fa-circle-o-notch btn-txt fa-spin btn-outline-primary";
        }
      } else if (dashboard.build[i].status == "running") {
          return "fa fa-clock-o btn-txt btn-outline-warning custom-pointer";
      } else {
        return "fa fa-ban btn-txt btn-outline-secondary custom-pointer";
      }
    }
    catch {
      return "n/a";
    }
  }
  aksstatus(i, dashboard) {
    try {
      if(dashboard.build[i].status == "success") {
        var pipelines = dashboard.pipelines[1];
      if (pipelines[i].status == "success") {
        return "fa fa-check-circle btn-txt btn-outline-success";
      }
      else if (pipelines[i].status == "canceled") {
        return "fa fa-ban btn-txt btn-outline-secondary";
      }
      else if (pipelines[i].status == "pending") {
        return "fa fa-clock-o btn-txt btn-outline-warning";
      }
      else if (pipelines[i].status == "failed") {
        var count = 0;
        for (var j = 0; j < pipelines[i].jobs.length; j++) {
          if(pipelines[i].jobs[j].status == "success") {
            count++;
          }
        }
        var percentage = (count/pipelines[i].jobs.length)*100;
        if (percentage > 50) {
          return "fa fa-check-circle btn-txt btn-outline-success btn-status-warning";
        } else {
          return "fa fa-exclamation-triangle btn-txt btn-outline-danger";
        }
      }
      else if (pipelines[i].status == "running") {
        return "fa fa-circle-o-notch btn-txt fa-spin btn-outline-primary";
      } 
    } else if (dashboard.build[i].status == "running") {
      return "fa fa-clock-o btn-txt btn-outline-warning custom-pointer";
  } else {
        return "fa fa-ban btn-txt btn-outline-secondary custom-pointer";
      }
    }
    catch {
      return "N/A";
    }
  }
  eksstatus(i, dashboard) {
    try {
      if(dashboard.build[i].status == "success") {
        var pipelines = dashboard.pipelines[2];

      if (pipelines[i].status == "success") {
        return "fa fa-check-circle btn-txt btn-outline-success";
      }
      else if (pipelines[i].status == "canceled") {
        return "fa fa-ban btn-txt btn-outline-secondary";
      }
      else if (pipelines[i].status == "pending") {
        return "fa fa-clock-o btn-txt btn-outline-warning";
      }
      else if (pipelines[i].status == "failed") {
                var count = 0;
        for (var j = 0; j < pipelines[i].jobs.length; j++) {
          if(pipelines[i].jobs[j].status == "success") {
            count++;
          }
        }
        var percentage = (count/pipelines[i].jobs.length)*100;
        if (percentage > 50) {
          return "fa fa-check-circle btn-txt btn-outline-success btn-status-warning";
        } else {
          return "fa fa-exclamation-triangle btn-txt btn-outline-danger";
        }
      }
      else if (pipelines[i].status == "running") {
        return "fa fa-circle-o-notch btn-txt fa-spin btn-outline-primary";
      }
    } else if (dashboard.build[i].status == "running") {
      return "fa fa-clock-o btn-txt btn-outline-warning custom-pointer";
  } else {
      return "fa fa-ban btn-txt btn-outline-secondary custom-pointer";
    }
    }
    catch {
      return "N/A";
    }
  }
  packetstatus(i, dashboard) {
    try {
      if(dashboard.build[i].status == "success") {
        var pipelines = dashboard.pipelines[3];

      if (pipelines[i].status == "success") {
        return "fa fa-check-circle btn-txt btn-outline-success";
      }
      else if (pipelines[i].status == "canceled") {
        return "fa fa-ban btn-txt btn-outline-secondary";
      }
      else if (pipelines[i].status == "pending") {
        return "fa fa-clock-o btn-txt btn-outline-warning";
      }
      else if (pipelines[i].status == "failed") {
                var count = 0;
        for (var j = 0; j < pipelines[i].jobs.length; j++) {
          if(pipelines[i].jobs[j].status == "success") {
            count++;
          }
        }
        var percentage = (count/pipelines[i].jobs.length)*100;
        if (percentage > 50) {
          return "fa fa-check-circle btn-txt btn-outline-success btn-status-warning";
        } else {
          return "fa fa-exclamation-triangle btn-txt btn-outline-danger";
        }
      }
      else if (pipelines[i].status == "running") {
        return "fa fa-circle-o-notch btn-txt fa-spin btn-outline-primary";
      }
    } else if (dashboard.build[i].status == "running") {
      return "fa fa-clock-o btn-txt btn-outline-warning custom-pointer";
  }else {
      return "fa fa-ban btn-txt btn-outline-secondary custom-pointer";
    }
    }
    catch {
      return "N/A";
    }
  }
  gcpstatus(i, dashboard) {
    try {
      if(dashboard.build[i].status == "success") {
        var pipelines = dashboard.pipelines[4];
      if (pipelines[i].status == "success") {
        return "fa fa-check-circle btn-txt btn-outline-success";
      }
      else if (pipelines[i].status == "canceled") {
        return "fa fa-ban btn-txt btn-outline-secondary";
      }
      else if (pipelines[i].status == "pending") {
        return "fa fa-clock-o btn-txt btn-outline-warning";
      }
      else if (pipelines[i].status == "failed") {
                var count = 0;
        for (var j = 0; j < pipelines[i].jobs.length; j++) {
          if(pipelines[i].jobs[j].status == "success") {
            count++;
          }
        }
        var percentage = (count/pipelines[i].jobs.length)*100;
        if (percentage > 50) {
          return "fa fa-check-circle btn-txt btn-outline-success btn-status-warning";
        } else {
          return "fa fa-exclamation-triangle btn-txt btn-outline-danger";
        }
      }
      else if (pipelines[i].status == "running") {
        return "fa fa-circle-o-notch btn-txt fa-spin btn-outline-primary";
      }
    } else if (dashboard.build[i].status == "running") {
      return "fa fa-clock-o btn-txt btn-outline-warning custom-pointer";
  }else {
      return "fa fa-ban btn-txt btn-outline-secondary custom-pointer";
    }
    }
    catch {
      return "N/A";
    }
  }

  awsstatus(i, dashboard) {
    try {
      if(dashboard.build[i].status == "success") {
        var pipelines = dashboard.pipelines[5];
      if (pipelines[i].status == "success") {
        return "fa fa-check-circle btn-txt btn-outline-success";
      }
      else if (pipelines[i].status == "canceled") {
        return "fa fa-ban btn-txt btn-outline-secondary";
      }
      else if (pipelines[i].status == "pending") {
        return "fa fa-clock-o btn-txt btn-outline-warning";
      }
      else if (pipelines[i].status == "failed") {
                var count = 0;
        for (var j = 0; j < pipelines[i].jobs.length; j++) {
          if(pipelines[i].jobs[j].status == "success") {
            count++;
          }
        }
        var percentage = (count/pipelines[i].jobs.length)*100;
        if (percentage > 50) {
          return "fa fa-check-circle btn-txt btn-outline-success btn-status-warning";
        } else {
          return "fa fa-exclamation-triangle btn-txt btn-outline-danger";
        }
      }
      else if (pipelines[i].status == "running") {
        return "fa fa-circle-o-notch btn-txt fa-spin btn-outline-primary";
      }
    } else if (dashboard.build[i].status == "running") {
      return "fa fa-clock-o btn-txt btn-outline-warning custom-pointer";
  }else {
      return "fa fa-ban btn-txt btn-outline-secondary custom-pointer";
    }
    }
    catch {
      return "N/A";
    }
  }

  clickit(url) {
    window.open(url, "_blank");
  }

  public name: any;
  public image: any;
  public gitlab_url: any;
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

  detailPannel(cloud, index, data) {
    if (cloud == 'GKE') {
      // console.log(data);
      var pipelineData = data['pipelines'][0]
      this.image = 'gke.svg'
      this.name = cloud;
      this.gitlab_url = pipelineData[index].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      // this.baseline = ""
      this.litmus = "https://github.com/openebs/e2e-gke/tree/master/script"
    }
    else if (cloud == 'AKS') {
      var pipelineData = data['pipelines'][1]
      this.image = 'aks.svg'
      this.name = cloud;
      this.gitlab_url = pipelineData[index].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      // this.baseline = this.commitUsr(data.build[index].jobs[0].commit)
      this.litmus = "https://github.com/openebs/e2e-azure/tree/master/script"
    }
    else if (cloud == 'EKS') {
      var pipelineData = data['pipelines'][2]
      this.image = 'eks.svg'
      this.name = cloud;
      this.gitlab_url = pipelineData[index].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      // this.baseline = this.commitUsr(data.build[index].jobs[0].commit)
      this.litmus = "https://github.com/openebs/e2e-eks/tree/eks-test/script"
    }
    else if (cloud == 'Packet') {
      var pipelineData = data['pipelines'][3]
      this.image = 'packet.svg'
      this.name = cloud;
      this.gitlab_url = pipelineData[index].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      // this.baseline = this.commitUsr(data.build[index].jobs[0].commit)
      this.litmus = "https://github.com/openebs/e2e-packet/tree/master/script"
    }
    else if (cloud == 'GCP') {
      var pipelineData = data['pipelines'][4]
      this.image = 'gcp.svg'
      this.name = cloud;
      this.gitlab_url = pipelineData[index].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      // this.baseline = this.commitUsr(data.build[index].jobs[0].commit)
      this.litmus = "https://github.com/openebs/e2e-gcp/tree/master/script"
    }
    else if (cloud == 'AWS') {
      var pipelineData = data['pipelines'][5]
      this.image = 'aws.svg'
      this.name = cloud;
      this.gitlab_url = pipelineData[index].web_url;
      this.log_url = pipelineData[index].log_link;
      this.totalJobs = pipelineData[index].jobs.length;
      this.executedJobs = this.executed(pipelineData[index].jobs)
      this.passedJobs = this.passed(pipelineData[index].jobs)
      this.failedJobs = this.failed(pipelineData[index].jobs)
      this.commitMessage = this.commitMess(data.build[index].jobs[0].commit)
      this.commitUser = this.commitUsr(data.build[index].jobs[0].commit)
      this.rating = this.ratingCalculation(pipelineData[index].jobs)
      // this.baseline = this.commitUsr(data.build[index].jobs[0].commit)
      this.litmus = "https://github.com/openebs/e2e-aws/tree/master/script"
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
}