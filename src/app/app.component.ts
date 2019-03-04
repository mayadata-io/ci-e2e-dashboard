import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from 'angular-intl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dashboard-ci';
  public vendor: any = false;
  constructor(public translateService: TranslateService) {
    this.translateService.getByFileName('VENDOR', 'default-en').subscribe(value => {
      this.vendor = value;
    });
   }
}
