# StegOnline
A web-based, accessible and open-source port of StegSolve.
Upload any image file, and the relevant options will be displayed.

## Features:
* Browse through the 32 bit planes of the image
* Extract data using LSB steganography techniques

## How can I contribute?
* The front-end design could use a lot of love
* Since there's **no** way to read Alpha values of images in pure Javascript without manually parsing the file, we have to use PHP. Any method of speeding this process up would be great
* When extracting data through LSB by columns instead of rows, the entire RGBA arrays must be rearranged. Although I temporary cache is stored, the process should be smoother
* The LSB Extraction popup window isn't friendly on really large/really small screens :(
