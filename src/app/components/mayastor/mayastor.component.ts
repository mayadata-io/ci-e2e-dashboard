import { Component, OnInit } from '@angular/core';
import { DashboardData } from 'src/app/services/ci-dashboard.service';

@Component({
  selector: 'app-mayastor',
  templateUrl: './mayastor.component.html',
  styleUrls: ['./mayastor.component.css']
})
export class MayastorComponent implements OnInit {
  data: any;
  constructor(private ApiService: DashboardData,) {
    ApiService.getMayastorTest().subscribe(res => {
      this.data = res;
    }, err => { console.log('Unable to get mayastor endpoint', err); });
  }

  ngOnInit(): void {
  }

}
