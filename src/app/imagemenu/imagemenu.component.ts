import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../services/image.service';
import { HelpersService } from '../services/helpers.service';

@Component({
  selector: 'app-imagemenu',
  templateUrl: './imagemenu.component.html',
  styleUrls: ['./imagemenu.component.scss']
})
export class ImageMenuComponent implements OnInit {

  constructor(private router: Router, private imageService: ImageService, private helpers: HelpersService) { }

	drawImageData: ImageData;

  ngOnInit() { }


	reset() {
			/*
				Used to reset the image back to its original colour values
			*/
			this.drawImageData = this.imageService.defaultImageData;
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
		this.drawImageData = this.imageService.createImage(colours[0], colours[1], colours[2], colours[3]);
	}

	inverse(inverseAlpha: boolean = false) {
		/*
			This inverses the colours in the image.
			  Input:
				  true/false: whether or not to also invert the alpha plane
		*/
		var invR = this.imageService.r.map(val => 255 - val);
		var invG = this.imageService.g.map(val => 255 - val);
		var invB = this.imageService.b.map(val => 255 - val);
		var invA = (inverseAlpha) ? this.imageService.a.map(val => 255 - val) : this.imageService.a;
		this.drawImageData = this.imageService.createImage(invR, invG, invB, invA);
	}

	lsbHalf() {
		/*
			This shows only the LSB half of each pixel
		*/
		var newR = this.imageService.r.map(val => parseInt(this.helpers.intToBin(val).substr(4, 8)+"0000", 2));
		var newG = this.imageService.g.map(val => parseInt(this.helpers.intToBin(val).substr(4, 8)+"0000", 2));
		var newB = this.imageService.b.map(val => parseInt(this.helpers.intToBin(val).substr(4, 8)+"0000", 2));
		var newA = this.imageService.opaque;
		this.drawImageData = this.imageService.createImage(newR, newG, newB, newA);
	}

  removeTransparency() {
    /*
      Replaces the alpha channel with pure 255s
    */
    this.drawImageData = this.imageService.createImage(this.imageService.r, this.imageService.g, this.imageService.b, this.imageService.opaque);
  }

}
