var planeNo = 0, isTransparent = false;

$(document).ready(function(){

    //Close popup box on click
    $('#close').click(function(e) {
        $("#lsbExtractPopup").fadeOut();
    });

});


function handleFileSelect(evt) {
  /*
  Live file reader management.
  Loaded image object is sent to the run() function.
  */
  var f = evt.target.files[0];

  if (!f.type.match('image.*')) {
    alert("Please enter valid image file.");
    return;
  }

  $("#controls").fadeIn();

  var reader = new FileReader();

  reader.readAsDataURL(f);

  reader.onloadend = function(){
    let imageObj = new Image();
    imageObj.onload = function() {
      run(imageObj, this.width, this.height, reader.result);
    }
    imageObj.src = reader.result;
  }

}
document.getElementById('files').addEventListener('change', handleFileSelect, false);


function restore() {
  /*
    Uses global r, g, b & a constants.
    Draws regular loaded image onto canvas, and resets RGBA planes
  */
  planeNo = 0;
  generateImage(r, g, b, a);
  $("#planesTestBtn").show();
  $("#rgbaPlanes").hide();
}


async function run(imageObj, width, height, src) {
  /*
    Main control function
    Input: Image object, image width, image height, image source
    If image has transparency, send to new page
    If not, display image control features.
  */
  //Initialise canvas
  $("#image").html("");
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  canvas.width = width;
  canvas.height = height;

  //Get image data
  ctx.drawImage(imageObj, 0, 0);
  rgbaData = ctx.getImageData(0, 0, width, height).data;
  a = rgbaData.filter((val, index) => (index-3) % 4 == 0); //Get just alpha values

  //If image has transparency, we must use pngtoy to correctly load RGB values
  if (a.filter(_ => _ < 255).length > 0) {
    $(".alpha").show();
    let pngtoyObj = new PngImage();
    pngtoyObj.onload = function() {
      runTransparent(pngtoyObj, src);
    }
    pngtoyObj.src = src;
    return;
  }

  r = rgbaData.filter((val, index) => index % 4 == 0);
  g = rgbaData.filter((val, index) => (index-1) % 4 == 0);
  b = rgbaData.filter((val, index) => (index-2) % 4 == 0);

  restore();
  isTransparent = false;
  $("#image").append(canvas);
  $(".alpha").hide();

}

async function runTransparent(pngtoyObj) {
  /*
    A child function of run(), for images with transparency.
    Since it's impossible to read the correct RGB values of transparent images in JS, we use pngtoy to find them
    Input:
      -A loaded PngImage from pngtoy
  */
  pngtoyObj = pngtoyObj.pngtoy;
  pngData = await pngtoyObj.decode();
  rgbaData = pngData.bitmap;
  r = rgbaData.filter((val, index) => index % 4 == 0);
  g = rgbaData.filter((val, index) => (index-1) % 4 == 0);
  b = rgbaData.filter((val, index) => (index-2) % 4 == 0);
  a = rgbaData.filter((val, index) => (index-3) % 4 == 0);
  isTransparent = true;
  restore();
  $("#image").append(canvas);
}

function initPlanes() {
  /*
    Shows the planes viewer, and displays the initial plane.
  */
  $("#planesTestBtn").hide();
  $("#rgbaPlanes").show();

  let transformKeys = Object.keys(transforms);
  $("#currentPlane").html(transformKeys[planeNo]);
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
  $("#currentPlane").html(transformKeys[planeNo]);
  displayPlane(...transforms[transformKeys[planeNo]]);
}

function parseTable() {
  /*
    TODO: Rework into JQuery
    Parses the table on the page, to produce an array ready to be parsed into extractlsb() function
    For more info on the lsb function, see rgbaFunctions.js
  */
  var table = document.getElementById("lsbtable");
  let order = ['R','G','B','A'];
  let lsbParams = [[],[], 0, 0];
  let oldOrder = [];
  $("#lsbError").html("");
  $("#loadingColumn").html("");

  //Bit planes
  for (let i=0; i < order.length; i++) {
    let selectedBits = [];
    for (let j=1; j < table.rows.length; j++) {
      var checked = table.rows.item(j).cells[i].childNodes[1].checked;
      if (checked) selectedBits.push(8-j);
    }
    if (selectedBits.length > 0) {
      oldOrder.push(order[i]);
      lsbParams[1].push(selectedBits);
    }
  }
  //Extra options
  lsbParams[2] = $("#extractRow").is(":checked") ? 'row' : 'column';
  lsbParams[3] = $("#orderMSB").is(":checked") ? 'msb' : 'lsb';
    //Custom order
  planeOrder = [$("#rgbaOne").val(),$("#rgbaTwo").val(),$("#rgbaThree").val(),$("#rgbaFour").val()];
    //Error if duplicate, or if no entries
  let sorted = planeOrder.sort();
  if (sorted[0] != "A" || sorted[1] != "B" || sorted[2] != "G" || sorted[3] != "R") {
    $("#lsbError").html("Error: Duplicate colours in Bit Plane Order.&nbsp;&nbsp;");
    return;
  }
  if (oldOrder.length == 0) {
    $("#lsbError").html("Error: No bit planes selected!&nbsp;&nbsp;&nbsp;");
    return;
  }
  let newOrder = [];
  for (colour of planeOrder) {
    if (oldOrder.indexOf(colour) != -1) newOrder.push(colour);
  }
    //Replace letters with actual RGBA arrays
  for (colour of newOrder) {
    if (colour == "R") lsbParams[0].push(r);
    if (colour == "G") lsbParams[0].push(g);
    if (colour == "B") lsbParams[0].push(b);
    if (colour == "A") lsbParams[0].push(a);
  }
  return lsbParams;
}


async function findlsb() {
  /*
    Bridge between extracting table data, runnig lsb function and outputting hex into text box
  */
  $("#loadingColumn").html("<b>Loading...</b>");
  await sleep(0);
  let tableParams = parseTable();
  let hex = await extractlsb(tableParams[0], tableParams[1], tableParams[2], tableParams[3], tableParams[4]);
  let ascii = hexToAscii(hex);
  //Split ascii into chunks
  ascii = ascii.match(/.{1,8}/g).join(' ');
  $("#asciioutput").val(ascii);
  $("#hexoutput").val(hex);
  $("#loadingColumn").html("<b>Success!</b>");
}


function showExtractPopup() {
  $("#lsbExtractPopup").fadeIn();
  $("#loadingColumn").html("");
}
