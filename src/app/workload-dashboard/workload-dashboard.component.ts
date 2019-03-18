import { Component, OnInit } from "@angular/core";
import { KubernetsService } from "../services/kubernetes.service";
import * as $ from "jquery";
import { Subscription, Observable, timer } from "rxjs";
import { Meta,Title } from "@angular/platform-browser";
import { allApplication } from "../model/data.model";
import { map } from 'rxjs/operators';
@Component({
 selector: "app-workload-dashboard",
 templateUrl: "./workload-dashboard.component.html",
 styleUrls: ["./workload-dashboard.component.scss"]
})


export class WorkloadDashboardComponent implements OnInit {

 public openebsVersion : any ;
 public allApplications: allApplication;
 public gitlabApplication : allApplication;
 public responseapp : any = []
 constructor(private kubernetsServices: KubernetsService, private meta: Meta,private titleService: Title) {
   this.titleService.setTitle( "workloads dashboard" );
   this.meta.updateTag({
     name: "description",
     content: "Live Deployments of all the application "
   });
  
 }

 ngOnInit() {
  
   timer(0, 300000).subscribe(x => {

     this.kubernetsServices.getAllApplication().subscribe( res => {
       for (let index = 0; index < res.length; index++) {
           this.responseapp = this.responseapp.concat(res[index])  
       }  
       this.allApplications = this.responseapp; 
     });
   });

   $(document).ready(function(){
     $("#myInput").on("keyup", function() {
       var value = $(this).val().toLowerCase();
       $("#myTable tr").filter(function() {
         $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
       });
     });
   });
 }

 setApiUrl(apiurl: string){
   localStorage.setItem('apiurlkey' , apiurl);
   this.kubernetsServices.setApiUrl(localStorage.getItem('apiurlkey'));
 }
}
