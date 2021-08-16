import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';



@Component({
  selector: 'app-external-link-access',
  templateUrl: './external-link-access.component.html',
  styleUrls: ['./external-link-access.component.css']
})
export class ExternalLinkAccessComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private _location: Location) { }

  public link: string;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.link = params.link;
    });
  }
  backClicked() {
    this._location.back();
  }

}
