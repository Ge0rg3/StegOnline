import { Component, OnInit } from '@angular/core';
import { ImageService } from '../common-services/image.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  imageTitle: string;
  uploadImageText: string;
  dragDropText: string;
  dragOverDropper: boolean;

  constructor(private imageService: ImageService) { }

  uploadImage(input: any) {
    //Handle file upload on homescreen
    if (input.target.files && input.target.files[0]) {
      var file: File = input.target.files[0];

      if (!file.type.match(/image\/.*/)) {
        this.dragDropText = `"${file.name}" is not a valid image file.`;
        return;
      }

			//Initiate RGB stuff
      var reader: FileReader = new FileReader();
      reader.onload = async () => {
        this.uploadImageText = "CHANGE IMAGE";
        this.dragDropText = `Loading "${file.name}"...`;
        this.imageTitle = file.name;
        this.imageService.fileName = file.name;
        this.imageService.initiateImage((reader.result as string), true);
      };

			//Get strings
			var stringReader: FileReader = new FileReader();
			stringReader.onloadend = async () => {
				this.imageService.bytes = (stringReader.result as string);
				reader.readAsDataURL(file);
			}
    }
		stringReader.readAsBinaryString(file);
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