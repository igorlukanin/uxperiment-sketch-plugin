@import 'src/api.js';
@import 'src/config.js';
@import 'src/fs.js';
@import 'src/i18n.js';
@import 'src/network.js';
@import 'src/sketch.js';
@import 'src/transition.js';


const translateRadioButtonIndex = (options, index) => options.length - index - 1;

const createRadioButtons = (options, selectedIndex) => {
	const cell = NSButtonCell.alloc().init();
	cell.setButtonType(NSRadioButton);

	const matrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns_(
		NSMakeRect(0, 0, 200, options.length * 30),
		NSRadioModeMatrix,
		cell,
		options.length,
		1);
	matrix.setCellSize(NSMakeSize(200, 20));

	options.forEach((option, i) => {
		const button = matrix.cells().objectAtIndex(translateRadioButtonIndex(options, i));
		button.setTitle(option);
		button.setTag(i);
	});

	matrix.selectCellAtRow_column_(translateRadioButtonIndex(options, selectedIndex), 0);

	return matrix;
};

const createAddTransitionDialog = (artboards, desiredArtboardIndex) => {
	const buttons = createRadioButtons(artboards, desiredArtboardIndex);

	const dialog = COSAlertWindow.new();
	dialog.setMessageText(_('add-transition.dialog.title'));
	dialog.setInformativeText(_('add-transition.dialog.subtitle'));
    dialog.addAccessoryView(buttons);
	dialog.addButtonWithTitle(_('add-transition.dialog.create-button'));
	dialog.addButtonWithTitle(_('add-transition.dialog.cancel-button'));

	return {
		dialog,
		buttons
	};
}

const getSelectedValueOfAddTransitionDialog = (buttons, options) => {
	const cells = buttons.cells();
	let result = undefined;

	options.some((option, i) => {
		const button = cells.objectAtIndex(translateRadioButtonIndex(options, i));

		if (button.state()) {
			result = button.tag();
			return true;
		}
	});

	return result;
};

var onRun = context => {
	if (isSelectionEmpty(context)) {
		showToast(context, _('add-transition.empty-selection'));
		return;
	}

	const page = context.api().selectedDocument.selectedPage;
	const selectedArtboard = getSelectedArtboard(context);
	const artboards = getArtboardNames(page);

	const { dialog, buttons } = createAddTransitionDialog(artboards, artboards.indexOf(selectedArtboard.name()));
	const response = dialog.runModal();

	if (response != "1000") {
		return;
	}

	const artboardIndex = getSelectedValueOfAddTransitionDialog(buttons, artboards);
	setTransitionToArtboard(context, getSelectedLayer(context), artboardIndex);

	showToast(context, _('add-transition.success'));
};