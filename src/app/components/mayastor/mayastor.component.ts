import { Component, OnInit } from '@angular/core';
import { DashboardData } from 'src/app/services/ci-dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-mayastor',
  templateUrl: './mayastor.component.html',
  styleUrls: ['./mayastor.component.css']
})
export class MayastorComponent implements OnInit {
  data: any;
  constructor(private ApiService: DashboardData,private router: Router) {
    ApiService.getMayastorTest().subscribe((res) => {
      this.data = res;
    }, (err) => {
      console.log('Unable to access mayastor endpoint', err);
    });
  }

  ngOnInit(): void {
    console.log('maystor component :)');
  }

  getStatus(tests) {
    try {
      if (tests) {
        const failed = tests.filter(test => test.status === 'FAILED').length;
        if (failed !== 0) {
          return 'FAILED';
        } else {
          return 'PASSED';
        }
      }
    } catch (error) {
      return '_';
    }
  }

  goToDialog(id,data) {
    this.router.navigate([`/${id}`], {state: data});

  }
}

