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


  constructor(private kubernetsServices: KubernetsService) { }

  ngOnInit() {
    console.log("res");
    // this.kubernetsServices.getListNamespaces().subscribe(res => {
    //   this.jivas = res.jiva
    //   this.cstor = res.cstor
    //   // console.log(this.listNamespaces);
    //   // for (let i of this.listNamespaces.jiva) {
    //   //   console.log(i);
    //   // }
    //   console.log(res.jiva);
    // })
  }

}
