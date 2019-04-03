import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PanelSettingsService } from '../../common-services/panel-settings.service';
import { HelpersService } from '../../common-services/helpers.service';
import { ImageService } from '../../common-services/image.service';

@Component({
  selector: 'pngpalette-browser',
  templateUrl: './pngpalette-browser.component.html'
})
export class PngPaletteBrowserComponent implements OnInit {

	@Output() pngPaletteDataEmitter: EventEmitter<ImageData> = new EventEmitter<ImageData>();

  constructor(private imageService: ImageService, private helpers: HelpersService, private panelSettings: PanelSettingsService) { }

  ngOnInit() {
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
			randPngPaletteColours = this.imageService.pngPaletteColourIndexes.map(trio => [this.helpers.ranbetween(0, 255),50,50]);
		} else {
			randPngPaletteColours = this.imageService.pngPaletteColourIndexes.map(trio => [this.helpers.ranbetween(0, 255),this.helpers.ranbetween(0, 255),this.helpers.ranbetween(0, 255)]);
		}
		var randR: Uint8ClampedArray = this.imageService.pngPaletteColourArray.map(index => randPngPaletteColours[index][0]);
		var randB: Uint8ClampedArray = this.imageService.pngPaletteColourArray.map(index => randPngPaletteColours[index][1]);
		var randG: Uint8ClampedArray = this.imageService.pngPaletteColourArray.map(index => randPngPaletteColours[index][2]);
		var drawImageData: ImageData = this.imageService.createImage(randR, randG, randB, this.imageService.opaque);

		this.pngPaletteDataEmitter.emit(drawImageData);
	}

}