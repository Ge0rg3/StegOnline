import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

	images: {};
	contributeSteps: string = "https://github.com/Ge0rg3/StegOnline/blob/master/src/app/checklist/checklist.component.html";

  constructor() { }

  ngOnInit() {
		var path = 'assets/examples/'
		this.images = {
			'strings': path + 'strings-stego.jpg',
			'exif': path + 'exif-stego.jpg',
			'binwalk': path + 'binwalk-stego.jpg',
			'lsb': path + 'lsb-stego.jpg',
		}
  }


}