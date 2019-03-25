import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../../image.service';

@Component({
  selector: 'app-imagecanvas',
  template: `<canvas #canvasElement></canvas>`
})
export class ImageCanvasComponent implements OnInit {

	@Input()
	set drawImageData(drawImageData: ImageData) {
		if (drawImageData) {
			this.updateCanvas(drawImageData);
		}
	}

  @ViewChild('canvasElement') canvasElement: ElementRef;

  public ctx: CanvasRenderingContext2D;
	public canvas: HTMLCanvasElement;

  constructor(private router: Router, private imageService: ImageService) { }


  ngOnInit() {
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
  }

  updateCanvas(imageObj: ImageData) {
    this.ctx.putImageData(imageObj, 0, 0);
  }

}