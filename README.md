# <img src='public/xfm.svg' width="44" align="left"> Sonicware Liven XFM Web Editor

This is a browser-based sound editor for the [Liven XFM synth](https://sonicware.jp/pages/liven-xfm). It uses MIDI Sysex messages to receive patch data from the device and transmit it back.

This project wouldn't have been possible without the amazing work done by **Cliff Lawson for his Python XFM Editor** (https://github.com/wrightflyer/XFM/): deciphering XFM's Sysex dumps, mapping the bytes to parameters, explaining the 7-8 bit transformation, and much more. Some of the code in this repository is a direct conversion from the original code in Python to Typescript, and this web editor uses the same JSON structure as the Python one to ensure compatibility. A big **thank you** from the bottom of my heart goes to Mr. Lawson :bow:

Visit the online version of the web editor on Github pages https://aesqe.github.io/sonicware-liven-xfm-web-editor/ or clone the repo locally, run `yarn install` and then `yarn dev`.

## Basic Instructions

1. Connect your Liven XFM machine to the computer using MIDI cables, both the IN and OUT ports
2. Open the XFM Web Editor and select your MIDI IN and OUT ports in the top-left dropdown menus
3. Switch XFM to Edit mode
4. Move things around in the web editor

## Additional Instructions

* You can download the current patch as a JSON file by clicking the :arrow_down: button next to the patch name editor
* You can drag and drop a JSON or SYX patch file anywhere on the page and the editor will read it, update its values, and send the patch to the device. You can drag a single preset, single bank with multiple presets, or a whole XFM backup dump SYX file and you will be presented with a list of banks and patches in a modal popup, from where you'll be able to load any patch into memory.
  * You can find all original patches that come with the device in JSON format in the Python editor repo: https://github.com/wrightflyer/XFM/tree/master/factory
  * And here is a very nice set of 50 basic waveforms in SYX format by Chris Lody: https://www.youtube.com/watch?v=sm_kKbW1FNo
* If you work on a patch in the web editor and then change a parameter value on the device, that change will not be automatically reflected in the web editor. You'll need to press the `MIDI EXPORT` button on the device and then confirm by pressing the `OK` button to send the updated values to the web editor.
* To toggle logging of `Sysex` messages to the browser console, click the button next to the `XFM Web Editor` title in the top left corner of the page. You can open the browser developer tools and switch to the console tab to view `Sysex` messages when the button is green.
* The points on the ADSR envelope can be dragged around to change time/level values. Just have in mind that the line/curve display is for illustrative purposes only, as it would take a much bigger area and more complex calculations to display the envelope accurately.
* There are 4 buttons and a switch in the leftmost block, under each operator's name:
  * The first button will `reset/initialize` all operator values to their defaults
  * The `Pitch EG` switch will toggle whether the operator is affected by the pitch envelope or not
  * The next two buttons will `Copy` and `Paste` values from one operator to another
  * The last button will `randomize` *some* of the parameters of the operator:
    * Ratio, Frequency, Detune, Feedback and other operator inputs
* The randomizer and undo/redo functionalities are works in progress, so don't expect them to work flawlessly yet.
* The editor supports switching between dark and light modes. By default, it will follow your system preferences.

### MIDI Mapping

* Click the MIDI Mapping button in the page header to toggle the mappings editor
* Select a MIDI controller device from the dropdown
* Click the `Mapping: OFF` button to enable editing
* Click on a control to select it, then move a knob on your MIDI controller to map it
* A single control can be mapped to any number of CCs
* Multiple controls can be mapped to a single CC
* There might be some performance issues if you try to adjust many controls at once
* Last used CC number will be displayed in the top area of the mappings editor and indicators related to that CC will change color in the mappings list so they can be easily spotted.
* To remove a CC mapping, simply click the `X` button next to it.
* Clicking a control or a row in the listings table will select the appropriate control and/or automatically scroll to its table row.

## Troubleshooting

If you run into any trouble with the editor, please create a new issue in the [issues tracker on Github](https://github.com/aesqe/sonicware-liven-xfm-web-editor/issues).

If you don't have a Github account and don't want to create one, you can contact me on [Reddit](https://www.reddit.com/user/aesqe/)

## Screenshots

<img src='src/assets/screenshot-default.png' />
<img src='src/assets/screenshot-midi-mapping.png' /> 
<img src='src/assets/screenshot-dark-mode.png' />





