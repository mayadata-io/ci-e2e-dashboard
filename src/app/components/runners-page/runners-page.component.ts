import { Component, OnInit } from '@angular/core';
import { DashboardData } from "../../services/ci-dashboard.service";


@Component({
  selector: 'app-runners-page',
  templateUrl: './runners-page.component.html',
  styleUrls: ['./runners-page.component.scss']
})
export class RunnersPageComponent implements OnInit {

  constructor(private ApiService: DashboardData) { }
  public RunnersArray: any;

  ngOnInit() {
    this.ApiService.getAnyEndpointData("/runners").subscribe(res => {
      console.log(res);
      this.RunnersArray = res
    },
      err => { console.log("Error on fetching runners data : \t", err) }

    )
  }
}
