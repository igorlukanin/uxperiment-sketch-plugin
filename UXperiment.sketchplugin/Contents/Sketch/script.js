function dialogMake(artboardNames, curArtboard) {
	var dialog = COSAlertWindow.new();

	dialog.setMessageText("Создаем кликабельный элемент");
	dialog.setInformativeText("Здесь текст подсказки какой-то");

	// Tabs
	// https://developer.apple.com/reference/appkit/nssegmentedcontrol
	var tabs = [[NSSegmentedControl alloc] initWithFrame: NSMakeRect(0,0,400,25)];
	tabs.setSegmentCount(3);
	tabs.setLabel_forSegment("Ссылка", 0);
	tabs.setLabel_forSegment("Панель", 1);
	tabs.setLabel_forSegment("Дропдаун", 2);
	tabs.setSelected_forSegment(true, 0);
	dialog.addAccessoryView(tabs);

	// Radiobuttons
    //dialog.addTextLabelWithValue("Тип поля");
    //dialog.addAccessoryView(createRadioButtons(["Ссылка на артборд", "Фиксированная панель", "Внешняя ссылка"], 0));


	// Select
    dialog.addTextLabelWithValue("Переход на страницу");
	dialog.addAccessoryView(createSelect(artboardNames, curArtboard));

	// Text
	dialog.addTextLabelWithValue("Событие для аналитики");
	dialog.addTextFieldWithValue("");




	// Actions buttons.
	dialog.addButtonWithTitle('Создать');
	dialog.addButtonWithTitle('Отменить');

	return dialog;
}


function handleAlertResponse(dialog, responseCode) {
	if (responseCode == "1000") {
		function valAtIndex (view, index) {
			return parseInt(view.viewAtIndex(index).stringValue());
		}

		return {
			basename: dialog.viewAtIndex(1).stringValue(),
			startsFrom: valAtIndex(dialog,3)
		}
	}

	return null;
}

function getArtboardNames(artboards) {
	var names = new Array();
	for (var i = artboards.count() - 1; i >= 0; i--) {
		var artboard = [artboards objectAtIndex:i];
		names.push([artboard name]);
	}
	return names;
}



var Make = function(context) {
	var	doc = context.document;
	var selection = context.selection;

	if (selection.count() == 0) {
		doc.showMessage('Выбери хоть что-нибудь!')
		return
	}

	var command = context.command;
	var page = context.document.currentPage();

	var artboardNames = getArtboardNames([page artboards]);

	// Show dialog
	var dialog = dialogMake(artboardNames, getParentArtboard(selection[0]).name());
	//options = selection[0].name;
	var options=handleAlertResponse(dialog,dialog.runModal());
	//if (!options.startsFrom) options.startsFrom = 1;


	[doc showMessage: "Элемент создан"];
}

const iterateMap = (object, apply) => {
    if (object.iterate === undefined) {
        return undefined;
    }

    const children = [];
    object.iterate(child => children.push(apply(child)));
    return children;
};

const getLayerType = layer => {
    return layer.isArtboard ? 'artboard' :
           layer.isGroup    ? 'group' :
           layer.isImage    ? 'image' :
           layer.isPage     ? 'page' :
           layer.isShape    ? 'shape' :
           layer.isText     ? 'text' : undefined;
};

const exportLayer = layer => ({
    name: layer.name + '',
    index: layer.index,
    type: getLayerType(layer),
    children: iterateMap(layer, exportLayer)
});

