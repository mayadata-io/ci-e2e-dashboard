import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public bannerPassMessage =
    "MayaData announces commercial availability and launches MDAP.";
  public bannerHyperLink = "https://mayadata.io";
  public bannerAnchorText = "Read More";
  title = "OpenEBS Dashboard";
}
