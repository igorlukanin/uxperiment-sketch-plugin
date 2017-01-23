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

function getParentArtboard(layer) {
	while (layer && !isArtboard(layer)) {
		layer = layer.parentGroup();
	}
	return layer;
}

function createRadioButtons(options, selectedItem) {
	var count = options.length;

	// Make a prototype cell
	var buttonCell = [[NSButtonCell alloc] init];
		[buttonCell setButtonType:NSRadioButton]

	// And the matrix to contain the cells in Radio mode
	var buttonMatrix = [[NSMatrix alloc] initWithFrame: NSMakeRect(20.0, 20.0, 200.0, count * 25) mode:NSRadioModeMatrix prototype:buttonCell numberOfRows:count numberOfColumns:1];
		[buttonMatrix setCellSize: NSMakeSize(200, 20)];

	// Add the options as cells
	for (i = 0; i < options.length; i++) {
		[[[buttonMatrix cells] objectAtIndex: i] setTitle: options[i]];
		[[[buttonMatrix cells] objectAtIndex: i] setTag: i];
	}

	// Select the default one
	[buttonMatrix selectCellAtRow: selectedItem column: 0]

	// Return the matrix so we can display it
	return buttonMatrix;
}


function createSelect(values, initialState) {
    var select = [[NSPopUpButton alloc] initWithFrame: NSMakeRect(0, 0, 200, 25) pullsDown: false];
    select.addItemsWithTitles_(values);
    //select.setFont(NSFont.systemFontOfSize_(11));
    if (initialState) select.selectItemWithTitle_(initialState);

    return select;
}