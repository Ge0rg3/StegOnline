import { Injectable } from '@angular/core';
import { ImageService } from '../common-services/image.service';
import { HelpersService } from '../common-services/helpers.service';


@Injectable({
  providedIn: 'root'
})
export class ExtractDataService {

  loadingMessage: string = "0%";

  constructor(private imageService: ImageService, private helpers: HelpersService) { }

  async extract(_selectedBits: {}, pixelOrder: string, bitOrder: string, bitPlaneOrder: string[], trimBits: boolean) {
    /*
      This function houses the complex logic for extacting data from the image.
      It depends on ImageService's [r, g, b and a] arrays.
      Inputs:
         selectedBits : object literal - containing chosen bits for each colour.
           e.g. {'r':[0]}, {'r':[2, 1, 0], 'b':[2,1,0], 'g':[0]}
         pixelOrder: string - containing either "Row" or "Column", for the direction of extraction.
         bitOrder: string - either "MSB" or "LSB", changes the bit order when multiple bits are selected for a colour value.
         bitPlaneOrder: string array - The order of colour values
          e.g. ['r', 'g', 'b', 'a'], ['g', 'b', 'r', 'a']
         trimBits: boolean - whether or not to trim excess 0s
      Example use:
        extract({'r': [1,0], 'b':[0]}, "Row", "MSB", ['b','r','g','a'], true);
    */
    //Custom colour copies
    var colourArrays: {} = {
      'r': this.imageService.r,
      'g': this.imageService.g,
      'b': this.imageService.b,
      'a': this.imageService.a
    }
    //Remove blanks from selectedBits
    var selectedBits: {} = {};
    if (_selectedBits['r'].length > 0) selectedBits['r'] = _selectedBits['r'];
    if (_selectedBits['g'].length > 0) selectedBits['g'] = _selectedBits['g'];
    if (_selectedBits['b'].length > 0) selectedBits['b'] = _selectedBits['b'];
    if (_selectedBits['a'].length > 0) selectedBits['a'] = _selectedBits['a'];
    //Output string
    var hex: string = "";
    //Vars for extraction
    var currentByte: string = "";
    var bitCount: number = 0;

    //For Rows:
    if (pixelOrder == "Row") {
      //For each pixel
      for (let i=0; i < this.imageService.r.length; i++) {
        //Update progress bar (Slower, lets users know that the page isn't stuck)
        if (i % 25000 == 0) {
          this.loadingMessage = Math.floor(i*100 / this.imageService.r.length).toString()+"%";
          await this.helpers.sleep(0);
        }
        //For each colour (in order)
        for (var colour of bitPlaneOrder) {
          //If selected...
          if (Object.keys(selectedBits).indexOf(colour) != -1) {
            //Get binary string for pixel
            var pixelBinary: string[] = this.helpers.intToBin(colourArrays[colour][i]).split('');
            //Extract only inputted bits
            var extractedBits: string[] = pixelBinary.filter((val, index) => selectedBits[colour].indexOf(7-index) != -1);
            //Reverse if asked for
            if (bitOrder == 'LSB') extractedBits = extractedBits.reverse();

            for (var char of extractedBits) {
              currentByte += char;
              //If one byte, turn to hex and add to hex string
              if (++bitCount % 8 == 0) {
                //Turn to hex
                let tempHex: string = parseInt(currentByte, 2).toString(16);
                //If hex is only 1 character, pad out.
                if (tempHex.length == 1) hex += "0";
                hex += tempHex;
                currentByte = "";
              }
            }

          }
        }
      }
    }


    //For columns
    else if (pixelOrder == "Column") {
      //For each pixel column
      for (let c=0; c < this.imageService.width; c++) {
        //Update progress bar (slower, but let's user know that page isn't frozen)
        if (c % 100 == 0) {
          this.loadingMessage = Math.floor(c*100 / this.imageService.width).toString()+"%";
          await this.helpers.sleep(0);
        }
        //For each pixel row
        for (let r=0; r < this.imageService.height; r++) {
          //For each colour
          var index: number = (r*this.imageService.width*4)+(c*4);

          for (var colour of bitPlaneOrder) {
            if (Object.keys(selectedBits).indexOf(colour) != -1) {
              //Work out which colour we're loooking at
              var colourIndex: number = this.imageService.rgbaChars.indexOf(colour);
              //Get this colour's binary value
              var pixelBinary: string[] = this.helpers.intToBin(this.imageService.rgba[index+colourIndex]).split('');
              //Extract only inputted bits
              var extractedBits: string[] = pixelBinary.filter((val, index) => selectedBits[colour].indexOf(7-index) != -1);
              //Reverse if asked for
              if (bitOrder == 'LSB') extractedBits = extractedBits.reverse();

              for (var char of extractedBits) {
                currentByte += char;
                //If one byte, turn to hex and add to hex string
                if (++bitCount % 8 == 0) {
                  //Turn to hex
                  let tempHex: string = parseInt(currentByte, 2).toString(16);
                  //If hex is only 1 character, pad out.
                  if (tempHex.length == 1) hex += "0";
                  hex += tempHex;
                  currentByte = "";
                }
              }

            }
          }
        }
      }
    }

    //Clean up remaining bits
    if (currentByte.length > 0) {
      hex += parseInt(currentByte, 2).toString(16);
    }
    //Trim final bits
    if (trimBits) {
      hex = hex.replace(/(?:00)+$/,"");
    }
    return hex;
  }

}
