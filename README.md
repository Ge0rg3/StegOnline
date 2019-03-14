# StegOnline
A web-based, accessible and open-source port of StegSolve.
Upload any image file, and the relevant options will be displayed.

## Features:
* Browse through the 32 bit planes of the image
* Extract data using LSB steganography techniques
* Embed data in any bit pattern
* Hide one image inside of another's bit planes

## How can I contribute?
* An [Autostereogram](https://en.wikipedia.org/wiki/Autostereogram) solver would be a good addition ([interesting solution](https://www.cs.bgu.ac.il/~ben-shahar/Teaching/Computational-Vision/StudentProjects/ICBV131/ICBV-2013-1-KatyaGroisman/FinalProjectReport.pdf)).
* There is **no** way to read correct RGBA values of transparent/semi-transparent pixels with the Canvas API, so we use pngtoy. It would be great to have a lightweight version of pngtoy just for obtaining RGBA values.
* When extracting data through LSB by columns instead of rows, the entire RGBA arrays must be rearranged. Although I temporary cache is stored, the process should be smoother.
* We need a "Gray bits" feature, as seen on StegSolve.
* We could detect trailing bits (similarly to StegoVeritas), and display them.

## General Code Structure
* index.php: All HTML code of the website
* assets/custom: Custom scripts/stylesheets
* assets/external: External scripts/stylesheets (bootstrap, jquery, pngtoy)
* main.js: Acts as a bridge between the UI and the core Stegonography functions
* rgbaFunctions.js: The core functions of the program. This should contain no references to the webpage itself.
* style.css: Our custom styleshet

## Future Plans
After all basic features are developed, I'm going to start refactoring the entire codebase.
What started out as a small project has grown into quite a beefy application, which the original code design definitely wasn't designed for.
We will be porting this project to **Angular**, as it's SPA compatibility is pretty good.

## Working with transparency in JavaScript
Read [this](https://stackoverflow.com/questions/39744072/how-to-get-rgb-from-transparent-pixel-in-js) and [this](https://stackoverflow.com/questions/28917518/reading-pixeldata-from-images-in-javascript-returns-unexpected-results-for-semi) first!  
Essentially, it's impossible to read correct RGBA values of transparent pixels through the Image class in JavaScript.
To work around this, I used the pngtoy library, which manually parses the file bitmap to find accurate RGBA values.
Take [this challenge](https://xapax.github.io/blog/assets/pragyanctf/transmission.png) for example. Although there's actually a hidden image revealed when you set all Alpha values to 255, regular JavaScript image parsing would just show all transparent pixels as black.
pngtoy was a hard library to find, as it has in fact been deleted by it's original creator (Epistmex). As such, I'm using a copy hosted [here](https://github.com/neshume/pngtoy).
