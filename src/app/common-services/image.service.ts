import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare var PngImage: any;

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private router: Router) { }

  //Basic image details
  public rgba: Uint8ClampedArray; //one array with all rgba values
  public r: Uint8ClampedArray; //one array with only r values
  public g: Uint8ClampedArray; //one array with only g values
  public b: Uint8ClampedArray; //one array with only b values
  public a: Uint8ClampedArray; //one array with only a values
	//Image size
  public width: number;
  public height: number;
	//Png specific options
  public isPng: boolean;
	public isTransparent: boolean;
  public pngType: number;
	public pngToyObj: any;
	public chunks: any;
	//Palette if PNG is parsed via palette
	public pngPaletteIndexes: Uint8ClampedArray; //One connected array containing the palette index for each pixel
  public pngPaletteColourArray: Uint8Array; //One connected array containing the palette RGB values
	public pngPaletteColourArrayGroups: number[][]; //Lists of RGB colours (pngPalleteColourArray split into its RGB groups)
	//Default image RGB values
  public defaultImageData: ImageData;
	//Pure 0/255 filled Uint8ClampedArrays:
	public opaque: Uint8ClampedArray;
	public transparent: Uint8ClampedArray;
  //Filename/canvas for downloading
  public fileName: string;
  public canvas: HTMLCanvasElement;
  //Common image helper data
  public rgbaChars: string[] = ['r', 'g', 'b', 'a'];
	//File bytes and operations
	public bytes: string;
	public stringsCache: string[];


  initiateImage(imageData: string, redirect: boolean = false) {
    /*
    Used to find RGB values/image data from the inputted image
    Inputs:
    -imageData: Base64 encoded image
    -redirect: Whether or not to redirect to /image
    */
      //If PNG, the we use initiatePNG function.
      this.isPng = false;
      this.isTransparent = false;
      if (imageData.match("^data:image/png;base64,")) {
        this.isPng = true;
          this.initiatePNG(imageData, redirect);
          return;
      }
      //If not, we parse using canvas API
      var imageObj: HTMLImageElement = new Image();
      var self: ImageService = this; // We're about to lose our scope, hold on.
      imageObj.onload = () => {
        //Init fake canvas
        var canvas: HTMLCanvasElement = document.createElement('canvas');
        var ctx: CanvasRenderingContext2D = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;
        self.width = imageObj.width;
        self.height = imageObj.height;
        ctx.drawImage(imageObj, 0, 0);
        //Extract values from canvas
        self.rgba = ctx.getImageData(0, 0, imageObj.width, imageObj.height).data;
        self.r = self.rgba.filter((val, index) => index % 4 == 0);
        self.g = self.rgba.filter((val, index) => (index-1) % 4 == 0);
        self.b = self.rgba.filter((val, index) => (index-2) % 4 == 0);
        self.a = new Uint8ClampedArray(self.r.length).fill(255);
        self.opaque = self.a;
				self.transparent = new Uint8ClampedArray(self.r.length).fill(0);
        self.defaultImageData = self.createImage();
        if (redirect) self.router.navigate(['/image']);
      }
      imageObj.src = imageData;

  }


  initiatePNG(imageData: string, redirect: boolean = false) {
    /*
    Used to find RGB(A) values from PNGs (parsed with pngtoy, instead of canvas API)
    We make this asynchronous as PNGtoy uses promises when decoding images
    Inputs:
    -imageData: Base64 encoded image
    -redirect: Whether or not to redirect to /image
    */
    var pngIm: any = new PngImage();
    var self: ImageService = this; // We're about to lose our scope, hold on.
    pngIm.onload = async function() {
      //Get core data
      var pngObj: any = pngIm.pngtoy;
			self.chunks = pngObj.chunks;
			self.pngToyObj = pngObj;
      // var pngData: any = await pngObj.decode();
      pngObj.decode().then((data) => {
        var pngData: any = data;
        self.rgba = pngData.bitmap;
        self.width = pngData.width;
        self.height = pngData.height;
        //Work out rgba data format -- see https://www.w3.org/TR/PNG-Chunks.html for type specs
        self.pngType = pngObj.get_IHDR().type; //0: Grayscale, 2: RGB triple, 3: Palette index, 4: Grayscale + alpha, 6: RGBA
        if (self.pngType == 3) { // Palette
					self.pngPaletteIndexes = pngData.bitmap;
          self.pngPaletteColourArray = pngObj.get_PLTE().palette;
          self.pngPaletteColourArrayGroups = [];
          for (let i=0; i < self.pngPaletteColourArray.length; i += 3) {
            self.pngPaletteColourArrayGroups.push([self.pngPaletteColourArray[i], self.pngPaletteColourArray[i+1], self.pngPaletteColourArray[i+2]]);
          }
          self.r = self.pngPaletteIndexes.map(index => self.pngPaletteColourArrayGroups[index][0]);
          self.g = self.pngPaletteIndexes.map(index => self.pngPaletteColourArrayGroups[index][1]);
          self.b = self.pngPaletteIndexes.map(index => self.pngPaletteColourArrayGroups[index][2]);
          self.a = new Uint8ClampedArray(self.r.length).fill(255);
          //Generate full RGBA array
          var tempRgba = [];
          for (let i=0; i < self.r.length; i++) {
            tempRgba.push(self.r[i], self.g[i], self.b[i], self.a[i]);
          }
          self.rgba = new Uint8ClampedArray(tempRgba);
        }
        else if (self.pngType == 2) { //Regular RGB
          self.r = self.rgba.filter((val, index) => index % 3 == 0);
          self.g = self.rgba.filter((val, index) => (index-1) % 3 == 0);
          self.b = self.rgba.filter((val, index) => (index-2) % 3 == 0);
          self.a = new Uint8ClampedArray(self.r.length).fill(255);
          //Generate full RGBA array
          var tempRgba = [];
          for (let i=0; i < self.r.length; i++) {
            tempRgba.push(self.r[i], self.g[i], self.b[i], self.a[i]);
          }
          self.rgba = new Uint8ClampedArray(tempRgba);

        }
        else if (self.pngType == 6) { // RGBA values
          self.r = self.rgba.filter((val, index) => index % 4 == 0);
          self.g = self.rgba.filter((val, index) => (index-1) % 4 == 0);
          self.b = self.rgba.filter((val, index) => (index-2) % 4 == 0);
          self.a = self.rgba.filter((val, index) => (index-3) % 4 == 0);
					self.isTransparent = (self.a.filter(n => n != 255).length > 0);
        }
        else {
          alert(`Png type "${self.pngType}" not supported yet :(`);
        }

				self.opaque = new Uint8ClampedArray(self.r.length).fill(255);
				self.transparent = new Uint8ClampedArray(self.r.length).fill(0);
        self.defaultImageData = self.createImage();
        //Redirect to image options if specified
        if (redirect) self.router.navigate(['/image']);
      })
    }
    pngIm.src = imageData;
  }


  createImage(r: Uint8ClampedArray = this.r, g: Uint8ClampedArray = this.g, b: Uint8ClampedArray = this.b, a: Uint8ClampedArray = this.a): ImageData {
    /*
    Returns image data from the inputted RGBA arrays (or original RGBA arrays).
    This can then be drawn onto a canvas with `ctx.putImageData(createImage(), 0, 0)`.
    */
    var combinedRGBA: Array<number> = [];
    for (let i: number = 0; i < r.length; i++) {
      combinedRGBA.push(r[i], g[i], b[i], a[i]);
    }
    var uIntRGBA: Uint8ClampedArray = new Uint8ClampedArray(combinedRGBA);
    var imageObj: ImageData = new ImageData(uIntRGBA, this.width, this.height);
    return imageObj;
  }
}