import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public Engine: string;
  public year: number;


  constructor() { }

  ngOnInit() {
    this.year = this.getYear();
    const url: string[] = window.location.pathname.split('/');
    if (url[2]) {
      this.Engine = url[2];
    } else if (url.includes('home')) {
      this.Engine = 'home';
    }
  }
  getYear(): number {
    const date = new Date();
    return date.getFullYear();
  }


}
