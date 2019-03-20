import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imageTitle: string;
  uploadImageText: string;
  dragOverDropper: boolean;

  constructor() { }

  uploadImage(input: any) {
    //Handle file upload on homescreen
    if (input.target.files && input.target.files[0]) {

      var file: File = input.target.files[0];
      var reader: FileReader = new FileReader();

      reader.onload = (event: Event) => {
        //Fiund data in (reader.result as string)
        this.uploadImageText = "CHANGE IMAGE";
        this.imageTitle = file.name;
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
  }

}
