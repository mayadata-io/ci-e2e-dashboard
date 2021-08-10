import { Component, OnInit } from '@angular/core';
import { DashboardData } from 'src/app/services/ci-dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from 'src/app/model/enum.model';


@Component({
  selector: 'app-mayastor',
  templateUrl: './mayastor.component.html',
  styleUrls: ['./mayastor.component.css']
})
export class MayastorComponent implements OnInit {
  data: any;
  constructor(private ApiService: DashboardData, private router: Router) {
    ApiService.getMayastorTest().subscribe((res) => {
      this.data = res;
    }, (err) => {
      console.log('Unable to access mayastor endpoint', err);
    });
  }

  ngOnInit(): void {
  }

  getStatus(tests) {
    if (tests) {
      const failed = tests.filter(test => test.status === Status.Failed).length;
      if (failed !== 0) {
        return Status.Failed;
      } else {
        return Status.Passed;
      }
    }
  }
}

