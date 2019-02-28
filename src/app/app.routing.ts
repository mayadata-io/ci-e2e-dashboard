import { Routes, RouterModule } from "@angular/router";

import { TableComponent } from "./table/table.component";
import { WorkloadDashboardComponent } from "./workload-dashboard/workload-dashboard.component";
import { WorkloadsComponent } from "./workloads/workloads.component";
import { OverviewComponent } from "./overview/overview.component";

const routes: Routes = [
  //routes without header and footer
  { path: "", component: TableComponent },
  { path: "workload-dashboard", component: WorkloadDashboardComponent },
  { path: "mongo-jiva", component: WorkloadsComponent },
  { path: "mongo-cstor", component: WorkloadsComponent },
  { path: "grafana-cstor", component: WorkloadsComponent },
  { path: "percona-jiva", component: WorkloadsComponent },  
  { path: "percona-cstor", component: WorkloadsComponent },
  { path: "prometheus-cstor", component: WorkloadsComponent },
  { path: "prometheus-jiva", component: WorkloadsComponent },
  { path: "cockroachdb-cstor", component: WorkloadsComponent },
  { path: "cockroachdb-jiva", component: WorkloadsComponent },
  { path: "wordpress-nfs", component: WorkloadsComponent },
  { path: "logging", component: WorkloadsComponent },
  { path: "redis-jiva", component: WorkloadsComponent },
  { path: "redis-cstor", component: WorkloadsComponent },
  { path: "postgresql-jiva", component: WorkloadsComponent },
  { path: "postgresql-cstor", component: WorkloadsComponent },
  { path: "nuodb-cstor", component: WorkloadsComponent },
  { path: "overview", component: OverviewComponent },
  { path: ":workload", component: WorkloadsComponent }
];

export const Routing = RouterModule.forRoot(routes);
