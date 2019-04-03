import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './common-services/image.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stegonline';

	constructor(private router: Router, private imageService: ImageService) {};

}