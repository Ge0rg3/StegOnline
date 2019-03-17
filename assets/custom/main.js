var planeNo = 0;
var paletteNo = 0;
var inputBytes = false;
var isPng = false;
var isTransparent = false;

function handleFileSelect(evt) {
  /*
  Live file reader management.
  Loaded image object is sent to the run() function.
  */

  //Reset current settings
  inputBytes = isPng = false;
  $("#image").html("");

  var f = evt.target.files[0];
  $("#filename").val(f.name);
  if (!f.type.match('image.*')) {
    alert("Please enter valid image file.");
    return;
  }
  if (f.type == "image/png") {
    isPng = true;
  }

  //Show controls
  $(".notdata").removeClass("d-none");

  //Read file
  var reader = new FileReader(); //For RGB data and main program
  var stringReader = new FileReader(); //For "View Strings" function

  reader.readAsDataURL(f);
  stringReader.readAsBinaryString(f);

  reader.onloadend = function() {
    let imageObj = new Image();
    imageObj.onload = function() {
      run(imageObj, this.width, this.height, reader.result);
    }
    imageObj.src = reader.result;
  }

  stringReader.onloadend = function() {
    imageStringData = stringReader.result; //GLobal var set
  }

}
document.getElementById('files').addEventListener('change', handleFileSelect, false);


function hideDataFileReader(evt) {
  /*
    Live file reader management for the file input when hiding data inside of images.
    Sets the image data to global var: inputBytes
  */
  var file = evt.target.files[0];
  $("#hidefilename").val(file.name);

  //Read file
  var bytereader = new FileReader();

  bytereader.onloadend = function(){
    inputBytes = new Uint8Array(this.result);
    inputBytes = Array.from(inputBytes).map(c => String.fromCharCode(c));
  }
  bytereader.readAsArrayBuffer(this.files[0]);

}
document.getElementById('hidefile').addEventListener('change', hideDataFileReader, false);


function hideImageFileReader(evt) {
  /*
    Live file reader management for the file input when hiding images inside of images.
    Sets global vars: hideR, hideG, hideB, hideA
  */
  var f = evt.target.files[0];
  $("#hideimagefilename").val(f.name);

  if (!f.type.match('image.*')) {
    alert("Please enter valid image file.");
    return;
  }

  //Read file
  var reader = new FileReader();
  reader.readAsDataURL(f);

  reader.onloadend = function(){
    let imageObj = new Image();
    imageObj.onload = function() {
      var tempcanvas = document.createElement("canvas");
      var tempctx = tempcanvas.getContext("2d");
      tempctx.imageSmoothingEnabled = false;
      tempcanvas.width = this.width;
      tempcanvas.height = this.height;
      tempctx.drawImage(imageObj, 0, 0);
      temprgbaData = tempctx.getImageData(0, 0, this.width, this.height).data;
      hideR = temprgbaData.filter((val, index) => index % 4 == 0);
      hideG = temprgbaData.filter((val, index) => (index-1) % 4 == 0);
      hideB = temprgbaData.filter((val, index) => (index-2) % 4 == 0);
      hideA = new Array(r.length).fill(255);
      hideWidth = this.width;
      hideHeight = this.height;
      $(".hideBitPlaneOptions").removeClass("d-none");
    }
    imageObj.src = reader.result;
  }

}
document.getElementById('hideimagefile').addEventListener('change', hideImageFileReader, false);


