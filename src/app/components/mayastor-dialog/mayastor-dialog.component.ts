import { Component, OnInit } from '@angular/core';
import { DashboardData } from 'src/app/services/ci-dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-mayastor-dialog',
  templateUrl: './mayastor-dialog.component.html',
  styleUrls: ['./mayastor-dialog.component.scss']
})
export class MayastorDialogComponent implements OnInit {
  public issueID: Number;
  public testData: any;
  constructor(private activatedRoute: ActivatedRoute, private ApiService: DashboardData) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.issueID = params.id;
      console.log(params.id);
    });
    this.ApiService.getMayastorTest().subscribe((res) => {
      const tests = res.filter((test) => test.issueId === this.issueID);
      
      this.testData = tests[0];
      console.log(this.testData);

    });
  }

  statusIcon(status) {
    switch (status) {
      case 'PASSED':
        return 'far fa-check-circle text-success mx-2 font-size-18';
      case 'FAILED':
        return 'far fa-times-circle text-danger mx-2 font-size-18';
      case 'running':
        return 'fas fa-circle-notch text-primary mx-2 font-size-18 fa-spin';
      case 'skipped':
        return 'fas fa-angle-double-right text-secondary mx-2 font-size-18';
      case 'canceled':
        return 'fas fa-ban text-muted mx-2 font-size-18';
      default:
        return 'far fa-dot-circle text-warning mx-2 font-size-18';
    }
  }
}
