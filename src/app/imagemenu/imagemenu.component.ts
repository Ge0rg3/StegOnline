import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../common-services/image.service';
import { HelpersService } from '../common-services/helpers.service';
import { PanelSettingsService } from '../common-services/panel-settings.service';

@Component({
  selector: 'app-imagemenu',
  templateUrl: './imagemenu.component.html',
  styleUrls: ['./imagemenu.component.scss']
})
export class ImageMenuComponent implements OnInit {

  constructor(private router: Router, private imageService: ImageService, private helpers: HelpersService, private panelSettings: PanelSettingsService) { }

	drawImageData: ImageData;

  ngOnInit() {
		if (!this.imageService.defaultImageData) {
			this.router.navigate(['/upload']);
		}
	}


	reset() {
			/*
				Used to reset the image back to its original colour values
			*/
			this.panelSettings.closePanels();
			this.updateCanvas(this.imageService.defaultImageData);
	}

	updateCanvas(imageData: ImageData) {
		/*
			Subcomponents (i.e. bitplane browser) use this to control the canvas.
			This function acts as an intermediary between these subcomponents and the imagecanvas component.
		*/
		this.drawImageData = imageData;
	}

	toggleStringsPanel() {
		/*
			Used to show/hide the strings panel.
		*/
		var setFlag = this.panelSettings.showStrings;
		this.reset();
		if (!setFlag) this.panelSettings.showStrings = true;
	}

	toggleRgbaPanel() {
		/*
			Used to show/hide the Rgba panel.
		*/
		var setFlag = this.panelSettings.showRgba;
		this.reset();
		if (!setFlag) this.panelSettings.showRgba = true;
	}

	togglePngInfoPanel() {
		/*
			Used to show/hide the PngInfo panel.
		*/
		var setFlag = this.panelSettings.showPngInfo;
		this.reset();
		if (!setFlag) this.panelSettings.showPngInfo = true;
	}

	fullPlane(plane: number) {
		/*
			Used to view only one colour plane on the canvas:
				Input:
				  0: Red
					1: Green
					2: Blue
					3: Alpha
		*/
    this.panelSettings.closePanels();
		var colours: Uint8ClampedArray[] = [this.imageService.transparent.slice(0), this.imageService.transparent.slice(0), this.imageService.transparent.slice(0), this.imageService.opaque.slice(0)];
		switch (plane) {
			case 0:
				colours[0] = this.imageService.r;
				break;
			case 1:
				colours[1] = this.imageService.g;
				break;
			case 2:
				colours[2] = this.imageService.b;
				break;
			case 3:
				 colours[0] = colours[1] = colours[2] = this.imageService.a;
				break;
			default:
				return;
		}
		this.updateCanvas(this.imageService.createImage(colours[0], colours[1], colours[2], colours[3]));
	}

	inverse(inverseAlpha: boolean = false) {
		/*
			This inverses the colours in the image.
			  Input:
				  true/false: whether or not to also invert the alpha plane
		*/
    this.panelSettings.closePanels();
		var invR = this.imageService.r.map(val => 255 - val);
		var invG = this.imageService.g.map(val => 255 - val);
		var invB = this.imageService.b.map(val => 255 - val);
		var invA = (inverseAlpha) ? this.imageService.a.map(val => 255 - val) : this.imageService.a;
		this.updateCanvas(this.imageService.createImage(invR, invG, invB, invA));
	}

	lsbHalf() {
		/*
			This shows only the LSB half of each pixel
		*/
    this.panelSettings.closePanels();
		var newR = this.imageService.r.map(val => parseInt(this.helpers.intToBin(val).substr(4, 8)+"0000", 2));
		var newG = this.imageService.g.map(val => parseInt(this.helpers.intToBin(val).substr(4, 8)+"0000", 2));
		var newB = this.imageService.b.map(val => parseInt(this.helpers.intToBin(val).substr(4, 8)+"0000", 2));
		var newA = this.imageService.opaque;
		this.updateCanvas(this.imageService.createImage(newR, newG, newB, newA));
	}

  removeTransparency() {
    /*
      Replaces the alpha channel with pure 255s
    */
    this.panelSettings.closePanels();
    this.updateCanvas(this.imageService.createImage(this.imageService.r, this.imageService.g, this.imageService.b, this.imageService.opaque));
  }

}