var Publish = function(context) {
	const sketch = context.api();
	const document = sketch.selectedDocument;
	const pages = document.pages;

	const result = pages
        .filter(page => page.name != 'Symbols')
        .map(page => ({
            name: page.name + '',
            layers: iterateMap(page, exportLayer)
        }));

    log(JSON.stringify(result, null, 2));
	log(' ');
/*

	if(this.exportPanel()){
        var self = this;

            var processingPanel = this.SMPanel({
                    url: this.pluginSketch + "/panel/processing.html",
                    width: 304,
                    height: 104,
                    floatWindow: true
                }),
                processing = processingPanel.windowScriptObject(),
                template = NSString.stringWithContentsOfFile_encoding_error(this.pluginSketch + "/template.html", 4, nil);

            var idx = 1,
                artboardIndex = 0,
                layerIndex = 0,
                exporting = false,
                data = {
                    scale: self.configs.scale,
                    unit: self.configs.unit,
                    colorFormat: self.configs.colorFormat,
                    artboards: [],
                    slices: [],
                    colors: []
                };

            self.slices = [];
            self.sliceCache = {};
            self.maskCache = [];
            self.wantsStop = false;

            coscript.scheduleWithRepeatingInterval_jsFunction( 0, function( interval ){
                // self.message('Processing layer ' + idx + ' of ' + self.allCount);
                processing.evaluateWebScript("processing('"  + Math.round( idx / self.allCount * 100 ) +  "%', '" + _("Processing layer %@ of %@", [idx, self.allCount]) + "')");
                idx++;

                if(!data.artboards[artboardIndex]){
                    data.artboards.push({layers: [], notes: []});
                    self.maskCache = [];
                    self.maskObjectID = undefined;
                    self.maskRect = undefined;
                }

                if(!exporting) {
                    exporting = true;
                    var artboard = self.selectionArtboards[artboardIndex],
                        page = artboard.parentGroup(),
                        layer = artboard.children()[layerIndex];

                    // log( page.name() + ' - ' + artboard.name() + ' - ' + layer.name());
                    try {
                      self.getLayer(
                          artboard, // Sketch artboard element
                          layer, // Sketch layer element
                          data.artboards[artboardIndex] // Save to data
                      );
                      layerIndex++;
                      exporting = false;
                    } catch (e) {
                      self.wantsStop = true;
                      processing.evaluateWebScript("$('#processing-text').html('<strong>Error:</strong> <small>" + self.toHTMLEncode(e.message) + "</small>');");
                    }

                    if( self.is(layer, MSArtboardGroup) || self.is(layer, MSSymbolMaster)){
                        var objectID = artboard.objectID(),
                            artboardRect = self.getRect(artboard),
                            page = artboard.parentGroup(),
                            // name = self.toSlug(self.toHTMLEncode(page.name()) + ' ' + self.toHTMLEncode(artboard.name()));
                            slug = self.toSlug(page.name() + ' ' + artboard.name());

                        data.artboards[artboardIndex].pageName = self.toHTMLEncode(self.emojiToEntities(page.name()));
                        data.artboards[artboardIndex].pageObjectID = self.toJSString(page.objectID());
                        data.artboards[artboardIndex].name = self.toHTMLEncode(self.emojiToEntities(artboard.name()));
                        data.artboards[artboardIndex].slug = slug;
                        data.artboards[artboardIndex].objectID = self.toJSString(artboard.objectID());
                        data.artboards[artboardIndex].width = artboardRect.width;
                        data.artboards[artboardIndex].height = artboardRect.height;

                        if(!self.configs.exportOption){
                            var imageURL = NSURL.fileURLWithPath(self.exportImage({
                                    layer: artboard,
                                    scale: 2,
                                    name: objectID
                                })),
                                imageData = NSData.dataWithContentsOfURL(imageURL),
                                imageBase64 = imageData.base64EncodedStringWithOptions(0);
                            data.artboards[artboardIndex].imageBase64 = 'data:image/png;base64,' + imageBase64;

                            var newData =  JSON.parse(JSON.stringify(data));
                            newData.artboards = [data.artboards[artboardIndex]];
                            self.writeFile({
                                    content: self.template(template, {lang: language, data: JSON.stringify(newData)}),
                                    path: self.toJSString(savePath),
                                    fileName: slug + ".html"
                                });
                        }
                        else{
                            // data.artboards[artboardIndex].imagePath = "preview/" + objectID + ".png";
                            data.artboards[artboardIndex].imagePath = "preview/" + encodeURI(slug) + ".png";

                            self.exportImage({
                                    layer: artboard,
                                    path: self.toJSString(savePath) + "/preview",
                                    scale: 2,
                                    // name: objectID,
                                    name: slug
                                });

                            self.writeFile({
                                    content: "<meta http-equiv=\"refresh\" content=\"0;url=../index.html#artboard" + artboardIndex + "\">",
                                    path: self.toJSString(savePath) + "/links",
                                    fileName: slug + ".html"
                                });
                        }


                        layerIndex = 0;
                        artboardIndex++;
                    }

                    if(artboardIndex >= self.selectionArtboards.length){
                        if(self.slices.length > 0){
                            data.slices = self.slices;
                        }

                        if(self.configs.colors && self.configs.colors.length > 0){
                            data.colors = self.configs.colors;
                        }

                        var selectingPath = savePath;
                        if(self.configs.exportOption){
                            self.writeFile({
                                    content: self.template(template, {lang: language, data: JSON.stringify(data)}),
                                    path: self.toJSString(savePath),
                                    fileName: "index.html"
                                });
                            selectingPath = savePath + "/index.html";
                        }
                        NSWorkspace.sharedWorkspace().activateFileViewerSelectingURLs(NSArray.arrayWithObjects(NSURL.fileURLWithPath(selectingPath)));

                        self.message(_("Export complete!"));
                        self.wantsStop = true;
                    }
                }

                if( self.wantsStop === true ){
                    return interval.cancel();
                }


            });
    }

*/
}
