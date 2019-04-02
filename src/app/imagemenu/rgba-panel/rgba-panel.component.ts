import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../common-services/image.service';
declare var download; //Download.js TypeScript declaration

@Component({
  selector: 'rgba-panel',
  templateUrl: './rgba-panel.component.html'
})
export class RgbaPanelComponent implements OnInit {

	condensedRgba: string;

  constructor(private imageService: ImageService) { }

  ngOnInit() {
		this.condensedRgba = this.imageService.rgba.slice(0, 10000).join(', ');
  }

	downloadRgba() {
		/*
			Used to download all RGBA values in a txt file.
		*/
		var downloadName: string = this.imageService.fileName.split(".")[0]+"_RGBA.txt";
		download(this.imageService.rgba.join(', '), downloadName, "text/plain");
	}

}