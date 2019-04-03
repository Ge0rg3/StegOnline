import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmbedDataService } from '../embed-data.service';
import { ImageService } from '../../common-services/image.service';
declare var download; //download.js, imported in angular.json file

@Component({
  selector: 'download-embedded',
  template: '<button class="btn btn-info" (click)="download()">Download Extracted Data</button>'
})
export class DownloadEmbeddedComponent implements OnInit {

  constructor(private embedService: EmbedDataService, private imageService: ImageService, private router: Router) { }

  ngOnInit() {
		// //If no image loaded, redirect back.
		if (!this.imageService.defaultImageData) {
			this.router.navigate(['/upload']);
		}
  }

  download() {
    var fileName = this.imageService.fileName;
    this.embedService.embeddedCanvas.toBlob(function (blob) {
      download(blob, fileName, 'image/png');
    })
  }

}