import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Meta,Title } from "@angular/platform-browser";
import { PersonService } from "../services/savereaddelete.service";
import { KubernetsService } from "../services/kubernetes.service";
import { LitmusService } from "../services/litmus.services";
import * as $ from "jquery";
import { Subscription, Observable, timer, from } from "rxjs";
import {
  getResponse,
  postResponse,
  statefulSet,
  jivaReplica,
  jivaController,
  applicationPod,
  overAllStatus,
  pvc,
  personDetail,
  yaml,
  runnigPos,
  completes
} from "../model/data.model";
import { ISubscription } from "rxjs/Subscription";
@Component({
  selector: "app-workloads",
  templateUrl: "./workloads.component.html",
  styleUrls: ["./workloads.component.scss"]
})
export class WorkloadsComponent implements OnInit, OnDestroy {
  private podUnsub: ISubscription;
  private timeUnsub: ISubscription;
  private litmustimeUnsub: ISubscription;
  private litmusUnsub: ISubscription;
  jivaDetail;
  jivas;
  private windowWidth;
  private rnumber = Math.floor(Math.random() * 10000000);
  public numberstatefullSets = 0;
  public numberController: any;
  public completes: completes[] = [];
  public runnigPos: runnigPos[] = [];
  public statefullSets: statefulSet[] = [];
  public litmuspod: statefulSet[] = [];
  public jivaContrllers: jivaController[] = [];
  public jivaReplicas: jivaReplica[] = [];
  public applicationPods: applicationPod[] = [];
  public overAllStatus: overAllStatus[] = [];
  public postResponses: postResponse;
  public getResponses: getResponse[] = [];
  public personDetails: personDetail[] = [];
  public namespaceyaml: any;
  public workloadyaml: any;
  public workloadName: any;
  public openebsEngine: any;
  public dashboardurl: any;
  public pvc: pvc[] = [];
  public pvctemp;
  public pvcarray;
  public namespace = "";
  public dockerImage = "";
  public openebsversion = "";
  public workloadImage = "";
  public overallStatus = "";
  public runningStatus = false;
  public failledStatus = false;
  public unknownStatus = false;
  public chaosTests: any;
  public selectedChaos = "";
  public selectedApplication = "";
  public writeStatus = false;
  public readStatus = false;
  public alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];
  public randomString1 = " ";
  public randomString2 = " ";
  public randomnumber: number;
  public getstatus;
  public getmessage;
  public poststatus;
  public postmessage;
  public alertMessage = "";
  public isAlert: boolean;
  public currentRoute: any;
  public applicationType: any;

  constructor(
    private router: Router,
    private personService: PersonService,
    private kubernetsServices: KubernetsService,
    private litmusServies: LitmusService,
    private titleService: Title
  ) {
    this.windowWidth = window.innerWidth;
    this.currentRoute = this.router.url.split("/");
    this.openebsEngine = this.router.url.split("-")[1];
    if (this.openebsEngine == "cstor") {
      this.chaosTests = [
        "Kill OpenEBS Target",
        "Increase Latency Between App and Replicas"
      ];
    } else {
      this.chaosTests = [
        "Kill OpenEBS Target",
        "Kill OpenEBS Replica",
        "Increase Latency Between App and Replicas"
      ];
    }
  }

  ngOnInit() {
    this.personService.getYamls(this.currentRoute[1]).subscribe(res => {
      this.workloadName = res.workloadName;
      this.namespaceyaml = res.nameSpaceyaml;
      this.workloadyaml = res.workloadyaml;
      this.applicationType = res.applicationType;
      this.dashboardurl = res.dashboardurl;
      this.titleService.setTitle( this.workloadName+" dashboard | OpenEBS.io" );
      console.log(this.dashboardurl);
    });

    for (let j = 0; j < 100; j++) {
      for (let i = 0; i < 10; i++) {
        this.randomString1 =
          this.randomString1 + this.alphabet[Math.floor(Math.random() * 25)];
        this.randomString2 =
          this.randomString2 + this.alphabet[Math.floor(Math.random() * 25)];
      }
      this.randomnumber = Math.floor(Math.random() * 10000000);
      this.personDetails.push({
        rNumber: this.rnumber,
        name: this.randomString1,
        email: this.randomString2,
        age: this.randomnumber
      });
      this.randomString1 = " ";
      this.randomString2 = " ";
    }

    if (this.selectedChaos == "") {
      $(".hide-custom").hide();
    }

    this.timeUnsub = timer(0, 5000).subscribe(x => {
      this.podUnsub = this.kubernetsServices
        .getPodDetails(this.currentRoute[1], this.currentRoute[1])
        .subscribe(res => {
          this.statefullSets = res.statefulSet;
          this.applicationPods = res.applicationPod;
          this.jivaContrllers = res.jivaController;
          this.jivaReplicas = res.jivaReplica;
          this.pvc = res.pvc;
          this.pvctemp = res.pvc;
          this.pvcarray = this.pvctemp.pvc;
          this.workloadImage = this.statefullSets[0].dockerImage;
          this.dockerImage = this.jivaContrllers[0].openebsjivaversion;
          this.openebsversion = this.jivaContrllers[0].openebsjivaversion.split(
            ":"
          )[1];
          this.namespace = this.statefullSets[0].namespace;
          this.overallStatus = res.status;
          this.numberstatefullSets = this.statefullSets.length;
          this.numberController = this.jivaContrllers.length;
          if (this.overallStatus == "Running") {
            this.runningStatus = true;
          } else if (
            this.overallStatus == "Pending" ||
            this.overallStatus == "Failed"
          ) {
            this.failledStatus = true;
          } else {
            this.unknownStatus = true;
          }
          error => {
            this.unknownStatus = true;
          };
        });
    });

    this.litmustimeUnsub = timer(0, 5000).subscribe(x => {
      this.litmusUnsub = this.litmusServies
        .getLitmusStatus(this.currentRoute[1])
        .subscribe(res => {
          this.runnigPos = res.runnigPos;
          this.completes = res.completes;
        });
    });
    this.kubernetsServices
      .getPodDetails(this.currentRoute[1], this.currentRoute[1])
      .subscribe(res => {
        this.litmuspod = res.statefulSet;
      });
  }

  ngOnDestroy() {
    this.podUnsub.unsubscribe();
    this.timeUnsub.unsubscribe();
    this.litmusUnsub.unsubscribe();
    this.litmustimeUnsub.unsubscribe();
  }
  public listVolume() {
    this.kubernetsServices
      .getJivaVolumeDetails(this.workloadName, this.openebsEngine)
      .subscribe(res => {
        this.jivaDetail = res;
        this.jivas = this.jivaDetail;
      });
  }

  public save() {
    this.personService
      .save100PersonDetails(this.personDetails, this.currentRoute[1])
      .subscribe(res => {
        this.postResponses = res;
        this.poststatus = this.postResponses.status;
        this.postmessage = this.postResponses.message;
        this.writeStatus = true;
      });
  }
  public read() {
    this.personService
      .get100personDetails(this.rnumber, this.currentRoute[1])
      .subscribe(res => {
        this.getResponses[0] = res;
        this.getstatus = this.getResponses[0].status;
        this.getmessage = this.getResponses[0].message;
        this.readStatus = true;
      });
  }

  public onChaosSelect(chaosValue) {
    this.selectedChaos = chaosValue;
    if (this.selectedChaos != "") {
      $(".hide-custom").show();
    } else {
      $(".hide-custom").hide();
      this.selectedApplication = "";
    }
  }

  public onAppSelect(appValue) {
    this.selectedApplication = appValue;
  }

  public runChaosTest(type: string, volume: string) {
    if (type != "" && volume != "") {
      this.alertMessage = type + " is  triggered";
      for (let i = 0; i < this.chaosTests.length; i++) {
        if (type.trim() == this.chaosTests[i]) {
          type = i.toString();
          break;
        }
      }
      console.log(volume.trim());
      console.log(this.namespace);
      console.log(this.openebsEngine);
      console.log(type);
      if (this.openebsEngine == "cstor") {
        this.litmusServies.runChaosTestService(
          type,
          volume.trim(),
          this.namespace,
          "openebs",
          this.workloadName
        );
      } else {
        this.litmusServies.runChaosTestService(
          type,
          volume.trim(),
          this.namespace,
          this.namespace,
          this.workloadName
        );
      }
      this.runAlert();
      this.setSelectToDefault();
    }
  }
  public runAlert() {
    this.isAlert = true;
    setTimeout(
      function() {
        $(".alert")
          .animate({ opacity: 0, bottom: "40px" }, 7000)
          .hide("slow");
        setTimeout(
          function() {
            this.isAlert = false;
          }.bind(this),
          600
        );
      }.bind(this),
      4000
    );
  }

  public setSelectToDefault() {
    this.selectedChaos = "";
    this.selectedApplication = "";
    $("#application").hide();
    $("#application")
      .val("")
      .change();
    $("#induceChaos")
      .val("")
      .change();
  }
}
