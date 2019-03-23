import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../../image.service';

@Component({
  selector: 'app-imagecanvas',
  template: `<canvas #canvasElement></canvas>`
})
export class ImageCanvasComponent implements OnInit {

  @ViewChild('canvasElement') canvasElement: ElementRef;
  public ctx: CanvasRenderingContext2D;

  constructor(private router: Router, private imageService: ImageService) { }

  canvas: HTMLCanvasElement;

  ngOnInit() {
    //If no image, redirect back to home
    if (!this.imageService.defaultImageData) {
      this.router.navigate(['/home']);
      return;
    }
    var canvas = this.canvasElement.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    canvas.width = this.imageService.width;
    canvas.height = this.imageService.height;
    this.ctx.putImageData(this.imageService.defaultImageData, 0, 0);
  }

  updateCanvas() {
    // var imageData = this.imageService.createImage();
    // this.ctx.putImageData(imageData, 0, 0);
  }

}
