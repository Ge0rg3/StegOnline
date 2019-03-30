import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ImageService } from '../../common-services/image.service';
import { HelpersService } from '../../common-services/helpers.service';
import { LsbOptionsService } from '../lsb-options.service';
import { EmbedDataService } from '../embed-data.service';

@Component({
  selector: 'app-embed-menu',
  templateUrl: './embed-menu.component.html',
  styleUrls: ['./embed-menu.component.scss']
})
export class EmbedMenuComponent implements OnInit {

  constructor(private imageService: ImageService, private helpers: HelpersService, private lsbOptions: LsbOptionsService, private embedService: EmbedDataService) { }

  fileBinary: string;
  textInput: string;
	embedComplete: boolean = false;
  inputType: string = "Text";

	@ViewChild('canvasElement') public canvasElement: ElementRef;

  ngOnInit() {
		this.lsbOptions.currentTable = 'embed';
  }

	async startEmbed() {
		/*
			This function acts as an intermediary between the Embed Service's embed function, the options input and the image output.
		*/

    var binary: string = this.inputType == "Text" ? this.helpers.textToBin(this.textInput) : this.fileBinary;
		//Get new image
		var outputImage: ImageData = await this.embedService.embed(binary, this.lsbOptions.selectedBits, this.lsbOptions.pixelOrder, this.lsbOptions.bitOrder, this.lsbOptions.bitPlaneOrder, (this.lsbOptions.padBits == "Yes"));

		//Display new image on canvas
		let canvas = this.canvasElement.nativeElement;
		let ctx = canvas.getContext('2d');
		ctx.imageSmoothingEnabled = false;
		canvas.width = this.imageService.width;
		canvas.height = this.imageService.height;
		ctx.putImageData(outputImage, 0, 0);

		this.embedComplete = true;
	}

  uploadFile(input: any) {
    /*
      This is used to handle the file upload feature.
      The binary string taken from the file is stored in the toEmbed attribute
    */
    if (input.target.files[0]) {
      var file: File = input.target.files[0];
      var byteReader: FileReader = new FileReader();
      byteReader.onload = (event: Event) => {
        var inputData: Uint8Array = new Uint8Array(byteReader.result as ArrayBuffer);
        var inputBytes: string[] = Array.from(inputData).map(b => String.fromCharCode(b));
        this.fileBinary = this.helpers.textToBin(inputBytes);
      }
      byteReader.readAsArrayBuffer(input.target.files[0]);
    }

  }

}
