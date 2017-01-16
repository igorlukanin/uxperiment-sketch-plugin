/*
 * Copyright 2016 Alexander Khramtsov
 * falkeyn@yandex.ru
 *
 */

function alert(msg, title) {
  title = title || "alert";
  var app = [NSApplication sharedApplication];
  [app displayDialog:msg withTitle:title];
}


function isArtboard(layer) {
  return layer.isMemberOfClass(MSArtboardGroup.class());
}

function setSelection(context, layers) {
  context.document.currentPage().deselectAllLayers();
  layers.forEach(function(l) {
    [l select:true byExpandingSelection:true];
  });
}

function sanitize(name) {
  return name.replace(/й/g,"и").replace(/\s/g,"_");
}

function getIndex(array, value) {
  var res = -1;
  for (var i = 0; i < array.length; i++) {
    if (array[i] == value) { res = i }
  }
  //log("getIndex «"+value+"» in ["+array+"] = "+res);
  return res;
}

function toJSArray(nsarray)
{
	var result = []
	for (var i = 0; i < nsarray.count(); i++) {
		result.push(nsarray.objectAtIndex(i))
	}
	return result
}

function selectArtboardsContainingSelection(context) {
  var selectedArtboards = [];
  for (var i = 0; i < context.selection.count(); i++) {
    var layer = context.selection.objectAtIndex(i);
    while (layer && !isArtboard(layer)) {
      layer = layer.parentGroup();
    }

    if (layer) {
      if (selectedArtboards.indexOf(layer) < 0) {
        selectedArtboards.push(layer);
      }
    }
  }

  setSelection(context, selectedArtboards);
  return selectedArtboards;
}
