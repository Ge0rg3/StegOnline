import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../../common-services/image.service';

@Component({
  selector: 'image-canvas',
  template: `<canvas #canvasElement></canvas>`
})
export class ImageCanvasComponent implements OnInit {

	@Input()
	set inputImageData(imageData: ImageData) {
		if (imageData) {
			this.updateCanvas(imageData);
		}
	}

  @ViewChild('canvasElement') canvasElement: ElementRef;

  public ctx: CanvasRenderingContext2D;
	public canvas: HTMLCanvasElement;

  constructor(private router: Router, private imageService: ImageService) { }


  ngOnInit() {
		this.customInit();
  }

	customInit() {
		//If no image, redirect back to home
    if (!this.imageService.defaultImageData) {
      this.router.navigate(['/home']);
      return;
    }
    this.canvas = this.canvasElement.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = this.imageService.width;
    this.canvas.height = this.imageService.height;
    this.ctx.putImageData(this.imageService.defaultImageData, 0, 0);
    this.imageService.canvas = this.canvas; //For downloading later
	}

  updateCanvas(imageObj: ImageData) {
		if (!this.ctx) {
			this.customInit();
			return;
		}
    this.ctx.putImageData(imageObj, 0, 0);
    this.imageService.canvas = this.canvas;
  }

}