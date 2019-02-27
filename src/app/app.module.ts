import { BrowserModule,Meta, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { RouterModule, RouterLinkActive } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TranslateModule, TranslateService } from 'angular-intl';
import { Routing } from './app.routing';

import { PersonService } from './services/savereaddelete.service';
import { KubernetsService } from './services/kubernetes.service';
import { LitmusService } from './services/litmus.services';
import { AgileService } from './services/agile.services';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TableComponent } from './table/table.component';
import { ChartComponent } from './components/chart/chart.component';
import { WorkloadDashboardComponent } from './workload-dashboard/workload-dashboard.component';
import { BannerComponent } from './components/banner/banner.component';
import { WorkloadsComponent } from './workloads/workloads.component';
import { OverviewComponent } from './overview/overview.component';
import { LoddingSpinnersComponent } from './components/lodding-spinners/lodding-spinners.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    TableComponent,
    ChartComponent,
    WorkloadDashboardComponent,
    BannerComponent,
    WorkloadsComponent,
    OverviewComponent,
    LoddingSpinnersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    TranslateModule.forRoot({ path: '/assets/languages/' })
  ],
  providers: [
    PersonService,
    KubernetsService,
    LitmusService,
    HttpClient,
    Meta,
    Title,
    AgileService
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule,RouterLinkActive]
})
export class AppModule {
  constructor(public translateService: TranslateService) {
    const defaultPrefix = 'default';
    const browserLanguage = this.translateService.getBrowserLanguage();
    this.translateService.setDefault(`${defaultPrefix}-${browserLanguage}`);
  }
 }
