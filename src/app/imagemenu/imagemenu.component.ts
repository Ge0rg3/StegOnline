import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-imagemenu',
  templateUrl: './imagemenu.component.html',
  styleUrls: ['./imagemenu.component.scss']
})
export class ImagemenuComponent implements OnInit {

  constructor(private router: Router, private imageService: ImageService) { }

  ngOnInit() {  }

}
