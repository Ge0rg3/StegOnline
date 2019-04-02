import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../common-services/image.service';
import { LsbOptionsService } from '../lsb-options.service';

@Component({
  selector: 'lsb-settings',
  templateUrl: './lsb-settings.component.html'
})
export class LsbSettingsComponent implements OnInit {

  constructor(private imageService: ImageService, private lsbOptions: LsbOptionsService) { }

  ngOnInit() {
  }

}
