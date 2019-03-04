import { Component, OnInit } from '@angular/core';
import { KubernetsService } from "../services/kubernetes.service";
// import { jiva,cstor } from "../model/data.model";
import { RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from 'angular-intl';
import * as $ from "jquery";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public jivas = [];
  public cstors = [];
  public vendor: any = false;

  constructor(private kubernetsServices: KubernetsService, public translateService: TranslateService) {
    this.translateService.getByFileName('VENDOR', 'default-en').subscribe(value => {
      this.vendor = value;
    });
   }

  ngOnInit() {
    // this.kubernetsServices.getListNamespaces().subscribe(res => {
    //   this.jivas = res.jiva
    //   this.cstors = res.cstor
    // })
  }

}
