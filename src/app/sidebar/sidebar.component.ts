import { Component, OnInit } from '@angular/core';
import { KubernetsService } from "../services/kubernetes.service";
// import { jiva,cstor } from "../model/data.model";
import { RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public jivas = [];
  public cstors = [];

  constructor(private kubernetsServices: KubernetsService) { }

  ngOnInit() {
    // this.kubernetsServices.getListNamespaces().subscribe(res => {
    //   this.jivas = res.jiva
    //   this.cstors = res.cstor
    // })
  }

}
