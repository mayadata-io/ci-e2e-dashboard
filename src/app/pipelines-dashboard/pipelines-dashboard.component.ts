import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { DashboardData } from "../services/ci-dashboard.service";
import { ISubscription } from "rxjs/Subscription";



@Component({
  selector: 'app-pipelines-dashboard',
  templateUrl: './pipelines-dashboard.component.html',
  styleUrls: ['./pipelines-dashboard.component.scss']
})
export class PipelinesDashboardComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }
  public Engine: string;
  ngOnInit() {
    this.Engine = this.activatedRoute.snapshot.paramMap.get('engine');
  }
}
