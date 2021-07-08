import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-pipelines-dashboard',
  templateUrl: './pipelines-dashboard.component.html',
  styleUrls: ['./pipelines-dashboard.component.scss']
})
export class PipelinesDashboardComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }
  public engine: string;
  public Platform : string = "openshift";

  ngOnInit() {
    this.engine = this.activatedRoute.snapshot.paramMap.get('engine');
    let url = window.location.pathname.split('/')
    let branch:string = url[2]
    this.Platform = url[3]
  }
  testFunc(p:string) {
    if (this.Platform == p){
    return 'bg-primary shadow text-white'
    }else{
      return ''
    }
  }

  getBranchName(branch: string) {
    switch (branch) {
      case 'jiva-operator':
        return 'Jiva (CSI)'
      case 'jiva':
        return 'Jiva (External Provisioner)'
      case 'cstor-csi':
        return 'cStor (CSI)';
      case 'cstor':
        return 'cStor (External Provisioner)'
      case 'localpv':
        return 'Local PV hostpath'
      case 'release-branch':
        return 'Local PV ZFS'
      case 'lvm-localpv':
        return 'Local PV LVM'
      default:
        return '_'
    }
  }

}
