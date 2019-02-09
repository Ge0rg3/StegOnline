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
    let tempA = a.map(_=>_);
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

function textToBin(text) {
  /*
    Input: text, a string
    Output: Binary string
  */
  let binString = "";
  for (let i = 0; i < text.length; i++) {
    let binPart = text[i].charCodeAt().toString(2);
    binString += "0".repeat(8-binPart.length) + binPart;
  }
  return binString;
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


async function extractlsb(colours, bits, extractBy='row', bitOrder='msb') {
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
    let lsbHex = await extractlsb([r], [[5,4,3,2,1,0]]);
      let lsbHex = await extractlsb([r, g], [[0], [0]]);
      let lsbHex = await extractlsb([g,b,r], [[1,2],[1,2]])
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
      //Get only selected binary parts
      let binSub = binaryCol.split('').filter((val, index) => bits[j].indexOf(7-index) != -1);
      if (bitOrder == 'lsb') binSub = binSub.reverse();

      for (char of binSub) {
        bin += char;
        if (bitCount % 8 == 0) { //If one byte, turn to hex & add to hex string
          let tempHex = parseInt(bin, 2).toString(16);
          if (tempHex.length == 1) hex += ("0"+tempHex); //Pad out hex
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



async function hidelsb(colours, bits, hideBy='row', bitOrder='msb') {
  /*
    This function hides data inside of the current image, and draws it to the screen.
    Inputs:
      -colours: An array of colours in the wanted order, e.g. [g,r,b]
      -bits: An array of bit arrays in the same order as the colours, e.g. [[2,1,0], [1,0]]
      -hideBy (optional): The direction to write the bits, either 'row' or 'column'
      -bitOrder (optional): The bit order to write the data in, either 'msb' or 'lsb' (most significant or least significant bits)
    Output:
      The edited image is drawn onto the canvas
    Example uses:
      hidelsb([r],[[0]]) //Hides data in the LSB of the R channel
      hidelsb([b,r],[[0],[0]]) //Hides data in the LSB of the B and R channels, in the order: BR
      hidelsb([r,b,g],[[5,4],[3,2,1],[7]]) //Hides data in various bits in the RBG channels
      hidelsb([r],[[0]], 'column') //Hides data in the LSB of the R channel by columns instead of rows
      hidelsb([r],[[3,2,1,0]], 'row', 'lsb') //Hides data in the LSBs of various bits in the R channel, where the data is embedded from LSB -> MSB
  */
  let colourCopies = [];
  let inputtedColours = [];

  //Get copies of inputted colours
  for (let colour of colours) {
    if (colour == r) inputtedColours.push('r'), colourCopies.push(r.slice(0));
    if (colour == g) inputtedColours.push('g'), colourCopies.push(g.slice(0));
    if (colour == b) inputtedColours.push('b'), colourCopies.push(b.slice(0));
    if (colour == a) inputtedColours.push('a'), colourCopies.push(a.slice(0));
  }

  //Rotate for columns
  if (hideBy == 'column') {
    for (let i=0; i < colourCopies.length; i++) {
      let colour = colourCopies[i];
      //Use cached version if available
      let cont = false;
      if (inputtedColours[i] == 'r' && rC != null) colourCopies[i] = rC.slice(0), cont = true;
      if (inputtedColours[i] == 'g' && gC != null) colourCopies[i] = gC.slice(0), cont = true;
      if (inputtedColours[i] == 'b' && bC != null) colourCopies[i] = bC.slice(0), cont = true;
      if (inputtedColours[i] == 'a' && aC != null) colourCopies[i] = aC.slice(0), cont = true;
      if (cont) continue;
      //If not, rotate
      let tempArr = [];
      for (let j=0; j < canvas.width; j++) {
        if (j%100==0) $("#loadingColumn").text(`${i+1}/${colours.length} : ${j}/${canvas.width}`), await sleep(0);
        let filtered = Array.from(colour.filter((val, index) => index % canvas.width == j));
        tempArr = tempArr.concat(filtered);
      }
      //Assign to cache
      if (inputtedColours[i] == 'r') rC = tempArr.slice(0);
      if (inputtedColours[i] == 'g') gC = tempArr.slice(0);
      if (inputtedColours[i] == 'b') bC = tempArr.slice(0);
      if (inputtedColours[i] == 'a') aC = tempArr.slice(0);
      //Assign to colourcopies!
      colourCopies[i] = new Uint8ClampedArray(tempArr);
    }
    $("#loadingColumn").text("Complete!");
  }
  //If column selected, then the values have now been rotated

  //Start actual hiding
  var bin = "";
  var hex = "";
  var toHide = textToBin("Lorem ipsum dolor sit amet deserunt irure aute non aliquip commodo nisi, cillum. Cupidatat pariatur ipsum cupidatat non sunt minim nulla. Sint enim reprehenderit incididunt magna ex sit ipsum ex dolor ex consequat ullamco, nulla qui occaecat velit veniam duis anim eu magna labore. Officia excepteur id minim voluptate laboris eiusmod. Nulla duis, ex amet exercitation excepteur dolor dolore duis nostrud tempor. Tempor id ex aliqua sint ea magna dolore Lorem tempor dolore irure cupidatat dolore exercitation sunt officia fugiat, eu ipsum adipisicing.Elit amet sit quis cupidatat consectetur proident ullamco in officia nisi. Consequat culpa cupidatat, exercitation Lorem pariatur sunt laboris ex minim veniam Lorem. Fugiat duis reprehenderit incididunt reprehenderit et in cupidatat sint adipisicing tempor nostrud consectetur et adipisicing voluptate quis amet eu Lorem velit aliquip amet cillum. Ullamco officia culpa aute voluptate pariatur deserunt aliqua anim voluptate adipisicing anim eu ex. Ullamco officia est et reprehenderit culpa eiusmod sint laboris sint quis excepteur laborum.Sint voluptate sint cupidatat consequat non eu velit, do reprehenderit duis ullamco anim occaecat est. Irure adipisicing esse culpa ut adipisicing aliquip ex. Sunt mollit reprehenderit magna veniam fugiat eu incididunt ipsum nisi, ut officia.Minim irure amet exercitation laboris culpa anim aute anim aliqua. Consequat eu pariatur elit voluptate eu nulla tempor labore ad labore nostrud occaecat est eu amet proident. Incididunt est nulla tempor consectetur velit aliqua minim labore excepteur irure et, sint laboris amet est. Reprehenderit sint eu minim ex exercitation, consectetur ipsum aliquip nulla nisi sit sunt quis. Tempor non in mollit elit non, do amet do et voluptate. Voluptate deserunt magna cillum deserunt sint consequat id voluptate pariatur duis qui ea nostrud, anim ut.Mollit dolore pariatur in sint consectetur minim occaecat esse sunt. Culpa exercitation proident consectetur labore nisi. Excepteur exercitation magna do consectetur ex exercitation ullamco veniam proident exercitation ipsum nostrud Lorem nisi reprehenderit do et quis. Esse aliqua do in dolore nisi ullamco dolor exercitation dolore commodo officia mollit amet enim. Occaecat mollit ipsum ex in aute id magna est. Adipisicing sint esse sunt, ipsum excepteur in. Veniam est culpa cupidatat consectetur pariatur dolore, occaecat in nostrud pariatur ipsum laborum et culpa minim sunt. Qui tempor commodo tempor, nisi dolor aliquip.");
  var binIndex = 0;

  for (let i=0; i < toHide.length; i++) { //For each pixel
    if (binIndex > toHide.length) break;
    for (let j=0; j < colourCopies.length; j++) { //For each colour
      //Calculate binary of current colour
      let binaryCol = intToBin(colourCopies[j][i]).split('');
      //Calculate custom binary to replace current binary
      let binSub = [];
      for (let k=0; k < bits[j].length; k++) {
        binSub.push(toHide[binIndex]);
        binIndex++;
      }
      if (bitOrder == 'lsb') binSub = binSub.reverse();
      // Insert custom binary into current binary
      bits[j].forEach(bit => {
        if (binIndex > toHide.length) return;
        binaryCol[7-bit] = binSub[0];
        binSub.shift();
      })
      //Replace current RGBA val with custom one
      colourCopies[j][i] = parseInt(binaryCol.join(''), 2);
    }
  }

  //If column selected, then the we now need to rotate back
  if (hideBy == 'column') {
    for (let i=0; i < colourCopies.length; i++) {
      let colour = colourCopies[i];
      //No cache this time :)
      let tempArr = [];
      for (let j=0; j < canvas.height; j++) {
        if (j%100==0) $("#loadingColumn").text(`${i+1}/${colourCopies.length} : ${j}/${canvas.height}`), await sleep(0);
        let filtered = Array.from(colour.filter((val, index) => index % canvas.height == j));
        tempArr = tempArr.concat(filtered);
      }
      colourCopies[i] = new Uint8ClampedArray(tempArr);
    }
  }

  //Find RGBAs to draw
  let toDraw = [r.slice(0), g.slice(0), b.slice(0), a.slice(0)];
  for (let i=0; i < inputtedColours.length; i++) {
    if (inputtedColours[i] == 'r') toDraw[0] = colourCopies[i];
    if (inputtedColours[i] == 'g') toDraw[1] = colourCopies[i];
    if (inputtedColours[i] == 'b') toDraw[2] = colourCopies[i];
    if (inputtedColours[i] == 'a') toDraw[3] = colourCopies[i];
  }

  generateImage(toDraw[0], toDraw[1], toDraw[2], toDraw[3]);
}
