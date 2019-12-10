import { Component, OnInit, Pipe } from '@angular/core';
import { Subscription, Observable, timer, from } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import Chart from 'chart.js'
import * as moment from 'moment';
import * as dateformat from 'dateformat';
import * as $ from 'jquery';
import { DashboardData } from "../services/ci-dashboard.service";
import { Meta, Title } from '@angular/platform-browser';
import { Router } from "@angular/router";
import { TranslateService } from 'angular-intl';
@Component({
  selector: 'app-stable-release',
  templateUrl: './stable-release.component.html',
  styleUrls: ['./stable-release.component.scss']
})
export class StableReleaseComponent implements OnInit {

  constructor(private router: Router, private DashboardDatas: DashboardData, private meta: Meta, private titleService: Title, public translateService: TranslateService) {
    this.meta.addTag({ name: 'description', content: 'Openebs.ci is the CI and E2E portal for OpenEBS github PRs. Using this portal, OpenEBS community uses this portal to find the build quality against each PR that is merged. It also hosts stateful application workloads with various deployment scenarios. The example workloads include MongoDB, Percona, WordPress, Prometheus, Redis, CockroachDB etc.' });
    this.meta.addTag({ name: 'keywords', content: 'Openebs,EBS,workload,mongo,jiva,cstor' });
    this.titleService.setTitle("CI/E2E dashboard for OpenEBS");
  }


  private getData: ISubscription;
  public openshiftRelease: any;

  ngOnInit() {
    this.getData = timer(0, 5000).subscribe(x => {
      this.DashboardDatas.getOpenshiftReleaseDetails().subscribe(res => {        
        this.openshiftRelease = res;
        console.log(this.openshiftRelease);
      });
    })
  }
}