async function run(imageObj, width, height, src) {
  /*
    Main control function
    Input: Image object, image width, image height
    If image has transparency, run seperate function
    If not, display image control features.
  */
  //Initialise canvas
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  canvas.width = width;
  canvas.height = height;
  isTransparent = false;
  pngPalette = false;
  $("#customColourPalette").addClass("d-none");

  //Get image data
  ctx.drawImage(imageObj, 0, 0);
  rgbaData = ctx.getImageData(0, 0, width, height).data;
  a = rgbaData.filter((val, index) => (index-3) % 4 == 0); //Get just alpha values
  if (a.filter(_ => _ < 255).length > 0) {
    isTransparent = true;
  }

  //If image has transparency, we must use pngtoy to correctly load RGB values
  //PngToy also allows us to easily view other png blocks
 if (isPng) {
   let pngtoyObj = new PngImage();
   pngtoyObj.onload = async function() {
     pngtoyObj = pngtoyObj.pngtoy;
     pngData = await pngtoyObj.decode();
     rgbaData = pngData.bitmap;
     //See https://www.w3.org/TR/PNG-Chunks.html for type specs
     pngType = pngtoyObj.get_IHDR().type; //0: Grayscale, 2: RGB triple, 3: Palette index, 4: Grayscale + alpha, 6: RGBA
     pngPalette = false;
     if (pngType == 3) {
       pngPalette = pngtoyObj.get_PLTE().palette
       pngPaletteColours = [];
       //If given a palette, then rgbaData just contains an array of index in the palette
       for (let i=0; i < pngPalette.length; i += 3) {
         pngPaletteColours.push([pngPalette[i], pngPalette[i+1], pngPalette[i+2]]);
       }
       r = rgbaData.map(index => pngPaletteColours[index][0]);
       g = rgbaData.map(index => pngPaletteColours[index][1]);
       b = rgbaData.map(index => pngPaletteColours[index][2]);
       a = new Array(r.length).fill(255);
       $("#customColourPalette").removeClass("d-none");
     }
     else if (pngType == 2) {
       //Regular RGB
       r = rgbaData.filter((val, index) => index % 3 == 0);
       g = rgbaData.filter((val, index) => (index-1) % 3 == 0);
       b = rgbaData.filter((val, index) => (index-2) % 3 == 0);
       a = new Array(r.length).fill(255);
     }
     else if (pngType == 6) {
       //RGBA values
       r = rgbaData.filter((val, index) => index % 4 == 0);
       g = rgbaData.filter((val, index) => (index-1) % 4 == 0);
       b = rgbaData.filter((val, index) => (index-2) % 4 == 0);
       a = rgbaData.filter((val, index) => (index-3) % 4 == 0);
     }
     else {
       alert("Png type "+pngType+" is not supported yet :(");
     }
     $("#image").append(canvas);
     restore();
   }
   pngtoyObj.src = src;
   return;
 }

  //Get RGB values
  r = rgbaData.filter((val, index) => index % 4 == 0);
  g = rgbaData.filter((val, index) => (index-1) % 4 == 0);
  b = rgbaData.filter((val, index) => (index-2) % 4 == 0);
  a = new Array(r.length).fill(255);
  restore();
  isTransparent = false;
  $("#image").append(canvas);

}



function restore() {
  /*
    Uses global r, g, b & a constants.
    Draws regular loaded image onto canvas, and resets RGBA planes
  */
  planeNo = 0;
  hideStrings();
  hideRgba();
  $(".bitbutton").addClass("d-none");
  $("#browseplanetext").text("");
  $("#planesbtn").removeClass("d-none");
  $("#browseplanefield").addClass("d-none");
  $("#extractResults").addClass("d-none");
  $("#browsePaletteDisplay").addClass("d-none");
  generateImage(r, g, b, a);
}


function initPlanes() {
  /*
    Shows the planes viewer, and displays the initial plane.
  */
  restore();

  $("#planesbtn").addClass("d-none");
  $(".bitbutton").removeClass("d-none");
  $("#browseplanefield").removeClass("d-none");

  let transformKeys = Object.keys(transforms);
  $("#browseplanetext").html(transformKeys[planeNo]);
  displayPlane(...transforms[transformKeys[planeNo]]);
}


