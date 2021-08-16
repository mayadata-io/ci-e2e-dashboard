import { Component, OnInit } from '@angular/core';
import { DashboardData } from 'src/app/services/ci-dashboard.service';
import { Status } from 'src/app/model/enum.model';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';



@Component({
  selector: 'app-mayastor',
  templateUrl: './mayastor.component.html',
  styleUrls: ['./mayastor.component.css']
})
export class MayastorComponent implements OnInit {
  data: any;
  mySubscription: any;

  constructor(private ApiService: DashboardData, private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {

    this.ApiService.getMayastorTest().subscribe((res) => {
      this.data = res;
    }, (err) => {
      console.log('Unable to access mayastor endpoint', err);
    });

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
  convertTime(value) {
    const unixTime = value.substr(0, 10);
    const convertedTime = moment.unix(unixTime).calendar();
    return convertedTime;
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  goToURL(title, reference) {
    let url: string;
    if (title === 'Jira') {
      const jiraUrl = 'https://mayadata.atlassian.net/browse/';
      const issueUrl = jiraUrl + reference;
      url = issueUrl;
    } else if (title === 'Jenkins') {
      url = reference;
    }
    const encode = encodeURIComponent(url);
    this.router.navigateByUrl(`/redirectto/${encode}`);
  }
}

