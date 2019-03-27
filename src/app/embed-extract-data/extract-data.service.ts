import { Injectable } from '@angular/core';
import { ImageService } from '../common-services/image.service';


@Injectable({
  providedIn: 'root'
})
export class ExtractDataService {

  constructor() { }

  extract() {
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
        extract({'r': [1,0], 'b':[0]}, "Row", "MSB", ['b','r','g','a'], true)
    */
    
  }


}
