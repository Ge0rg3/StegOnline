import { Injectable } from '@angular/core';
import { ImageService } from '../common-services/image.service';
import { HelpersService } from '../common-services/helpers.service';

@Injectable({
  providedIn: 'root'
})
export class EmbedDataService {

  constructor(private imageService: ImageService, private helpers: HelpersService) { }

	async embed(_selectedBits: {}, pixelOrder: string, bitOrder: string, bitPlaneOrder: string[], padBits: boolean) {
		/*
			This function houses the complex logic for embedding data into an image.
			It depends on ImageService's [r, g, b and a] arrays.
			Inputs:
				selectedBits : object literal - containing chosen bits for each colour.
					e.g. {'r':[0]}, {'r':[2, 1, 0], 'b':[2,1,0], 'g':[0]}
				pixelOrder: string - containing either "Row" or "Column", for the direction of extraction.
				bitOrder: string - either "MSB" or "LSB", changes the bit order when multiple bits are selected for a colour value.
				bitPlaneOrder: string array - The order of colour values
				 e.g. ['r', 'g', 'b', 'a'], ['g', 'b', 'r', 'a']
				padBits: boolean - whether or not to pad chosen planes with 0s after data has finished
			Example Use:
				embed({'r': [1,0], 'g':[], 'b':[0], 'a':[]}, "Row", "MSB", ['b','r','g','a'], false);
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
		//Convert to LSB if asked
		if (bitOrder == 'LSB') {
			for (var char of Object.keys(selectedBits)) {
				selectedBits[char] = selectedBits[char].reverse();
			}
		}
		//Vars for embedding
		var toHide: string = "0110100001100101011011000110110001101111001000000111010001101000011010010111001100100000011010010111001100100000011011100110111101110100011010000110100101101110011001110010000001100010011101010111010000100000011000010010000001110100011001010111001101110100001000000011101000101001".repeat(10);
		if (padBits) toHide += "0".repeat((this.imageService.r.length*Object.values(selectedBits).flat().length) - toHide.length);
		var toHidePos: number = 0;

		//For Rows:
		if (pixelOrder == "Row") {
			//For each pixel
			for (let i=0; i < this.imageService.r.length; i++) {
				//For each colour
				for (var colour of bitPlaneOrder) {
					//If selected...
					if (Object.keys(selectedBits).indexOf(colour) != -1) {
						//Get binary string for pixel
						var pixelBinary: string[] = this.helpers.intToBin(colourArrays[colour][i]).split('');
						for (var hideIndex of selectedBits[colour]) {
							if (toHidePos < toHide.length) {
								pixelBinary[7-hideIndex] = toHide[toHidePos++];
							}
						}
						colourArrays[colour][i] = parseInt(pixelBinary.join(''), 2);
					}
				}
			}
		}
		return this.imageService.createImage(colourArrays['r'], colourArrays['g'], colourArrays['b'], colourArrays['a']);
	}

}