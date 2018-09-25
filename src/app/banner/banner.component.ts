import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.css"]
})
export class BannerComponent implements OnInit {
  public hide: boolean = false;
  @Input("readMessage")
  message: string;
  @Input("anchorText")
  anchorText: string;
  @Input("hyperlink")
  hyperlink: string;
  constructor() {}

  ngOnInit() {}
  public hideBanner() {
    this.hide = true;
  }
}
