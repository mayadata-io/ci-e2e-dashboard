import { Router } from "@angular/router";
import * as $ from "jquery";
import { Component,OnInit } from "@angular/core";
import { FormGroup,FormControl,Validators } from "@angular/forms";
import { AgileService } from "../services/agile.services";
import { TranslateModule, TranslateService } from 'angular-intl';
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  private currentRoute: any;
  public header: string;
  leadForm: FormGroup;
  name: FormControl;
  public vendor: any = false;
  email: FormControl;
  companyname: FormControl;
  isFormEmpty: boolean = false;
  setFormChange: boolean = false;
  mdTag: string = 'OpenEBS OE Newsletter';
  mdape2e :boolean = false;
  constructor(private router: Router, private headerService: AgileService, public translateService: TranslateService) {
    router.events.subscribe(val => {
      this.currentRoute = this.router.url;
      if (this.currentRoute === "/") {
        this.header = "E2E pipelines for master branch";
        this.mdape2e = true;
      } else if (this.currentRoute === "/overview") {
        this.header = "Overview";
        this.mdape2e = false;
      } else {
        this.header = "Workloads Dashboard";
        this.mdape2e = false;
      }
    });
    this.translateService.getByFileName('VENDOR', 'default-en').subscribe(value => {
      this.vendor = value;
    });
  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  clickit(url) {
    window.open(url, "_blank");
  }
  createFormControls() {
    this.name = new FormControl("", Validators.required);
    this.email = new FormControl("", [
      Validators.required,
      Validators.pattern("[^ @]*@[^ @]*")
    ]);
    this.companyname = new FormControl();
  }

  createForm() {
    this.leadForm = new FormGroup({
      name: this.name,
      email: this.email,
      companyname: this.companyname
    });
  }

  notifySlack() {
    // $('#slacksubmit').click(function () {
    var fields = [
      {
        title: "Name",
        value: $("#agilefield-1").val(),
        short: true
      },
      {
        title: "Email",
        value: $("#agilefield-2").val(),
        short: true
      },
      {
        title: "Tag",
        value: "OpenEBS OE Newsletter",
        short: true
      },
      {
        title: "From",
        value: "OpenEBS-CI",
        short: true
      }
    ];
    var payload = {
      text: "New Subscriber for OpenEBS Newsletter",
      attachments: [
        {
          text: "",
          fields: fields
        }
      ]
    };
    var payloadToSend = JSON.stringify(payload);
    var host = window.location.host;
    if (host == "openebs.ci" || host == "www.openebs.ci") {
      var webhookURL =
        "https://hooks.slack.com/services/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"; // main
    } else {
      var webhookURL =
        "https://hooks.slack.com/services/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"; // testing
    }
    $.ajax({
      url: webhookURL,
      type: "POST",
      processData: true,
      data: payloadToSend,
      dataType: "JSON",
      success: function(data) {},
      error: function(data) {}
    });

    // });
  }

  formSubmit() {
    if (this.name.errors == null && this.email.errors == null) {
      console.log(    this.leadForm.value.name,
        this.leadForm.value.email,
        this.leadForm.value.companyname,
        this.mdTag)
      this.headerService.saveFormdata(
        this.leadForm.value.name,
        this.leadForm.value.email,
        this.leadForm.value.companyname,
        this.mdTag
      );
      this.notifySlack();
      this.leadForm.reset();
      this.setFormChange = true;
    }
    if (this.name.errors || this.email.errors) {
      this.isFormEmpty = true;
    }
  }
}
