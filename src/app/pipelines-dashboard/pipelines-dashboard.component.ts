import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { DashboardData } from "../services/ci-dashboard.service";
import { ISubscription } from "rxjs/Subscription";
import { platform } from 'process';



@Component({
  selector: 'app-pipelines-dashboard',
  templateUrl: './pipelines-dashboard.component.html',
  styleUrls: ['./pipelines-dashboard.component.scss']
})
export class PipelinesDashboardComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }
  public Engine: string;
  public Platform : string = "openshift";

  ngOnInit() {
    this.Engine = this.activatedRoute.snapshot.paramMap.get('engine');
    // this.Platform = this.activatedRoute.snapshot.paramMap.get('platform');
    let url = window.location.pathname.split('/')
    let branch:string = url[2]
    this.Platform = url[3]
    if (this.Engine == "release-branch"){
      this.Engine = "ZFS-LocalPV"
    }
  }
  // public PlatformActive : string = "openshift";
  testFunc(p:string) {
    // console.log("\n\n\n Platform : " + this.Platform + " funcParam : "+ p );
    // this.Platform = this.activatedRoute.snapshot.paramMap.get('platform');
    if (this.Platform == p){
    return 'bg-primary shadow text-white'
    }else{
      return ''
    }
  }

}
