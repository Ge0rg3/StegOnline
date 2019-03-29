import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ImageService } from '../../common-services/image.service';
import { LsbOptionsService } from '../lsb-options.service';
import { EmbedDataService } from '../embed-data.service';

@Component({
  selector: 'app-embed-menu',
  templateUrl: './embed-menu.component.html',
  styleUrls: ['./embed-menu.component.scss']
})
export class EmbedMenuComponent implements OnInit {

  constructor(private imageService: ImageService, private lsbOptions: LsbOptionsService, private embedService: EmbedDataService) { }

	embedComplete: boolean = false;
	drawImageData: ImageData = this.imageService.defaultImageData;

	@ViewChild('canvasElement') public canvasElement: ElementRef;

  ngOnInit() {
		this.lsbOptions.currentTable = 'embed';
  }

	async startEmbed() {
		/*
			This function acts as an intermediary between the Embed Service's embed function, the options input and the image output.
		*/

		//Get new image
		var outputImage: ImageData = await this.embedService.embed({'r': [7,6], 'g':[], 'b':[], 'a':[]}, "Row", "LSB", ['r','g','b','a'], true);

		//Display new image on canvas
		let canvas = this.canvasElement.nativeElement;
		let ctx = canvas.getContext('2d');
		ctx.imageSmoothingEnabled = false;
		canvas.width = this.imageService.width;
		canvas.height = this.imageService.height;
		ctx.putImageData(outputImage, 0, 0);

		this.embedComplete = true;
	}

}