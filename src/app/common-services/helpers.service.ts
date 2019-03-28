import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

	intToBin(n: number): string {
		/*
			Input a number, and it's respective binary string will be returned.
			The string will be at least 8 characters.
		*/
		let bin = (n >>> 0).toString(2)+"";
		if (bin.length < 8) return ("0".repeat(8-bin.length))+bin;
		return bin;
	}

  hexToAscii(hex: string): string {
    /*
      This is used to create the ASCII display.
      Input: Hex string
      Output: Ascii text in blocks of 8
    */
    let ascii: string = "";
    for (let i=0; i < hex.length; i+=2) {
      let charCode: number = parseInt(hex.substr(i, 2), 16);
      if (charCode > 126 || charCode < 32) ascii += ".";
      else ascii += String.fromCharCode(charCode);
    }
    var spaceSeperated = ascii.match(/.{1,8}/g).join('  ');
    return spaceSeperated;
  }

  sleep(ms: number) {
    /*
      Simply sleeps for n miliseconds.
      Used to display loading status to page during intensive async functions.
    */
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
