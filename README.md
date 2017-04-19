# UXperiment Sketch Export

This plugin transforms a [Sketch](https://sketchapp.com) document into a JSON object and uploads it to a remote API endpoint. It has menu actions to select an initial artboard and setup layer-to-artboard and layer-to-URL transitions.

This plugin is a part of [UXperiment](https://uxperiment.io/user).

### Code Snippets

This plugin has a number of convenient library functions which may help to bootstrap your plugin:

* [config.js](UXperiment.sketchplugin/Contents/Sketch/src/config.js) — working with per-installation, per-document and per-layer config values
* [fs.js](UXperiment.sketchplugin/Contents/Sketch/src/fs.js) — working with binary and temporary files
* [i18n.js](UXperiment.sketchplugin/Contents/Sketch/src/i18n.js) — simple internationalization support
* [network.js](UXperiment.sketchplugin/Contents/Sketch/src/network.js) — sending GET and POST requests and parsing JSON responses
* [sketch.js](UXperiment.sketchplugin/Contents/Sketch/src/sketch.js) — traversing a Sketch document tree: pages, artboards, layers, selections
* [ui.js](UXperiment.sketchplugin/Contents/Sketch/src/ui.js) — simple UI interactions: toasts, modal dialogs
