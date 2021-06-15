import { BrowserModule,Meta, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { RouterModule, RouterLinkActive } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TranslateModule, TranslateService } from 'angular-intl';
import { AppRoutingModule } from './app.routing';

import { PersonService } from './services/savereaddelete.service';
import { KubernetsService } from './services/kubernetes.service';
import { LitmusService } from './services/litmus.services';
import { AgileService } from './services/agile.services';
import { DashboardData } from './services/ci-dashboard.service';

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
import { StableReleaseComponent } from './stable-release/stable-release.component';
import { PipelinesDashboardComponent } from './pipelines-dashboard/pipelines-dashboard.component';
import { PipelineTableComponent } from './components/pipeline-table/pipeline-table.component';
import { DoughnutGraphComponent } from './components/doughnut-graph/doughnut-graph.component';
import { PipelineDetailComponent } from './components/pipeline-detail/pipeline-detail.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { InfinitySpinnerComponent } from './components/infinity-spinner/infinity-spinner.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RunnersPageComponent } from './components/runners-page/runners-page.component';

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
    LoddingSpinnersComponent,
    StableReleaseComponent,
    PipelinesDashboardComponent,
    PipelineTableComponent,
    DoughnutGraphComponent,
    PipelineDetailComponent,
    DialogComponent,
    InfinitySpinnerComponent,
    DashboardComponent,
    RunnersPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
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
    AgileService,
    DashboardData
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule,RouterLinkActive]
})
export class AppModule {
  constructor(public translateService: TranslateService) {
    this.translateService.setDefault('default-en');
  }
 }
