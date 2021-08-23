import { Component, OnInit } from '@angular/core';
import { DashboardData } from "../../services/ci-dashboard.service";
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProjectK8s } from 'src/app/model/enum.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private ApiService: DashboardData, private router: Router, private titleService: Title) { }

  public recentData: any = [];


  ngOnInit() {
    this.titleService.setTitle('OpenEBS E2E Dashboard');
    this.ApiService.getAnyEndpointData("/recent").subscribe(res => {
      console.log(res);
      this.recentData = res

    })

  }
  getName(ID: string) {
    switch (ID) {
      case "36":
        return "openshift"
      case "34":
        return "konvoy"
      case "43":
        return "nativek8s"
      default:
        break;
    }
  }
  getK8s(ID) {
    switch (ID) {
      case "36":
        return ProjectK8s.Openshift
      case "34":
        return ProjectK8s.Konvoy
      case "43":
        return ProjectK8s.NativeK8s
      default:
        break;
    }
  }

  getImage(projectID: string) {
    switch (projectID) {
      case "36":
        return '/assets/images/cloud/openshift.png'
      case "34":
        return '/assets/images/cloud/konvoy.png'
      case "43":
        return '/assets/images/cloud/nativek8s.png'
      default:
        break;
    }
  }
  timeConverter(t) {
    try {
      var date = t
      var dateFormat = moment.utc(date).local().calendar();
      return dateFormat
    } catch (error) {
      console.log("error", error);
      return "_";
    }
  }

  genDetailRouteLink(id, platform, branch) {
    let pID = id
    let project = this.getName(platform)
    let sliceOpenebs = branch.replace('openebs-', '');

    return `${sliceOpenebs}/${project}/${id}`

  }

  getBranchName(branch: string) {
    switch (branch) {
      case 'jiva-operator':
        return 'Jiva (CSI)'
      case 'openebs-jiva':
        return 'Jiva (External Provisioner)'
      case 'openebs-cstor-csi':
        return 'cStor (CSI)';
      case 'openebs-cstor':
        return 'cStor (External Provisioner)'
      case 'openebs-localpv':
        return 'Local PV hostpath'
      case 'release-branch':
        return 'Local PV ZFS'
      case 'lvm-localpv':
        return 'Local PV LVM'
      default:
        return 'Engine name not found'
    }
  }

  genPipelineStatus(s: string) {
    switch (s) {
      case 'success':
        return 'badge badge-pill badge-success'
      case 'failed':
        return 'badge badge-pill badge-danger'
      case 'canceled':
        return 'badge badge-pill badge-secondary'
      case 'skipped':
        return 'badge badge-pill badge-light'
      case 'running':
        return 'badge badge-pill badge-primary'
      default:
        return 'badge badge-pill badge-dark'
    }
  }

  gotoEnginePage(project: string, branch: string) {
    let B = (b) => {
      if (b.includes('openebs')) {
        return b.replace('openebs-', '')
      }
      else return b
    }
    let genPath = `/openebs/${B(branch)}/${this.getName(project)}`
    this.router.navigate([genPath])

  }


}
