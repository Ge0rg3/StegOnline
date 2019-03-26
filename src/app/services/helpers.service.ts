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

  sleep(ms: number) {
    /*
      Simply sleeps for n miliseconds.
      Used to display loading status to page during intensive async functions.
    */
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
