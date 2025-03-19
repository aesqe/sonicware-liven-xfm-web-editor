# Sonicware Liven XFM Web Editor

This project wouldn't have been possible without the amazing work done by **Cliff Lawson for his Python XFM Editor** (https://github.com/wrightflyer/XFM/): deciphering XFM's sysex dumps, mapping the bytes to parameters, explaining the 7-8 bit transformation, and much more. Some of the code in this repository is a direct conversion from the original code in Python to Typescript, and this web editor uses the same JSON structure as the Python one to ensure compatibility. A big **thank you** from the bottom of my heart goes to Mr. Lawson :bow:

Visit the online version on Github pages https://aesqe.github.io/sonicware-liven-xfm-web-editor/ or clone the repo locally, run `yarn install` and then `yarn dev`.

## Instructions

1. Connect your Liven XFM machine to the computer using MIDI cables, both the IN and OUT ports
2. Open the XFM Web Editor and select your MIDI IN and OUT ports in the top-left dropdown menus
3. Switch XFM to Edit mode
4. Move things around in the web editor

## Screenshot

<img src='src/assets/screenshot-01.png'>
