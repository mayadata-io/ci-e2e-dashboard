import { Routes, RouterModule } from "@angular/router";

import { TableComponent } from "./table/table.component";
import { WorkloadDashboardComponent } from "./workload-dashboard/workload-dashboard.component";
import { WorkloadsComponent } from "./workloads/workloads.component";
import { OverviewComponent } from "./overview/overview.component";

const routes: Routes = [
  //routes with out header and footer
  { path: "", component: TableComponent },
  { path: "workload-dashboard", component: WorkloadDashboardComponent },
  { path: "mongo-jiva", component: WorkloadsComponent },
  { path: "percona-jiva", component: WorkloadsComponent },
  { path: "cockroachdb-jiva", component: WorkloadsComponent },
  { path: "grafana-cstor", component: WorkloadsComponent },
  { path: "mongo-cstor", component: WorkloadsComponent },
  { path: "percona-cstor", component: WorkloadsComponent },
  { path: "prometheus-cstor", component: WorkloadsComponent },
  { path: "prometheus-jiva", component: WorkloadsComponent },
  { path: "wordpress-nfs", component: WorkloadsComponent },
  { path: "overview", component: OverviewComponent }
];

export const Routing = RouterModule.forRoot(routes);
