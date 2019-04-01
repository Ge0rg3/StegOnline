import { Component, OnInit } from '@angular/core';
import { EmbedDataService } from '../embed-data.service';
import { ImageService } from '../../common-services/image.service';
declare var download; //download.js, imported in angular.json file

@Component({
  selector: 'download-embedded',
  template: '<button class="btn btn-info" (click)="download()">Download Extracted Data</button>'
})
export class DownloadEmbeddedComponent implements OnInit {

  constructor(private embedService: EmbedDataService, private imageService: ImageService) { }

  ngOnInit() {
  }

  download() {
    var fileName = this.imageService.fileName;
    this.embedService.embeddedCanvas.toBlob(function (blob) {
      download(blob, fileName, 'image/png');
    })
  }

}
