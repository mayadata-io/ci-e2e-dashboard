import { BrowserModule,Meta, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { RouterModule, RouterLinkActive } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TranslateModule, TranslateService } from 'angular-intl';
import { AppRoutingModule } from './app.routing';
import { DashboardData } from './services/ci-dashboard.service';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChartComponent } from './components/chart/chart.component';
import { BannerComponent } from './components/banner/banner.component';
import { LoddingSpinnersComponent } from './components/lodding-spinners/lodding-spinners.component';
import { PipelinesDashboardComponent } from './components/pipelines-dashboard/pipelines-dashboard.component';
import { PipelineTableComponent } from './components/pipeline-table/pipeline-table.component';
import { DoughnutGraphComponent } from './components/doughnut-graph/doughnut-graph.component';
import { PipelineDetailComponent } from './components/pipeline-detail/pipeline-detail.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { InfinitySpinnerComponent } from './components/infinity-spinner/infinity-spinner.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ChartComponent,
    BannerComponent,
    LoddingSpinnersComponent,
    PipelinesDashboardComponent,
    PipelineTableComponent,
    DoughnutGraphComponent,
    PipelineDetailComponent,
    DialogComponent,
    InfinitySpinnerComponent,
    DashboardComponent,
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
    HttpClient,
    Meta,
    Title,
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
