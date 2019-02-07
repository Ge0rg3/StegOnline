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

## What's going on with the PHP!?
This took me a while to wrap my head around, but bear with me.
In JavaScript, in order to read the RGBA values of an image, we must first put it on a canvas, and then read the values off a canvas.
However, when an image is **transparent**, the transparent RGBA values are always read as [0, 0, 0, 0] even though the RGB values could be anything.
Take [this challenge](https://xapax.github.io/blog/assets/pragyanctf/transmission.png) for example. Although there's actually a hidden image revealed when you set all Alpha values to 255, the Canvas API ignores the RGB values, meaning that the transparency would just appear black when the Alpha is set to 255.
While the probability of data being hidden in these alpha values is low, it's not worth ignoring. As such, we calculate the A values in PHP, and pass them into the JS code.
