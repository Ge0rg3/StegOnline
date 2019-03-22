import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imageTitle: string;
  uploadImageText: string;
  dragDropText: string;
  dragOverDropper: boolean;

  constructor(private router: Router, private imageService: ImageService) { }

  uploadImage(input: any) {
    //Handle file upload on homescreen
    if (input.target.files && input.target.files[0]) {
      var file: File = input.target.files[0];

      if (!file.type.match(/image\/.*/)) {
        this.dragDropText = `"${file.name}" is not a valid image file.`;
        return;
      }

      var reader: FileReader = new FileReader();
      reader.onload = (event: Event) => {
        this.uploadImageText = "CHANGE IMAGE";
        this.dragDropText = `"${file.name}" loaded successfully!`;
        this.imageTitle = file.name;
        this.imageService.initiateImage(reader.result as string);
        this.router.navigate(['/image']);
      };
      reader.readAsDataURL(file);
    }
  }

  toggleDrag() {
    //Handle drag over upload box
    this.dragOverDropper = !this.dragOverDropper;
  }

  ngOnInit() {
    this.dragOverDropper = false;
    this.uploadImageText = "UPLOAD IMAGE";
    this.dragDropText = "Drag and drop your image here";
  }

}
