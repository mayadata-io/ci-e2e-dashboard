import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { RouterModule, RouterLinkActive } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { Routing } from './app.routing';

import { PersonService } from './services/savereaddelete.service';
import { KubernetsService } from './services/kubernetes.service';
import { LitmusService } from './services/litmus.services';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TableComponent } from './table/table.component';
import { ChartComponent } from './components/chart/chart.component';
import { WorkloadDashboardComponent } from './workload-dashboard/workload-dashboard.component';
import { BannerComponent } from './components/banner/banner.component';
import { WorkloadsComponent } from './workloads/workloads.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    TableComponent,
    ChartComponent,
    WorkloadDashboardComponent,
    BannerComponent,
    WorkloadsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    NgbModule
  ],
  providers: [PersonService,KubernetsService, LitmusService,HttpClient],
  bootstrap: [AppComponent],
  exports: [RouterModule,RouterLinkActive]
})
export class AppModule { }
