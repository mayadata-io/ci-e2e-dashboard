import { Component, OnInit } from "@angular/core";
import {
  Router,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationError
} from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  private currentRoute: any;
  public header: string;
  constructor(private router: Router) {
    router.events.subscribe(val => {
      this.currentRoute = this.router.url;
      if (this.currentRoute === "/") {
        this.header = "CI/E2E Dashboard For Master branch of OpenEBS";
      } else {
        this.header = "Workloads Dashboard";
      }
    });
  }

  ngOnInit() {}
  
  clickit(url) {
    window.open(url, "_blank");
  }
}
