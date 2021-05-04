import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-doughnut-graph',
  templateUrl: './doughnut-graph.component.html',
  styleUrls: ['./doughnut-graph.component.css']
})
export class DoughnutGraphComponent implements OnInit {
  @Input() pipeline: any;
  @Input() size:any;

  constructor() { }

  ngOnInit() {
    this.size=Number(this.size)
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

  getJobPercentForPipeline(data) {
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


}
