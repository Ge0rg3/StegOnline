import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PanelSettingsService } from '../../common-services/panel-settings.service';
import { HelpersService } from '../../common-services/helpers.service';
import { ImageService } from '../../common-services/image.service';

@Component({
  selector: 'pngpalette-details',
  templateUrl: './pngpalette-details.component.html'
})
export class PngPaletteDetailsComponent implements OnInit {

	@Output() pngPaletteDataEmitter: EventEmitter<ImageData> = new EventEmitter<ImageData>();

  maxPaletteNo: number
  currentPaletteNo: number;
	currentColours: string;

  constructor(private imageService: ImageService, private helpers: HelpersService, private panelSettings: PanelSettingsService) { }

  ngOnInit() {
    this.currentPaletteNo = 1;
    this.maxPaletteNo = this.imageService.pngPaletteColourArrayGroups.length;
  }

  togglePaletteBrowser() {
    /*
      Used to show/hide the Browser
    */
    var flag = this.panelSettings.showPaletteBrowser;
    this.panelSettings.closePanels();
    if (!flag) {
			this.panelSettings.showPaletteBrowser = true;
			this.pngPaletteDataEmitter.emit(this.viewColour(this.currentPaletteNo));
		}
  }

	randomizePalette() {
		/*
			Used to randomize the image's colour palette.
			The constructed ImageData is then emitted, and thus drawn onto the canvas.
		*/
		this.panelSettings.closePanels();
		//Either red or completely random
		var randPngPaletteColours: number[][];
		if (this.helpers.ranbetween(0, 1) == 0) {
			randPngPaletteColours = this.imageService.pngPaletteColourArrayGroups.map(trio => [this.helpers.ranbetween(0, 255),50,50]);
		} else {
			randPngPaletteColours = this.imageService.pngPaletteColourArrayGroups.map(trio => [this.helpers.ranbetween(0, 255),this.helpers.ranbetween(0, 255),this.helpers.ranbetween(0, 255)]);
		}
		var randR: Uint8ClampedArray = this.imageService.pngPaletteIndexes.map(index => randPngPaletteColours[index][0]);
		var randB: Uint8ClampedArray = this.imageService.pngPaletteIndexes.map(index => randPngPaletteColours[index][1]);
		var randG: Uint8ClampedArray = this.imageService.pngPaletteIndexes.map(index => randPngPaletteColours[index][2]);
		var drawImageData: ImageData = this.imageService.createImage(randR, randG, randB, this.imageService.opaque);

		this.pngPaletteDataEmitter.emit(drawImageData);
	}

  viewColour(n: number) {
    /*
      View only one colour in the palette at a given time.
      Input:
        -The index of the colour in the pngPaletteColourIndexes array
    */
    var newPngPaletteColours: number[][] = Array.from(this.imageService.pngPaletteColourArray).map((val, index) => index == n ? [255, 255, 255] : [0, 0, 0]);
    var newR = new Uint8ClampedArray(this.imageService.pngPaletteIndexes.map(val => newPngPaletteColours[val][0]));
    var newG = new Uint8ClampedArray(this.imageService.pngPaletteIndexes.map(val => newPngPaletteColours[val][1]));
    var newB = new Uint8ClampedArray(this.imageService.pngPaletteIndexes.map(val => newPngPaletteColours[val][2]));

		this.currentColours = this.imageService.pngPaletteColourArrayGroups[n].join(', ');

    return this.imageService.createImage(newR, newG, newB, this.imageService.opaque);
  }

  forward(n: number) {
    /*
      Show the Png Pallete *n* colours forward in the array.
    */
    this.currentPaletteNo += n;
    if (this.currentPaletteNo > this.maxPaletteNo) {
      this.currentPaletteNo -= (this.maxPaletteNo);
    }
    var drawImageData: ImageData = this.viewColour(this.currentPaletteNo-1);
    this.pngPaletteDataEmitter.emit(drawImageData);
  }

  back(n: number) {
    /*
      Show the Png Pallete *n* colours backwards in the array.
    */
    this.currentPaletteNo -= n;
    if (this.currentPaletteNo < 1) {
      this.currentPaletteNo += (this.maxPaletteNo);
    }
    var drawImageData: ImageData = this.viewColour(this.currentPaletteNo-1);
    this.pngPaletteDataEmitter.emit(drawImageData);
  }

}