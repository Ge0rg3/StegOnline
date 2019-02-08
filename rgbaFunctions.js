//Calculating columns within lsb() takes forever, so we only want to do it once
var rC, gC, bC, aC, extracting=false;

const transforms = {
  "Red plane 0" : ['r',0], //0
  "Red plane 1" : ['r',1], //1
  "Red plane 2" : ['r',2], //2
  "Red plane 3" : ['r',3], //3
  "Red plane 4" : ['r',4], //4
  "Red plane 5" : ['r',5], //5
  "Red plane 6" : ['r',6], //6
  "Red plane 7" : ['r',7], //7
  "Green plane 0" : ['g',0], //8
  "Green plane 1" : ['g',1], //9
  "Green plane 2" : ['g',2],//10
  "Green plane 3" : ['g',3],//11
  "Green plane 4" : ['g',4],//12
  "Green plane 5" : ['g',5],//13
  "Green plane 6" : ['g',6],//14
  "Green plane 7" : ['g',7],//15
  "Blue plane 0" : ['b',0], //16
  "Blue plane 1" : ['b',1], //17
  "Blue plane 2" : ['b',2],  //18
  "Blue plane 3" : ['b',3],  //19
  "Blue plane 4" : ['b',4],  //20
  "Blue plane 5" : ['b',5],  //21
  "Blue plane 6" : ['b',6],  //22
  "Blue plane 7" : ['b',7],  //23
  "Alpha plane 0" : ['a',0], //24
  "Alpha plane 1" : ['a',1], //25
  "Alpha plane 2" : ['a',2], //26
  "Alpha plane 3" : ['a',3], //27
  "Alpha plane 4" : ['a',4], //28
  "Alpha plane 5" : ['a',5], //29
  "Alpha plane 6" : ['a',6], //30
  "Alpha plane 7" : ['a',7] //31
}

//Sleep helper for async functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function generateImage(r, g, b, a) {
  /*
    Input: 4 arrays containing all Red, Green, Blue and Alpha values respectively.
    Displays created image object onto canvas
  */
  var combinedRGBA = [];
  for(let i=0; i < r.length; i++) {
    combinedRGBA.push(r[i], g[i], b[i], a[i]);
  }
  combinedRGBA = new Uint8ClampedArray(combinedRGBA);
  let newImageObject = new ImageData(combinedRGBA, canvas.width, canvas.height);
  ctx.putImageData(newImageObject, 0, 0);
}


function removeAlpha() {
  /*
    Uses global r, g, b & a constants.
    Sets all values in Alpha channel to 255, thus making them opaque.
    After changine alpha values, the image is redrawn.
  */
  a = new Array(a.length).fill(255);
  restore();
}


function xor(isTransparent) {
  /*
    Uses global r, g, b & a constants.
    Input: True/False, does the image have transparency.
    Draws Xor'd image onto canvas.
  */
  restore();
  let xorR = r.map(_ => _^255);
  let xorG = g.map(_ => _^255);
  let xorB = b.map(_ => _^255);
  let xorA = isTransparent ? a.map(_ => _^255) : new Array(a.length).fill(255);
  generateImage(xorR, xorG, xorB, xorA);
}


function full(colour) {
  /*
    Displays only one colour channel (with FULL alpha).
    Input: 'r', 'g' 'b' or 'a'.
    Draws onto canvas.
    We display alpha by assigning it's value to RGB
  */
  restore();
  let newR = colour == 'r' ? r : Array(r.length).fill(0);
  let newG = colour == 'g' ? g : Array(g.length).fill(0);
  let newB = colour == 'b' ? b : Array(b.length).fill(0);
  if (colour == 'a') {
    let tempA = a.map(_ => _^255);
    newR = newG = newB = tempA;
  };
  let newA = Array(r.length).fill(255);
  generateImage(newR, newG, newB, newA);
}



function displayPlane(colour, number) {
  /*
    Input: Colour ('r', 'g', 'b' or 'a') and a number (0-7)
    This will draw the relevant colour plane onto the canvas.
  */
  let newR = [], newG = [], newB = [];
  let newA = Array(r.length).fill(255);

  let colSelection = ['r','g','b','a'].indexOf(colour);
  let planeView = [r, g, b, a][colSelection];

  for(let i=0; i < r.length; i++) {
    //Store binary version of colour
    let bin = intToBin(planeView[i]).split('');
    //If the nth LSB in the binary string is 1, print black
    if (bin[bin.length-1-number] == "1") {
      newR.push(255);
      newG.push(255);
      newB.push(255);
    }
    else {
      newR.push(0);
      newG.push(0);
      newB.push(0);
    }
  }

  generateImage(newR, newG, newB, newA);
}


