import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LsbOptionsService {

  //Current table open (extract or embed)
  currentTable: string;

  //The selected R, G, B and A bits
  selectedBits: {} = {'r': [], 'g': [], 'b': [], 'a': []};

  //Get pixels by row or column
  pixelOrder: string = "Row";

  //Extract bits/Embed data in either LSB or MSB order
  bitOrder: string = "MSB";

  //Extract/Embed data order of each pixel
  bitPlaneOrder: string[] = ['r', 'g', 'b', 'a'];

  //Remove trailing 0s from data
  trimBits: string = "No";

  //Pad out image with trailing 0s
  padBits: string = "No";

  constructor() { }
}
