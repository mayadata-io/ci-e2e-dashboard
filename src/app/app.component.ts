import { Component } from '@angular/core';
import { TranslateService } from 'angular-intl';
import { DashboardData } from './services/ci-dashboard.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dashboard-ci';
  public vendor: any = false;
  constructor(public translateService: TranslateService, private ApiService: DashboardData,) {
    this.translateService.getByFileName('VENDOR', 'default-en').subscribe(value => {
      this.vendor = value;
    });
    console.log('--'.repeat(20) + 'Start' + '---'.repeat(20));

    ApiService.getMayastorTest().subscribe(res => {
      console.log(res);

    });

    // ApiService.getMayastorTest()

    console.log('--'.repeat(20) + 'END' + '---'.repeat(20));

  }

  getYear() {
    var d = new Date();
    var n = d.getFullYear();
    return n
  }
}
