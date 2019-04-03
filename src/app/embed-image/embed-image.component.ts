import { Component, OnInit } from '@angular/core';
import { ImageService } from '../common-services/image.service';
import { HelpersService } from '../common-services/helpers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'embed-image',
  templateUrl: './embed-image.component.html',
  styleUrls: ['./embed-image.component.scss']
})
export class EmbedImageComponent implements OnInit {

  bitNumbers: number[] = [7, 6, 5, 4, 3, 2, 1, 0];
  selectedColour: string = "R";
  selectedBitPlane: number = 0;
  fileLoaded: boolean = false;
  embedComplete: boolean = false;
  inProgress: boolean = false;
  fileHeight: number;
  fileWidth: number;
  drawImageData: ImageData;
  //Array containing r[], g[], b[] & a[]
  rgb: Uint8ClampedArray[];

  constructor(private imageService: ImageService, private helpers: HelpersService, private router: Router) { }

  ngOnInit() {
		if (!this.imageService.defaultImageData) {
			this.router.navigate(['/upload']);
		}
  }

  async startEmbedImage() {
    /*
      This function hides the data from the file in the requested bit plane.
      Usually we delegate complex logic like this to services, but since this is short, we're working it out here.
    */
    this.embedComplete = false;
    this.inProgress = true;
    await this.helpers.sleep(0);
    var colours: Uint8ClampedArray[] = [this.imageService.r.slice(0), this.imageService.g.slice(0), this.imageService.b.slice(0)];
    var colourIndex = this.imageService.rgbaChars.indexOf(this.selectedColour.toLowerCase());
    var bit = 7 - this.selectedBitPlane;

    let maxH = this.fileHeight < this.imageService.height ? this.fileHeight : this.imageService.height;
    let maxW = this.fileWidth < this.imageService.width ? this.fileWidth : this.imageService.width;

    //For each row
    for (let i=0; i < maxH; i++) {
      //For each column
      for (let j=0; j < maxW; j++) {
        //Get nth pixels of each image
        var hideNew: number = (i*this.fileWidth)+j;
        var hideOriginal: number = (i*this.imageService.width)+j;
        //Convert R/G/B val of pixel to binary
        var binaryCol: string[] = this.helpers.intToBin(colours[colourIndex][hideOriginal]).split('');
        //Hide bit
        binaryCol[bit] = this.rgb[colourIndex][hideNew] > 127 ? '0' : '1';
        colours[colourIndex][hideOriginal] = parseInt(binaryCol.join(''), 2);
      }
    }
    this.drawImageData = this.imageService.createImage(colours[0], colours[1], colours[2], this.imageService.opaque);
    this.inProgress = false;
    this.embedComplete = true;
  }

  uploadFile(input: any) {
    /*
      This function is used to handle the file upload, and set appropriate flags.
    */
    this.rgb = [];
    if (input.target.files[0]) {
      var file: File = input.target.files[0];

      if (!file.type.match(/image\/.*/)) {
        alert("Please enter a valid image file!");
        return;
      }

      var reader: FileReader = new FileReader();

      reader.onloadend = () => { //Arrow syntax to retain "this" scope.
        var imageObj: HTMLImageElement = new Image();
        var self: EmbedImageComponent = this;
        imageObj.onload = () => {
          //Draw image to fake canvas
          var canvas: HTMLCanvasElement = document.createElement('canvas');
          var ctx: CanvasRenderingContext2D = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = false;
          canvas.width = imageObj.width;
          self.fileWidth = imageObj.width;
          canvas.height = imageObj.height;
          self.fileHeight = imageObj.height;
          ctx.drawImage(imageObj, 0, 0);
          //Extract vals from fake canvas
          var rgba: Uint8ClampedArray = ctx.getImageData(0, 0, imageObj.width, imageObj.height).data;
          self.rgb.push(rgba.filter((val, index) => index % 4 == 0));
          self.rgb.push(rgba.filter((val, index) => (index-1) % 4 == 0));
          self.rgb.push(rgba.filter((val, index) => (index-2) % 4 == 0));
          //Show "Go!" button
          self.fileLoaded = true;
        }
        imageObj.src = (reader.result as string)
      }
      reader.readAsDataURL(file);
    }
  }

}