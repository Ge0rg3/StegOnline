import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  //Basic image details
  r: string[] = [];
  g: string[] = [];
  b: string[] = [];
  a: string[] = [];
  isPng: boolean = false;

  constructor() { }

  //Used to find RGB values/image data from the inputted image
  initiateImage(imageData: string) {
    
  }

}
