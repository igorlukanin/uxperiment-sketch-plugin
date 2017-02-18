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