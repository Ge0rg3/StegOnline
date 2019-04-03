import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LsbOptionsService } from '../lsb-options.service';
import { ExtractDataService } from '../extract-data.service';
import { HelpersService } from '../../common-services/helpers.service';
import { ImageService } from '../../common-services/image.service';
import { IdentifyFileTypeService } from '../../common-services/identify-file-type.service';
declare var download; //download.js, imported in angular.json file

@Component({
  selector: 'app-extract-menu',
  templateUrl: './extract-menu.component.html',
})
export class ExtractMenuComponent implements OnInit {

  constructor(private router: Router, private fileTypeService: IdentifyFileTypeService, private imageService: ImageService, private extractService: ExtractDataService, private lsbOptions: LsbOptionsService, private helpers: HelpersService) { }

  extractComplete: boolean = false;
  inProgress: boolean = false;

  fileTypes: string[][] = [];
  identifiedExtension: string = "dat";
	hexResult: string;
	asciiResult: string;
	trimmedHexResult: string;
	trimmedAsciiResult: string;

  ngOnInit() {
    this.lsbOptions.currentTable = 'extract';
    //If no image loaded, redirect back.
    if (!this.imageService.defaultImageData) {
      this.router.navigate(['/upload']);
    }
  }

  async startExtract() {
    /*
      This acts as an intermediary between the option components, the extracting service and the result components.
    */
    //Show loading text
    this.inProgress = true;
		this.extractComplete = false;
    this.extractService.loadingMessage = "0%";
    await this.helpers.sleep(0);

    //Tweak some variables so they fit the service
    var _pixelOrder: string = this.lsbOptions.pixelOrder == "Row" ? "Row" : "Column";
    var _trimBits: boolean = this.lsbOptions.trimBits == "Yes" ? true : false;

    //Run function!
    this.hexResult = await this.extractService.extract(this.lsbOptions.selectedBits, _pixelOrder, this.lsbOptions.bitOrder, this.lsbOptions.bitPlaneOrder, _trimBits);
		this.trimmedHexResult = this.hexResult.substring(0, 2500);

    //Get ASCII representation
    this.asciiResult = this.helpers.hexToAscii(this.hexResult);
		this.trimmedAsciiResult = this.asciiResult.substring(0, 2500);

    //Check filetype
    this.fileTypes = this.fileTypeService.identifyFileType(this.hexResult);
    if (this.fileTypes.length > 0) {
      this.identifiedExtension = this.fileTypes[0][0];
    }
    else {
      this.identifiedExtension = "dat";
    }

    //Show results on page
    this.extractComplete = true;
    this.inProgress = false;
  }

  downloadData(): void {
    /*
      Downloads the extracted data as file.
    */
    var fileName: string = this.imageService.fileName;
    var byteArray: Uint8Array = new Uint8Array(this.hexResult.match(/.{2}/g).map(e => parseInt(e, 16)));
    var blob: Blob = new Blob([byteArray], {type: "application/octet-stream"});

    var downloadName = fileName.split(".").slice(0, -1).concat(['.'+this.identifiedExtension]).join('');
    download(blob, downloadName, "application/octet-stream");
  }

}