function browsePlanes(action, direction) {
  /*
    Used to traverse the RGBA plane viewer.
    Input:
      - action ('next' or 'skip'): Go to next plane, or skip to next colour
      - direction ('forward' or 'backward'): Traverse forwards or backwards
  */
  if (action == 'next') {
    planeNo += (direction == 'forward' ? 1 : -1);
    if (planeNo > 31) planeNo = 0;
    else if (planeNo > 23 && !isTransparent) planeNo = 0;
    else if (planeNo < 0 && isTransparent) planeNo = 31;
    else if (planeNo < 0 && !isTransparent) planeNo = 23;
  }
  else if (action == 'skip') {
    if (direction == 'forward') {
      if (planeNo >= 24) planeNo = 0;
      else if (planeNo >= 16 && isTransparent) planeNo = 24;
      else if (planeNo >= 16 && !isTransparent) planeNo = 0;
      else if (planeNo >= 8) planeNo = 16;
      else if (planeNo >= 0) planeNo = 8;
    }
    else if (direction == 'backward') {
      if (planeNo >= 24) planeNo = 16;
      else if (planeNo >= 16) planeNo = 8;
      else if (planeNo >= 8) planeNo = 0;
      else if (planeNo >= 0 && isTransparent) planeNo = 24;
      else if (planeNo >= 0 && !isTransparent) planeNo = 16;
    }
  }

  let transformKeys = Object.keys(transforms);
  $("#browseplanetext").html(transformKeys[planeNo]);
  displayPlane(...transforms[transformKeys[planeNo]]);
}

function back() {
  /*
    Hides the embedextract menu/hide image menu and shows the main page again.
  */
  $("#dataEmbedExtract").addClass("d-none");
  $(".extractOnly").addClass("d-none");
  $(".embedOnly").addClass("d-none");
  $("#hideImage").addClass("d-none");
  $("#extractbtn").prop("disabled", false);
  $("#embedbtn").prop("disabled", false);
  $(".notdata").removeClass("d-none");
  $("#image").removeClass("d-none");
  $("#back").addClass("d-none");
  $("#hideImageUpload").addClass("d-none");
  $("#extractResults").addClass("d-none");
  if (pngPalette) {
    $("#customColourPalette").removeClass("d-none");
  }
}

function openEmbedExtract(type) {
  /*
    Prepares the data extraction menu.
    Input: either 'embed' or 'extract'
  */
  //Standard table stuff
  $(".notdata").addClass("d-none");
  $("#image").addClass("d-none");
  $("#dataEmbedExtract").removeClass("d-none");
  $(".extractOnly").addClass("d-none");
  $(".embedOnly").addClass("d-none");
  $("#back").removeClass("d-none");
  $("#customColourPalette").addClass("d-none");
  hideStrings();
  hideRgba();
  //Extract specific stuff
  if (type == 'extract') $(".extractOnly").removeClass("d-none");
  else if (type == 'embed') $(".embedOnly").removeClass("d-none"), $("#extractorembed").text("Embed Data");
  else throw "Invalid Type. Only 'extract' or 'embed' accepted.";
}

function openHideImage() {
  /*
    Opens the Image Hiding menu
  */
  $(".notdata").addClass("d-none");
  $("#image").addClass("d-none");
  $("#hideImage").removeClass("d-none");
  $("#back").removeClass("d-none");
}

