import { Component, OnInit } from '@angular/core';
import { LsbOptionsService } from '../lsb-options.service';
import { ExtractDataService } from '../extract-data.service';

@Component({
  selector: 'app-extract-menu',
  templateUrl: './extract-menu.component.html',
  styleUrls: ['./extract-menu.component.scss']
})
export class ExtractMenuComponent implements OnInit {

  constructor(private extractService: ExtractDataService, private lsbOptions: LsbOptionsService) { }

  ngOnInit() {
    this.lsbOptions.currentTable = 'extract';
  }

  startExtract(): void {
    /*
      This acts as an intermediary between the option components, the extracting service and the result components.
    */
    //Tweak some variables so they fit the service
    var _pixelOrder: string = this.lsbOptions.pixelOrder == "Row" ? "Row" : "Column";
    var _trimBits: boolean = this.lsbOptions.trimBits == "Yes" ? true : false;

    //Run function!
    var hexResult = this.extractService.extract(this.lsbOptions.selectedBits, _pixelOrder, this.lsbOptions.bitOrder, this.lsbOptions.bitPlaneOrder, _trimBits);

  }

}