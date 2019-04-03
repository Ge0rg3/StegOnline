import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../common-services/image.service';

@Component({
  selector: 'pngchunks-panel',
  templateUrl: './pngchunks-panel.component.html'
})
export class PngChunksPanelComponent implements OnInit {

	chunkKeys: string[] = Object.keys(this.imageService.chunks[0]);

  constructor(private imageService: ImageService) { }

  ngOnInit() {
  }

}