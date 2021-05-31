import { Component, OnInit } from '@angular/core';
import { DashboardData } from "../../services/ci-dashboard.service";
import * as moment from 'moment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private ApiService: DashboardData) { }

  public recentData:any =[];


  ngOnInit() {

    this.ApiService.getAnyEndpointData("/recent").subscribe(res => {
      console.log(res);
      this.recentData=res
      
    })

  }
  getName(ID:string){
    switch(ID){
      case "36":
        return "Openshift"
      case "34":
        return "Konvoy"
      case "43":
        return "nativeK8s"
      default:
        break;
    }

  }

  getImage(projectID:string){
    switch (projectID) {
      case "36":
        return '/assets/images/cloud/openshift.png'
      case "34":
        return '/assets/images/cloud/konvoy.png'
      case "43":
        return '/assets/images/cloud/nativek8s.png'
      default:
        break;
    }
  }
  timeConverter(t) {
    try {
      var date = t
      var dateFormat = moment.utc(date).local().calendar();
      return dateFormat
    } catch (error) {
      console.log("error", error);
      return "_";
    }
  }

}
