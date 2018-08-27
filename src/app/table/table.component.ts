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
  buttonClass(status) {
    if (status == "success") return "btn btn-sqr btn-outline-success";
    else if (status == "pending") return "btn btn-sqr btn-outline-warning";
    else if (status == "canceled") return "btn btn-sqr btn-outline-secondary";
    else if (status == "failed") return "btn btn-sqr btn-outline-danger";
    else if (status == "running") return "btn btn-sqr btn-outline-primary";
    else if (status == "N/A") return "btn btn-sqr btn-cancel";
  }

  // Fa Icon a/c to the status
  iconClass(status) {
    if (status == "success") return "fa fa-check-circle";
    if (status == "canceled") return "fa fa-ban";
    else if (status == "pending") return "fa fa-clock-o";
    else if (status == "failed") return "fa fa-exclamation-triangle";
    else if (status == "running") return "fa fa-circle-o-notch fa-spin";
    console.log("test");
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
    else if (status == "N/A") return "btn btn-txt btn-cancel disabled";
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
  gcpStatus(index, gcpItems) {
    try {
      if (gcpItems[index].status) {
        return gcpItems[index].status;
      } else {
        return "N/A";
      }
    } catch (e) {
      return "N/A";
    }

    // console.log("index is "+ JSON.stringify(gcpItems.status));
  }
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

    // console.log("index is "+ JSON.stringify(gcpItems.status));
  }

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

    // console.log("index is "+ JSON.stringify(gcpItems.status));
  }

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

    // console.log("index is "+ JSON.stringify(gcpItems.status));
  }

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

    // console.log("index is "+ JSON.stringify(gcpItems.status));
  }
  getLastUpdated() {
    return this.restItems.dashboard.last_updated;
  }

  getJobStatus(jobs) {
    // console.log(post.web_url);
    // Total Chaos Jobs
    var totalChaos = 0;
    var passedChaos = 0;
    for (var job in jobs) {
      console.log(JSON.stringify(jobs[job].id));
      var allJobs = jobs[job];
      if (allJobs.stage === "chaos-test") {
        totalChaos += 1;
        if (allJobs.status === "success") {
          passedChaos += 1;
        }
      }
    }
    var toolTipMessage =
      passedChaos + "/" + totalChaos + " Litmus Chaos passed";
    return toolTipMessage;
  }
}
