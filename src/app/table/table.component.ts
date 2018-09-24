import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit {
  id: any;
  restItems: any;
  restItemsUrl = "https://openebs.ci/api/";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRestItems();
    this.id = setInterval(() => {
      this.getRestItems();
    }, 5000);
  }
  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
  // Read all REST Items
  getRestItems(): void {
    this.restItemsServiceGetRestItems().subscribe(restItems => {
      this.restItems = restItems;
      console.log(this.restItems);
    });
  }

  // Rest Items Service: Read all REST Items
  restItemsServiceGetRestItems() {
    return this.http.get<any[]>(this.restItemsUrl).pipe(map(data => data));
  }
  // Button Class Name a/c to the status
  buttonClass(post) {
    if (post.status == "success") return "btn btn-sqr btn-outline-success";
    else if (post.status == "pending") return "btn btn-sqr btn-outline-warning";
    else if (post.status == "canceled") return "btn btn-sqr btn-outline-secondary";
    else if (post.status == "failed") {
      var status = this.pipelinePercentage(post)
      if (status > 50) {
        return "btn btn-sqr btn-outline-success";
      } else {
        return "btn btn-sqr btn-outline-danger";
      }
    }
    else if (post.status == "running") return "btn btn-sqr btn-outline-primary";
    else if (post.status == "N/A") return "btn btn-sqr btn-outline-cancel disabled";
  }

  pipelinePercentage(post) {
    var totaljobs = 0;
    var passedjobs = 0;
    try {
      for (var job in post.jobs) {
        var allpost = post.jobs[job];
        totaljobs += 1;
        if (allpost.status === "success") {
          passedjobs += 1;
        }
      }
    } catch {
      return "N/A";
    }
    var totalPercentage = (passedjobs/totaljobs) * 100;
    return totalPercentage;
  }

  // Fa Icon a/c to the status
  iconClass(status) {
    if (status == "success") return "fa fa-check-circle";
    if (status == "canceled") return "fa fa-ban";
    else if (status == "pending") return "fa fa-clock-o";
    else if (status == "failed") return "fa fa-exclamation-triangle";
    else if (status == "running") return "fa fa-circle-o-notch fa-spin";
  }
  buttonStatusClass(status) {
    if (status == "success") return "btn btn-txt btn-outline-success disabled";
    else if (status == "pending")
      return "btn btn-txt btn-outline-warning disabled";
    else if (status == "canceled")
      return "btn btn-txt btn-outline-secondary disabled";
    else if (status == "failed")
      return "btn btn-txt btn-outline-danger disabled";
    else if (status == "running")
      return "btn btn-txt btn-outline-primary disabled";
    else if (status == "N/A")
      return "btn btn-txt btn-cancel btn-outline-dark disabled";
  }

  clickit(url) {
    window.open(url, "_blank");
  }

  goTo(url) {
    return url;
  }

  length(obj) {
    // console.log(obj.length);

    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    console.log("objectLength=" + size);
    return size;
    // return obj.length;
  }

  // GCP Pipeline
  // This function extracts the Run status in GCP pipeline using current index
  gcpStatus(index, gcpItems, type) {
    try {
      if (gcpItems[index].status) {
        if (type == 'statusbutton') {
          return gcpItems[index].status;
        } else {
          return gcpItems[index];
        }
      } else {
        return "N/A";
      }
    } catch (e) {
      return "N/A";
    }
  }

  // gcpWeburl returns the URL of the gitlab pipeline for GCP using current index
  gcpWeburl(index, gcpItems) {
    try {
      if (gcpItems[index].web_url) {
        return gcpItems[index].web_url;
      } else {
        return "#";
      }
    } catch (e) {
      return "#";
    }
  }

  // gcpLogurl returns the URL of the Kibana Dashboard, EYE, for GCP using current index
  gcpLogurl(index, gcpItems) {
    try {
      if (gcpItems[index].log_link) {
        return gcpItems[index].log_link;
      } else {
        return "#";
      }
    } catch (e) {
      return "#";
    }
  }
  // END of GCP

  // azure Pipeline
  // This function extracts the Run status in azure pipeline using current index
  azureStatus(index, azureItems, type) {
    try {
      if (azureItems[index].status) {
        if (type == 'statusbutton') {
          return azureItems[index].status;
        } else {
          return azureItems[index];
        }
      } else {
        return "N/A";
      }
    } catch (e) {
      return "N/A";
    }
  }

  // azureWeburl returns the URL of the gitlab pipeline for azure using current index
  azureWeburl(index, azureItems) {
    try {
      if (azureItems[index].web_url) {
        return azureItems[index].web_url;
      } else {
        return "#";
      }
    } catch (e) {
      return "#";
    }
  }

  // azureLogurl returns the URL of the Kibana Dashboard, EYE, for azure using current index
  azureLogurl(index, azureItems) {
    try {
      if (azureItems[index].log_link) {
        return azureItems[index].log_link;
      } else {
        return "#";
      }
    } catch (e) {
      return "#";
    }
  }
  // END of azure

  // getCommit returns commit id
  getCommit(index, commits) {
    try {
      if (commits[index].short_id) {
        return "Cron/#" + commits[index].short_id;
      } else {
        return "N/A";
      }
    } catch (e) {
      return "N/A";
    }
  }

  // getCommitUrl returns link to the commit on Github
  getCommitUrl(index, commits) {
    try {
      if (commits[index].short_id) {
        return commits[index].commit_url;
      } else {
        return "N/A";
      }
    } catch (e) {
      return "N/A";
    }
  }
  getLastUpdated() {
    return this.restItems.dashboard.last_updated;
  }

  tooltipStatus(i, platformItems) {
    var totalJobs = 0;
    var passedjobs = 0;
    try {
      for (var job in platformItems[i].jobs) {
        var allplatformItems = platformItems[i].jobs[job];
        totalJobs += 1;
        if (allplatformItems.status === "success") {
          passedjobs += 1;
        }
      }
    } catch {
      return "N/A";
    }
    var toolTipMessage = passedjobs + " out of " + totalJobs + " Jobs Passed ";
    return toolTipMessage;
  }

  passStatus(i, platformItems) {
    var totaljobs = 0;
    var passedjobs = 0;
    try {
      // if (platformItems[i].status == "running") {
      //   return;
      // }
      //  if (platformItems[i].status == "canceled") {
      //   return;
      // }
       if (platformItems[i].status == "pending") {
        return;
      }
      for (var job in platformItems[i].jobs) {
        var allplatformItems = platformItems[i].jobs[job];
        totaljobs += 1;
        if (allplatformItems.status === "success") {
          passedjobs += 1;
        }
      }
    } catch {
      return "N/A";
    }
    return passedjobs + "/" + totaljobs;
  }
}
