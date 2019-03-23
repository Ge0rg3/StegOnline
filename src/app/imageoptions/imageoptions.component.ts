import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-imageoptions',
  templateUrl: './imageoptions.component.html',
  styleUrls: ['./imageoptions.component.scss']
})
export class ImageOptionsComponent implements OnInit {

  constructor(private router: Router, private imageService: ImageService) { }

  toShow: any;

  ngOnInit() {
    this.toShow = this.imageService.pngType;
  }

}
