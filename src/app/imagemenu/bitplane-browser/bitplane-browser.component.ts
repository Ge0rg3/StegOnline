import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ImageService } from '../../common-services/image.service';
import { HelpersService } from '../../common-services/helpers.service';
import { PanelSettingsService } from '../../common-services/panel-settings.service';

@Component({
  selector: 'bitplane-browser',
  templateUrl: './bitplane-browser.component.html'
})
export class BitPlaneBrowserComponent implements OnInit {

	@Output() bitPlaneDataEmitter: EventEmitter<ImageData> = new EventEmitter<ImageData>();

  colourNames: string[] = ["Red", "Green", "Blue", "Alpha"];
  currentBitPlane: string = "Red 0";
	showBitPlaneBrowser: boolean = false;
	currentColour: number = 0;
	currentPlane: number = 0;
  isCached: boolean = false;
  cache = {};
  loadingStatus: string = "";

  constructor(private imageService: ImageService, private helpers: HelpersService, private panelSettings: PanelSettingsService) { }

  ngOnInit() {
		//Cannot use init event for canvas interaction -- canvas has not been initialised yet
  }

	toggleBrowser() {
		/*
			Replace Bitplane Browser with "Open Bitplane Browser", or vice versa.
		*/
		if (this.panelSettings.showBitPlaneBrowser) {
			this.bitPlaneDataEmitter.emit(this.imageService.defaultImageData);
			this.panelSettings.closePanels();
		}
		else {
      this.panelSettings.closePanels();
			this.viewBitPlane(this.currentColour, this.currentPlane);
			this.panelSettings.showBitPlaneBrowser = true;
		}
	}

	nextBit() {
		/*
			View the next bit plane.
		*/
		if (++this.currentPlane == 8) {
			this.currentPlane = 0;
			this.nextColour(false);
		}
		this.viewBitPlane(this.currentColour, this.currentPlane);
	}

	nextColour(view: boolean = true) {
		/*
			View the next colour.
			Input: True/False, display the new colour?
		*/
		if (++this.currentColour == (this.imageService.isTransparent ? 4 : 3)) this.currentColour = 0;
		if (view) this.viewBitPlane(this.currentColour, this.currentPlane);
	}

	previousBit() {
		/*
			View the previous bit plane.
		*/
		if (this.currentPlane-- == 0) {
			this.currentPlane = 7;
			this.previousColour(false);
		}
		this.viewBitPlane(this.currentColour, this.currentPlane);
	}

	previousColour(view: boolean = true) {
		/*
			View the previous colour.
			Input: True/False, display the new colour?
		*/
		if (this.currentColour-- == 0) this.currentColour = (this.imageService.isTransparent ? 3 : 2);
		if (view) this.viewBitPlane(this.currentColour, this.currentPlane);
	}

  async preloadBitPlanes() {
    /*
      Used to cache bit planes to reduce loading times.
    */
    var count: number = 0;
    this.isCached = true;
    for (let colour=0; colour < (this.imageService.isTransparent ? 4 : 3); colour++) {
      for (let plane=0; plane < 8; plane++) {
        this.loadingStatus = ((++count)+"/"+(this.imageService.isTransparent ? 32 : 24));
        await this.helpers.sleep(0);
        this.cache[colour+""+plane] = this.viewBitPlane(colour, plane, false);
      }
    }
    this.loadingStatus = "Cache Loaded!";
  }

  viewBitPlane(colour: number, plane: number, view: boolean = true) {
    /*
      Returns imagedata for a desired bit plane
        Input:
          colour: 0, 1, 2 or 3 for Red, Green, Blue or Alpha respectively
          plane: 0, 1, 2, 3, 4, 5, 6 or 7. This is the desired plane to see
          view: true/false, whether or not to emit output to canvas
    */
    //Set current bitplane text
    this.currentBitPlane = (this.colourNames[this.currentColour]+" "+this.currentPlane);
    //If cached, use that instead
    if (this.cache[colour+""+plane]) {
      this.bitPlaneDataEmitter.emit(this.cache[colour+""+plane]);
      return;
    }
		//Get colour
		var colourArray: Uint8ClampedArray;
		switch (colour) {
			case 0:
			  colourArray = this.imageService.r;
				break;
			case 1:
				colourArray = this.imageService.g;
				break;
			case 2:
				colourArray = this.imageService.b;
				break;
			case 3:
				colourArray = this.imageService.a;
				break;
		}
		//Browse through each pixel, and draw b/w
		var pixelValues: number[] = [];
		for (var pixel of Array.from(colourArray)) {
			if (this.helpers.intToBin(pixel)[7-plane] == "1") pixelValues.push(0);
			else pixelValues.push(255);
		}
		//Turn from int to Uint8ClampedArray
		var convertedPixelValues: Uint8ClampedArray = new Uint8ClampedArray(pixelValues);
		var finishedData: ImageData = this.imageService.createImage(convertedPixelValues, convertedPixelValues, convertedPixelValues, this.imageService.opaque);
    //Emit to canvas / Return for cache
    if (view) {
      this.bitPlaneDataEmitter.emit(finishedData);
    }
		return finishedData;
  }

}