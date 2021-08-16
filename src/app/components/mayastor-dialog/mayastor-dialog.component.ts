import { Component, OnInit } from '@angular/core';
import { DashboardData } from 'src/app/services/ci-dashboard.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-mayastor-dialog',
  templateUrl: './mayastor-dialog.component.html',
  styleUrls: ['./mayastor-dialog.component.scss']
})
export class MayastorDialogComponent implements OnInit {
  public issueID: any;
  public testData: any;
  passed: any;
  failed: any;
  constructor(private activatedRoute: ActivatedRoute, private ApiService: DashboardData) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.issueID = params.id;
    });
    this.ApiService.getMayastorTest().subscribe((res) => {
      const tests = res.filter((test) => test.id === this.issueID);
      this.testData = tests[0];
      this.passed = this.testData.tests.filter((test) => test.status === 'PASSED').length;
      this.failed = this.testData.tests.filter((test) => test.status === 'FAILED').length;
    });
  }
  //  StatusIcon function handles the test status ;
  //  Api contains 2 types of state till now -
  //  TODO: Need to have running ,pending and cancelled status from
  //  - server and accoring to state write more state checks in  below function ,
  statusIcon(status) {
    switch (status) {
      case 'PASSED':
        return 'far fa-check-circle text-success mx-2 font-size-18';
      case 'FAILED':
        return 'far fa-times-circle text-danger mx-2 font-size-18';
    }
  }
}