function rgbToHex(r, g, b) {
    /*
      Input: r, g and b values (a is defaulted to 255).
      Output: Hex string
      This was ripped off StackOverflow (https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb)
    */
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function intToBin(n) {
  /*
    Input: n, an integer
    Int -> Binary String
    Output: Binary string (Minimum 8 charcaters)
  */
  let bin = (n >>> 0).toString(2)+"";
  if (bin.length < 8) return ("0".repeat(8-bin.length))+bin;
  return bin;
}

function hexToAscii(hex) {
  /*
    Input: hex, a hex string
    Output: An ascii string, with any non printable characters displayed by a "."
  */
  hex = hex+"";
  let ascii = "";
  for (let i=0; i < hex.length; i+=2) {
    let charCode = parseInt(hex.substr(i, 2), 16);
    if (charCode > 126 || charCode < 32) ascii += ".";
    else ascii += String.fromCharCode(charCode);
  }
  return ascii;
}


async function lsb(colours, bits, extractBy='row', bitOrder='msb') {
  /*
    TODO: Speed up columnar version

    Returns the hex representation for the LSB of the image
    Input:
      -Array of colour arrays (e.g [r] / [r, g] / [b, g, a])
        -Please note the order of the colours equates to the order of the LSB
      -Array of sub-arrays containing the bits to extract
      - (Optional) Extraction direction, either 'row' or 'column'
    Output:
      -Hex LSB data
    Example uses:
    let lsbHex = await lsb([r], [[5,4,3,2,1,0]]);
      let lsbHex = await lsb([r, g], [[0], [0]]);
      let lsbHex = await lsb([g,b,r], [[1,2],[1,2]])
  */
  //Only do one extraction at a time!
  if (extracting) return;
  else extracting = true;
  //This part is very slow, and the algorithm can probably be improved
  //We have to turn the flat Uint8ClampedArray from one long joined list of rows to one long joined list of columns
  if (extractBy == 'column') {
    for (let i=0; i < colours.length; i++) {
      let colour = colours[i];
      //Use cached version if available
      let cont = false;
      if (colour == r && rC != null) colours[i] = rC, cont = true;
      if (colour == g && gC != null) colours[i] = gC, cont = true;
      if (colour == b && bC != null) colours[i] = bC, cont = true;
      if (colour == a && aC != null) colours[i] = aC, cont = true;
      if (cont) continue;
      //If not, go!
      let tempArr = [];
      for (let j=0; j < canvas.width; j++) {
        //Show loading every 100 runs
        if (j%100==0) $("#loadingColumn").text(`${i+1}/${colours.length} : ${j}/${canvas.width}`), await sleep(0);
        let filtered = Array.from(colour.filter((val, index) => index % canvas.width == j));
        tempArr = tempArr.concat(filtered);
      }
      $("#loadingColumn").text("Complete!");
      colours[i] = new Uint8ClampedArray(tempArr);
      //Create cached version
      if (colour == r) rC = tempArr;
      else if (colour == g) gC = tempArr;
      else if (colour == b) bC = tempArr;
      else if (colour == a) aC = tempArr;
    }
  }
  //Start extraction
  var bin = "";
  var hex = "";
  var bitCount = 1;
  for (let i=0; i < r.length; i++) { //For each pixel
    for (let j=0; j < colours.length; j++) { //For each inputted colour
      //Convert rgb value to binary
      let binaryCol = intToBin(colours[j][i]);
      //Get last n bits of binary
      let binSub = binaryCol.split('').filter((val, index) => bits[j].indexOf(7-index) != -1);
      if (bitOrder == 'lsb') binSub = binSub.reverse();

      for (char of binSub) {
        bin += char;
        if (bitCount % 8 == 0) { //If one byte, turn to hex & add to hex string
          let tempHex = parseInt(bin, 2).toString(16);
          if (tempHex.length == 1) hex += ("0"+tempHex);
          else hex += tempHex;
          bin = "";
        }
        bitCount++;
      }

    }
  }
  //Clean up remaining bits
  if (bin.length > 0) {
    hex += parseInt(bin, 2).toString(16);
  }
  extracting = false;
  return hex;
}
