# StegOnline
A web-based, accessible and open-source port of StegSolve.
Upload any image file, and the relevant options will be displayed.

## Features:
* Browse through the 32 bit planes of the image
* Extract data using LSB steganography techniques

## How can I contribute?
* The front-end design could use a lot of love
* An [Autostereogram](https://en.wikipedia.org/wiki/Autostereogram) solver would be a good addition ([interesting solution](https://www.cs.bgu.ac.il/~ben-shahar/Teaching/Computational-Vision/StudentProjects/ICBV131/ICBV-2013-1-KatyaGroisman/FinalProjectReport.pdf))
* Since there's **no** way to read Alpha values of images in pure Javascript without manually parsing the file, we have to use PHP. Any method of speeding this process up would be great
* When extracting data through LSB by columns instead of rows, the entire RGBA arrays must be rearranged. Although I temporary cache is stored, the process should be smoother
* The LSB Extraction popup window isn't friendly on really large/really small screens :(
* We need a "Gray bits" feature, as seen on StegSolve

## General Code Structure
* live.php: The 'homepage' of the website.
* assets/: External libraries + our custom stylesheet.
* main.js: Acts as a bridge between the UI and the core Stegonography functions
* rgbaFunctions.js: The core functions of the program. This should contain no references to the webpage itself.

## Working with transparency in JavaScript
Read [this](https://stackoverflow.com/questions/39744072/how-to-get-rgb-from-transparent-pixel-in-js) and [this](https://stackoverflow.com/questions/28917518/reading-pixeldata-from-images-in-javascript-returns-unexpected-results-for-semi) first!  
Essentially, it's impossible to read correct RGBA values of transparent pixels through the Image class in JavaScript.
To work around this, I used the pngtoy library, which manually parses the file bitmap to find accurate RGBA values.
Take [this challenge](https://xapax.github.io/blog/assets/pragyanctf/transmission.png) for example. Although there's actually a hidden image revealed when you set all Alpha values to 255, regular JavaScript image parsing would just show all transparent pixels as black.
pngtoy was a hard library to find, as it has in fact been deleted by it's original creator (Epistmex). As such, I'm using a copy hosted [here](https://github.com/neshume/pngtoy).
