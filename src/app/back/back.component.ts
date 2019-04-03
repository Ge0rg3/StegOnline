import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'back',
	styles: ['#back { font-style: italic; font-weight: bold; cursor: pointer; color: #5e5e5e; }'],
  template: `<div id="back" (click)="router.navigate(['/image'])">Back to Home</div>`
})
export class BackComponent implements OnInit {

  constructor(private router: Router) { }

	/*
		This component is used for whole-page sections of the site (i.e. embed/extract data) to return to the image menu easily.
	*/

  ngOnInit() {
  }

}