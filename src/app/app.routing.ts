import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PipelinesDashboardComponent } from './components/pipelines-dashboard/pipelines-dashboard.component';
import { PipelineTableComponent } from './components/pipeline-table/pipeline-table.component';
import { PipelineDetailComponent } from './components/pipeline-detail/pipeline-detail.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MayastorComponent } from './components/mayastor/mayastor.component';
import { MayastorDialogComponent } from './components/mayastor-dialog/mayastor-dialog.component';
import { ExternalLinkAccessComponent } from './components/external-link-access/external-link-access.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home', component: DashboardComponent,
    children: [{
      path: ':engine/:platform/:id',
      component: DialogComponent,
    }]
  },
  {
    path: 'openebs/:engine', component: PipelinesDashboardComponent,
    children: [{
      path: ':platform',
      component: PipelineTableComponent,
      children: [{
        path: ':id',
        component: DialogComponent,
      }]
    }]
  },
  { path: 'openebs/:platform/:engine/pipeline/:id', component: PipelineDetailComponent },
  {
    path: 'mayastor', component: MayastorComponent,
    children: [{
      path: ':id',
      component: MayastorDialogComponent
    }]
  },
  { path: 'redirectto/:link', component: ExternalLinkAccessComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})

export class AppRoutingModule { }
