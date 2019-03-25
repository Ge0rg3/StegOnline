import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bitplane-browser',
  templateUrl: './bitplane-browser.component.html',
  styleUrls: ['./bitplane-browser.component.scss']
})
export class BitPlaneBrowserComponent implements OnInit {

  colours: string[] = ["Red", "Green", "Blue", "Alpha"];
  currentBitPlane: string = "Red 0";

  constructor() { }

  ngOnInit() {
    this.viewBitPlane(0, 0);
  }

  viewBitPlane(colour: number, plane: number) {
    /*
      Returns imagedata for a desired bit plane
        Input:
          colour: 0, 1, 2 or 3 for Red, Green, Blue or Alpha respectively
          plane: 0, 1, 2, 3, 4, 5, 6 or 7. This is the desired plane to see
    */

  }

}
