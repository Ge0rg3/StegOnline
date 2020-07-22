# StegOnline
[![Known Vulnerabilities](https://snyk.io/test/github/Ge0rg3/StegOnline/badge.svg)](https://snyk.io/test/github/Ge0rg3/StegOnline)
![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-3.png, "WTFPL")

A web-based, enhanced and open-source port of StegSolve. Upload any image file, and the relevant options will be displayed.
View a live demo at [http://stegonline.georgeom.net/](http://stegonline.georgeom.net/).

## Features:
* Browse through the 32 bit planes of the image
* Extract and Embed data using LSB steganography techniques
* Hide images within other image bit planes
* View PNG Chunk info
* Download RGBA values of image
* Browse through image colour palette (if exists)
* Built as an Angular7 SPA, and no data is stored/transferred.

## Future Plans
* Max filesize warning to stop tab crashes on massive files
* Gray Bits feature
* An [Autostereogram](https://en.wikipedia.org/wiki/Autostereogram) solver (see [here](https://www.cs.bgu.ac.il/~ben-shahar/Teaching/Computational-Vision/StudentProjects/ICBV131/ICBV-2013-1-KatyaGroisman/FinalProjectReport.pdf))
* Automated LSB Detection (via entropy and filetype detection, on common LSB paths)
* Add support for other [PNG types](http://www.libpng.org/pub/png/book/chapter08.html#png.ch08.div.5) (at the moment we only support RGB, RGBA and bitmap) 
* Better automated filetype regex / More filetypes recognized in the [IdentifyFileTypeService](https://github.com/Ge0rg3/StegOnline/blob/master/src/app/common-services/identify-file-type.service.ts) service
* Better strings regex (see [current](https://github.com/Ge0rg3/StegOnline/blob/master/src/app/imagemenu/strings-panel/strings-panel.component.ts#L19) code)
* More steps inside the [CTF Checklist page](https://github.com/Ge0rg3/StegOnline/blob/master/src/app/checklist/checklist.component.html)
* Randomize colour palette for regular PNGs (not just type 3)

## Installation
#### Dev Environment
```
git clone https://github.com/Ge0rg3/StegOnline.git
cd StegOnline
(sudo) npm install -g @angular/cli
(sudo) npm install -i
(sudo) ng serve --open
```
#### Live Environment (Apache2)
This will install into the StegOnline/ folder of your site
```
cd ~/Documents #Or wherever you want to store it
git clone https://github.com/Ge0rg3/StegOnline.git
cd StegOnline
(sudo) npm install -g @angular/cli
(sudo) npm install -i
(sudo) ng build --prod --base-href=/StegOnline/ --aot=false --build-optimizer=false --output-path=/var/www/html/StegOnline
```
Inside of the newly created /var/www/html/StegOnline folder, create the following .htaccess file:
```
Options +FollowSymLinks
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.html [L,QSA]
```

## Contribution
Contributions would be highly appreciated, as maintaining a large program takes a lot of effort.  
See the "Future Plans" section for feature ideas <3

## Working with transparency in JavaScript
Since the Canvas API doesn't properly parse the Alpha channel ([ref](https://stackoverflow.com/questions/39744072/how-to-get-rgb-from-transparent-pixel-in-js), [ref](https://stackoverflow.com/questions/28917518/reading-pixeldata-from-images-in-javascript-returns-unexpected-results-for-semi)), we use PngToy for all PNGs. This also allows us to view other relevant information, such as chunk info and bitmap data. Unfortunately, the original PngToy library was deleted by the owner, so I'm using a copy hosted [here](https://github.com/neshume/pngtoy).
