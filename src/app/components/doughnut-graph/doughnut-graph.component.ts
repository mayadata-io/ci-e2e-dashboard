import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-doughnut-graph',
  templateUrl: './doughnut-graph.component.html',
  styleUrls: ['./doughnut-graph.component.css']
})
export class DoughnutGraphComponent implements OnInit {
  @Input() pipeline: any;
  @Input() size: any;
  @Input() engine: any;

  constructor() { }

  ngOnInit() {
    this.size = Number(this.size);
  }
  pipelineTooltip(data) {
    try {
      if (data.status == "running") {
        return "running"
      } else if (data.status == "skipped" || data.status == "canceled") {
        return data.status
      } else if (data.status == "none") {
        return ""
      } else {
        const passedJobs = this.jobStatusCount(data.jobs, 'success')
        const failedJobs = this.jobStatusCount(data.jobs, 'failed')
        const canceledJobs = this.jobStatusCount(data.jobs, 'canceled')
        return `Success: ${passedJobs},\nFailed: ${failedJobs},\nCanceled: ${canceledJobs}`;
      }
    } catch (e) {
      return "n/a"
    }
  }

  jobStatusCount(data, status) {
    let passed = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].status === (status)) {
        passed = passed + 1;
      }
    }
    return passed;
  }

  getJobPercentForPipeline(data) {
    try {
      if (data.status == "success") {
        return "99 1";
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
        let totalJobs = data.jobs.filter(j => j.status == 'success' || j.status == 'failed')
        var percentage = (count / totalJobs.length) * 100;
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

  getJobPercentForPipelineDoughnut(data, returnFor) {
    try {
      if (data.status == "success") {
        return "99 1";
      }
      else if (data.status == "pending") {
        return "0 0";
      }
      else if (data.status == "failed" || data.status == "canceled" || data.status == "skipped") {
        var count = 0;
        var skippedCancelledCount = 0;
        for (var j = 0; j < data.jobs.length; j++) {
          if (data.jobs[j].status == "success") {
            count++;
          }
          else if (data.jobs[j].status == "canceled" || data.jobs[j].status == "skipped") {
            skippedCancelledCount++;
          }

        }

        // let totalJobs = data.jobs.filter(j => j.status == 'success' || j.status == 'failed')
        // console.log(`filterJobs : -> ${totalJobs.length} |  ${data.jobs.length}`);

        var percentageSuccess = (count / data.jobs.length) * 100;
        var percentageCanceled = (skippedCancelledCount / data.jobs.length) * 100;
        if (returnFor == 'success') {
          return `${percentageSuccess} ${100 - percentageSuccess}`
        } else if (returnFor == 'canceled') {
          return `${percentageCanceled + percentageSuccess} ${100 - (percentageCanceled + percentageSuccess)}`
        }
      }
      else if (data.status == "running") {
        return "95 5";
      }
    }
    catch {
      return "0 0";
    }
  }

  getStatusMayastor(tests) {
    try {
      const passedCount = tests.filter((res) => res.status === 'PASSED').length;
      const totalTestsCount = tests.length;
      const percentage = (passedCount / totalTestsCount) * 100;
      if (passedCount === 0) {
        return `0 0`;
      }
      return `${percentage} ${100 - percentage}`;
    } catch (error) {
      console.log('\t Error', error);
      return `100 0`;
    }
  }
  genMayastorTooltip(tests) {
    try {
      const passedCount = tests.filter((res) => res.status === 'PASSED').length;
      const failedCount = tests.filter((res) => res.status === 'FAILED').length;
      return `Passed: ${passedCount} , Failed: ${failedCount}`;
    } catch (error) {
      console.log(error);
      return 'NA';
    }
  }


}
