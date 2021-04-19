import { Component, OnInit } from '@angular/core';
import { KubernetsService } from "../services/kubernetes.service";
// import { jiva,cstor } from "../model/data.model";
import { RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from 'angular-intl';
import { DashboardData } from "../services/ci-dashboard.service";
import { ISubscription } from "rxjs/Subscription";
import { Subscription, Observable, timer, from, pipe } from "rxjs";
import * as moment from 'moment';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public jivas = [];
  public cstors = [];
  public vendor: any = false;

  constructor(private kubernetsServices: KubernetsService, private ApiService: DashboardData, public translateService: TranslateService) {
    this.translateService.getByFileName('VENDOR', 'default-en').subscribe(value => {
      this.vendor = value;
    });
    // this.getPipeline();

  }

  ngOnInit() {
    this.getPipeline();
  }

  public Engine: string = 'cstor'
  public status: any;
  error: any;

  private statusGitlab: ISubscription;

  getPipeline() {
    // console.log('\n\n\n\n ------------------- LOg \n\n\n\n');
    this.statusGitlab = timer(0, 10000).subscribe(x => {
      this.ApiService.gitLabStatus().subscribe(res => {
        this.status = res
        // console.log("\n\n\n\tResssssss-s-s-s-s-s-s-s : ", res);
      },
        err => {
          console.log("-----\n \t -------- \n", err);

          this.error = err
        }
      )
    })
  }

  getStatusClass(s:string){
    console.log("status : :",s);
    
    if (s === 'online'){
      return "text-success"
    }else{
      return "text-danger"
    }
  }

  getTimeFormat(d){
    return 'updated : '+moment.utc(d).local().calendar();
  }

  ngOnDestroy() {
    this.statusGitlab.unsubscribe();

  }


}