function parseTable() {
  /*
    Parses the EmbedExtract table for use in their respective lsb functions.
  */
  var table = $("#lsbtable")[0];
  var lsbParams = {};
  var columns = ['','R','G','B','A'];

  //1) Find bit planes from table
  var totalBits = {};
  for (let i=1; i < 5; i++) { //For each column
    let selectedBits = [];
    for (let j=1; j < table.rows.length; j++) { //For each row
      var checked = table.rows.item(j).cells[i].childNodes[0].childNodes[0].checked;
      if (checked) selectedBits.push(8-j); //Push checked bits into array
    }
    //If bits selected, push to array
    if (selectedBits.length > 0) {
      totalBits[columns[i]] = selectedBits;
    }
  }
  if (Object.keys(totalBits).length == 0) {
    $("#lsbStatus").removeClass("d-none");
    $("#statusText").html("No bits selected in table.");
    $("#embedbtn").prop("disabled", false);
    $("#extractbtn").prop("disabled", false);
    return;
  }

  //2) Pixel order
  lsbParams['pixelOrder'] = $("#pixelOrderRow").val();
  //3) Bit order
  lsbParams['bitOrder'] = $("#bitOrderMSB").val();
  //4) Pad remaining bits
  lsbParams['padBits'] = ($("#padBits").val() == "Yes");
  //5) Trim trailibg bits
  lsbParams['trimBits'] = ($("#trimBits").val() == "Yes");
  //Get bit plane order
  var planeOrder = [$("#rgbaOne").val(),$("#rgbaTwo").val(),$("#rgbaThree").val(),$("#rgbaFour").val()];
  let sorted = planeOrder.slice(0).sort();
    //Check for errors
  if (sorted[0] != "A" || sorted[1] != "B" || sorted[2] != "G" || sorted[3] != "R") {
    $("#lsbStatus").removeClass("d-none");
    $("#statusText").html("Duplicate colours in Bit Plane Order.");
    $("#embedbtn").prop("disabled", false);
    $("#extractbtn").prop("disabled", false);
    return;
  }
  lsbParams['selectedBits'] = [];
  lsbParams['selectedColours'] = [];
  for (colour of planeOrder) {
    if (totalBits[colour] == undefined) continue;
    if (colour == 'R' && totalBits) lsbParams['selectedColours'].push(r);
    if (colour == 'G' && totalBits) lsbParams['selectedColours'].push(g);
    if (colour == 'B' && totalBits) lsbParams['selectedColours'].push(b);
    if (colour == 'A' && totalBits) lsbParams['selectedColours'].push(a);
    lsbParams['selectedBits'].push(totalBits[colour]);
  }

  //6) Text input
  lsbParams['textInput'] = $("#textinput").val();
  //7) File input - from global var declared within hideFileRead()
  if (inputBytes) lsbParams['byteInput'] = inputBytes;
  else lsbParams['byteInput'] = false;

  $("#statusText").html("");
  $("#lsbStatus").addClass("d-none");
  return lsbParams;
}


async function startExtract() {
  /*
    Controller for the extraction process.
  */
  $("#extractbtn").prop("disabled", true);
  $("#extractResults").addClass("d-none");
  var tableData = parseTable();
  var hexResult = await extractlsb(tableData['selectedColours'], tableData['selectedBits'], tableData['pixelOrder'], tableData['bitOrder'], tableData['trimBits']);
  if (hexResult == "") {
    $("#lsbStatus").removeClass("d-none");
    $("#statusText").html("No data returned! Disable \"<i>Trim Trailing Bits</i>\" to view empty data.");
    $("#extractbtn").prop("disabled", false);
    return;
  }
  var asciiResult = hexToAscii(hexResult).match(/.{1,8}/g).join(' ');
  $("#extractResults").removeClass("d-none");
  $("#hexoutput").val(hexResult);
  $("#asciioutput").val(asciiResult);
  $("#extractbtn").prop("disabled", false);
}


async function startEmbed() {
  /*
  Controller for the embed process.
  */
  $("#embedbtn").prop("disabled", true);
  var tableData = parseTable();
  //Remove alpha
  if (tableData['selectedColours'].indexOf(a) != -1) {
    tableData['selectedBits'][tableData['selectedColours'].indexOf(a)] = [];
  }
  var toHide = textToBin(tableData['textInput']);
  if (tableData['byteInput']) toHide = textToBin(tableData['byteInput']);
  //Check if enough space
  let selectedLength = [].concat.apply([], tableData['selectedBits']).length;
  let minimumRequired = Math.ceil(toHide.length / r.length);
  if (selectedLength < minimumRequired) {
    $("#lsbStatus").removeClass("d-none");
    if (minimumRequired < 21) $("#statusText").html("Not enough space to fit data. Please select at least "+minimumRequired+" bits in table.<br/>Cropping at "+selectedLength*r.length+" bits.");
    else $("#statusText").html("Data too large!<br/>Cropping at "+selectedLength*r.length+" bits.");
    $("#image").removeClass("d-none");
    $("#embedbtn").prop("disabled", false);
    return;
  }
  await hidelsb(toHide, tableData['selectedColours'], tableData['selectedBits'], tableData['pixelOrder'], tableData['bitOrder'], tableData['padBits']);
  $("#embedbtn").prop("disabled", false);
  $("#image").removeClass("d-none");
  $("#downloadImageBtn").removeClass("d-none");
}


