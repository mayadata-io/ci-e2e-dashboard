import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { PipelinesDashboardComponent } from "./pipelines-dashboard/pipelines-dashboard.component";
import { PipelineTableComponent } from "./components/pipeline-table/pipeline-table.component";
import { PipelineDetailComponent } from "./components/pipeline-detail/pipeline-detail.component";
import { DialogComponent } from "./components/dialog/dialog.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

const routes: Routes = [
  { path: "", redirectTo: 'home', pathMatch: 'full' },
  {
    path: "home", component: DashboardComponent,
    children: [{
      path:':engine/:platform/:id',
      component:DialogComponent,
    }]
  },
  {
    path: "openebs/:engine", component: PipelinesDashboardComponent,
    children: [{
      path: ':platform',
      component: PipelineTableComponent,
      children: [{
        path: ':id',
        component: DialogComponent,
      }]
    }]
  },
  { path: "openebs/:platform/:engine/pipeline/:id", component: PipelineDetailComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})

export class AppRoutingModule { }
