import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../common-services/image.service';
declare var download; //download.js, imported in angular.json file

@Component({
  selector: 'save-image',
  template: '<button class="btn btn-info" (click)="saveImage()">Save Current Image</button>'
})
export class SaveimageComponent implements OnInit {

  constructor(private imageService: ImageService) { }

  ngOnInit() {
  }

  saveImage() {
    var fileName = this.imageService.fileName;
    this.imageService.canvas.toBlob(function (blob) {
      var downloadName = fileName.split(".").slice(0, -1).concat(['.png']).join('');
      download(blob, downloadName, 'image/png');
    });
  }

}
