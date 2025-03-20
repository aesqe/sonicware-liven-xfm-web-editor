# Sonicware Liven XFM Web Editor

This project wouldn't have been possible without the amazing work done by **Cliff Lawson for his Python XFM Editor** (https://github.com/wrightflyer/XFM/): deciphering XFM's Sysex dumps, mapping the bytes to parameters, explaining the 7-8 bit transformation, and much more. Some of the code in this repository is a direct conversion from the original code in Python to Typescript, and this web editor uses the same JSON structure as the Python one to ensure compatibility. A big **thank you** from the bottom of my heart goes to Mr. Lawson :bow:

Visit the online version on Github pages https://aesqe.github.io/sonicware-liven-xfm-web-editor/ or clone the repo locally, run `yarn install` and then `yarn dev`.

## Basic Instructions

1. Connect your Liven XFM machine to the computer using MIDI cables, both the IN and OUT ports
2. Open the XFM Web Editor and select your MIDI IN and OUT ports in the top-left dropdown menus
3. Switch XFM to Edit mode
4. Move things around in the web editor

## Additional Instructions

* You can download the current patch as a JSON file by clicking the :arrow_down: button next to the patch name editor
* You can drag and drop a JSON patch file anywhere on the page and the editor will read it and update patch values
* If you work on a patch in the web editor and then change a parameter value on the device, that will not be automatically reflected in the web editor. You'll need to press the `MIDI EXPORT` button on the device and then confirm by pressing the `OK` button to send the updated values to the web editor.
* To toggle logging of `Sysex` messages to the browser console, click the button next to the `XFM Web Editor` title in the top left corner of the page. You can open the browser developer tools and switch to the console tab to view `Sysex` messages when the button is green.

## Screenshot

<img src='src/assets/screenshot-01.png'>
