import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../common-services/image.service';
import { LsbOptionsService } from '../lsb-options.service';

@Component({
  selector: 'lsb-table',
  templateUrl: './lsb-table.component.html',
  styleUrls: ['./lsb-table.component.scss']
})

export class LsbTableComponent implements OnInit {

  //Display vars
  rowIds: number[] = [7, 6, 5, 4, 3, 2, 1, 0];
  checkBoxes: {} = {};
  showAlpha: boolean = this.imageService.isTransparent;

  constructor(private imageService: ImageService, private lsbOptionsParser: LsbOptionsService) { }

  ngOnInit() {
    if (this.lsbOptionsParser.currentTable == "embed") this.showAlpha = false;
  }

  tickCol(colour: string) {
    /*
      Automatically inverts a column's values.
      Triggered when column header is pressed.
    */
    for (let rowId of this.rowIds) {
      if (this.checkBoxes[colour+rowId]) {
        //Uncheck box
        this.checkBoxes[colour+rowId] = false;
        //Remove from colour's array
        this.removeBit(colour, rowId);
      }
      else {
        //Check box
        this.checkBoxes[colour+rowId] = true;
        //Add to colour's array
        this.addBit(colour, rowId);
      }
    }
  }

  tickRow(rowId: number) {
    /*
      Automatically inverts a row's values.
      Triggered when row header is pressed.
    */
    for (let colour of this.imageService.rgbaChars) {
      if (colour != 'a' || this.showAlpha) {
        if (this.checkBoxes[colour+rowId]) {
          //Uncheck box
          this.checkBoxes[colour+rowId] = false;
          //Remove from colour's array
          this.removeBit(colour, rowId);
        }
        else {
          //Check box
          this.checkBoxes[colour+rowId] = true;
          //Add to colour's array
          this.addBit(colour, rowId);
        }
      }
    }
  }

  tickAll() {
    /*
      Inverts every checkbox in the table.
      Triggered by the blank top-left cell.
    */
    for (let rowId of this.rowIds) {
      this.tickRow(rowId);
    }
  }


  bitChange(event: Event, colour: string, rowId: number) {
    /*
      Called whenever a new option is selected.
      This updates the service's stored lsbOptionsParser.selectedBits object literal.
    */
    var checked: boolean = (event.currentTarget as HTMLInputElement).checked;
    if (checked) {
      //Add to colour's array
      this.addBit(colour, rowId);
    }
    else {
      //Remove from colour's array
      this.removeBit(colour, rowId);
    }
  }

  addBit(colour: string, bit: number) {
    /*
    Adds a colour to the lsbOptionsParser.selectedBits object literal.
    */
    this.lsbOptionsParser.selectedBits[colour].push(bit);
  }

  removeBit(colour: string, bit: number) {
    /*
    Removes a colour from the lsbOptionsParser.selectedBits object literal.
    */
    this.lsbOptionsParser.selectedBits[colour] = this.lsbOptionsParser.selectedBits[colour].filter(n => n != bit);
  }


}
