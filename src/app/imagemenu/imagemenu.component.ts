import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-imagemenu',
  templateUrl: './imagemenu.component.html',
  styleUrls: ['./imagemenu.component.scss']
})
export class ImageMenuComponent implements OnInit {

  constructor(private router: Router, private imageService: ImageService) { }

  toShow: any;

  ngOnInit() {
    this.toShow = this.imageService.pngType;
  }

}
