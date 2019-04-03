import { Injectable } from '@angular/core';
import { ImageService } from '../common-services/image.service';
import { HelpersService } from '../common-services/helpers.service';

@Injectable({
  providedIn: 'root'
})
export class EmbedDataService {

  constructor(private imageService: ImageService, private helpers: HelpersService) { }

  loadingMessage: string = "0%";
  embeddedCanvas: HTMLCanvasElement;

	async embed(toHide: string, _selectedBits: {}, pixelOrder: string, bitOrder: string, bitPlaneOrder: string[], padBits: boolean) {
		/*
			This function houses the complex logic for embedding data into an image.
			It depends on ImageService's [r, g, b and a] arrays.
			Inputs:
        toHide: string - a string of binary data
          e.g. "10100101010101010"
				selectedBits : object literal - containing chosen bits for each colour.
					e.g. {'r':[0]}, {'r':[2, 1, 0], 'b':[2,1,0], 'g':[0]}
				pixelOrder: string - containing either "Row" or "Column", for the direction of extraction.
				bitOrder: string - either "MSB" or "LSB", changes the bit order when multiple bits are selected for a colour value.
				bitPlaneOrder: string array - The order of colour values
				 e.g. ['r', 'g', 'b', 'a'], ['g', 'b', 'r', 'a']
				padBits: boolean - whether or not to pad chosen planes with 0s after data has finished
			Example Use:
				embed("10100101010101010", {'r': [1,0], 'g':[], 'b':[0], 'a':[]}, "Row", "MSB", ['b','r','g','a'], false);
		*/
		//Custom colour copies
    var colourArrays: {} = {
      'r': this.imageService.r.slice(0),
      'g': this.imageService.g.slice(0),
      'b': this.imageService.b.slice(0),
      'a': this.imageService.a.slice(0)
    }
		//Remove blanks from selectedBits
		var selectedBits: {} = {};
		if (_selectedBits['r'].length > 0) selectedBits['r'] = _selectedBits['r'];
		if (_selectedBits['g'].length > 0) selectedBits['g'] = _selectedBits['g'];
		if (_selectedBits['b'].length > 0) selectedBits['b'] = _selectedBits['b'];
		if (_selectedBits['a'].length > 0) selectedBits['a'] = _selectedBits['a'];
		//Sort bits
		for (var char of Object.keys(selectedBits)) {
			selectedBits[char] = selectedBits[char].sort();
		}
		//Convert to LSB if asked
		//Note: This may look odd, but we must think of this from the point of view of an extractor
		if (bitOrder == 'MSB') {
			for (var char of Object.keys(selectedBits)) {
				selectedBits[char] = selectedBits[char].reverse();
			}
		}
		//Vars for embedding
		if (padBits) toHide += "0".repeat((this.imageService.r.length*Object.values(selectedBits).flat().length) - toHide.length);
		var toHidePos: number = 0;
		bitPlaneOrder = bitPlaneOrder.filter(char => char != 'a');

		//For Rows:
    if (pixelOrder == "Row") {
			//For each pixel
			for (let i=0; i < this.imageService.r.length; i++) {
        //Update progress bar (Slower, lets users know that the page isn't stuck)
        if (i % 25000 == 0) {
          this.loadingMessage = Math.floor(toHidePos*100 / toHide.length).toString()+"%";
          await this.helpers.sleep(0);
        }
        if (toHidePos > toHide.length) break;
				//For each colour
				for (var colour of bitPlaneOrder) {
          if (toHidePos > toHide.length) break;
					//If selected...
					if (Object.keys(selectedBits).indexOf(colour) != -1) {
						//Get binary string for pixel
						var pixelBinary: string[] = this.helpers.intToBin(colourArrays[colour][i]).split('');
            //Edit pixel with new value
						for (var hideIndex of selectedBits[colour]) {
							if (toHidePos < toHide.length) {
								pixelBinary[7-hideIndex] = toHide[toHidePos++];
							}
						}
						colourArrays[colour][i] = parseInt(pixelBinary.join(''), 2);
					}
				}
			}
      return this.imageService.createImage(colourArrays['r'], colourArrays['g'], colourArrays['b'], this.imageService.opaque);
		}

    //For Columns:
    else if (pixelOrder == "Column") {
      var copiedRgba = this.imageService.rgba.slice(0);
      //For each pixel column
      for (let c=0; c < this.imageService.width; c++) {
        //Update progress bar (slower, but let's user know that page isn't frozen)
        if (c % 100 == 0) {
          this.loadingMessage = Math.floor(toHidePos*100 / toHide.length).toString()+"%";
          await this.helpers.sleep(0);
        }
        if (toHidePos > toHide.length) break;
        //For each pixel row
        for (let r=0; r < this.imageService.height; r++) {
          if (toHidePos > toHide.length) break;
          var index: number = (r*this.imageService.width*4)+(c*4);

          //For each colour
          for (var colour of bitPlaneOrder) {
            if (Object.keys(selectedBits).indexOf(colour) != -1) {
              //Work out which colour we're loooking at
              var colourIndex: number = this.imageService.rgbaChars.indexOf(colour);

              //Get colour's binary value
              var pixelBinary: string[] = this.helpers.intToBin(copiedRgba[index+colourIndex]).split('');
              //Edit pixel with new value
              for (var hideIndex of selectedBits[colour]) {
  							if (toHidePos < toHide.length) {
  								pixelBinary[7-hideIndex] = toHide[toHidePos++];
  							}
  						}
              //Update pixel value
              copiedRgba[index+colourIndex] = parseInt(pixelBinary.join(''), 2);
            }
          }
        }
      }
      var rgbaData: Uint8ClampedArray = new Uint8ClampedArray(copiedRgba);
      return new ImageData(rgbaData, this.imageService.width, this.imageService.height);
    }
	}
}