function embedImageInImage() {
  /*
    Parses options in "Embed Image in Bit Plane" page, and calls the hideImageInBitPlane function with the relevant parameters.
  */
  var plane = $("#hideBitPlanePlane").val();
  var bit = parseInt($("#hideBitPlaneBit").val());
  hideImageInBitPlane(plane, bit);
  $("#image").removeClass("d-none");
}

function viewStringController() {
  /*
    Interface between rgbaFunction.js' viewStrings function and the UI.
  */
  $("#hideStringsBtn").removeClass("d-none");
  $("#viewStringsBtn").addClass("d-none");

  var strings = viewStrings(imageStringData, 5);
  var columnCount = Math.ceil(strings.length / 3);
  var stringsChunks = [strings.slice(0, columnCount), strings.slice(columnCount, columnCount*2), strings.slice(columnCount*2, strings.length)];

  $("#stringsDataOne").html(stringsChunks[0].join("<br/>"));
  $("#stringsDataTwo").html(stringsChunks[1].join("<br/>"));
  $("#stringsDataThree").html(stringsChunks[2].join("<br/>"));
  $("#stringsBox").removeClass("d-none");
}

function hideStrings() {
  /*
    Used to hide the Strings box. Called whenever the hideStringsBtn is pressed, or a reset is issued.
  */
  $("#stringsBox").addClass("d-none");
  $("#hideStringsBtn").addClass("d-none");
  $("#viewStringsBtn").removeClass("d-none");
}

function initBrowseColourPalette() {
  /*
    This opens the "Browse colour palette" submenu.
  */
  restore();
  $("#browsePaletteDisplay").removeClass("d-none");
  $("#browsepalettetext").text(paletteNo+"/"+pngPaletteColours.length);
  browseColourPalette(paletteNo);
}

function browseColourPaletteController(progression) {
  /*
    This is the interface between the UI and the browseColourPalette function.
    Input:
      -progression: The change in colour palette
  */
  paletteNo += progression;
  if (paletteNo > 256) paletteNo -= 257;
  if (paletteNo < 0) paletteNo += 257;
  $("#browsepalettetext").text(paletteNo+"/"+pngPaletteColours.length);
  browseColourPalette(paletteNo);
}

function viewRgbaController() {
  /*
    Acts as interface between rgbaController() and UI.
  */
  $("#viewRgbaBtn").addClass("d-none");
  $("#hideRgbaBtn").removeClass("d-none");

  var err = "";
  if (rgbaData.length > 25000) err += "<p>Showing first 25000 values...</p>";
  var toShow = Array.from(rgbaData).slice(0, 25000).map(n => n.toString().padStart(3, '0')).join(' ');
  if (pngPalette) {
    err += "<p>Joining RGBA values from Palette Indexes...</p>";
    toShow = pngPaletteColours.slice(0, 25000).flat().map(n => n.toString().padStart(3, '0')).join(' ');
  }

  $("#displayRgbaValues").val(toShow);
  $("#rgbaValError").html(err);
  $("#rgbaBox").removeClass("d-none");
}

function hideRgba() {
  /*
    Hides the RGBA value box, and replaces the "Hide" button with the "View" button
  */
  $("#hideRgbaBtn").addClass("d-none");
  $("#rgbaBox").addClass("d-none");
  $("#viewRgbaBtn").removeClass("d-none");
}

function downloadImage() {
  /*
    We use the download.js library to force download the image.
    If the image is too large and the use tries to use "Save as" in the context menu, chrome will fail the download.
    This way, the downloads are stable.
  */
  canvas.toBlob(function (blob) {
    var downloadName = $("#filename").val().split(".").slice(0, -1).concat(['.png']).join('');
    download(blob, downloadName, 'image/png');
  }, 'image/png');
}

function downloadExtracted() {
  /*
    Used to download the extracted data from an image.
  */
  var hexData = $("#hexoutput").val();
  var byteArray = new Uint8Array(hexData.match(/.{2}/g).map(e => parseInt(e, 16)));
  var blob = new Blob([byteArray], {type: "application/octet-stream"});

  var downloadName = $("#filename").val().split(".").slice(0, -1).concat(['.bin']).join('');
  download(blob, downloadName, "application/octet-stream");

}
