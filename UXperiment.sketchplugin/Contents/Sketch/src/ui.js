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

const createArtboardSelectionDialog = (options, artboards, desiredArtboardIndex) => {
    const buttons = createRadioButtons(artboards, desiredArtboardIndex);

    const dialog = COSAlertWindow.new();
    dialog.setMessageText(options.title);
    dialog.setInformativeText(options.subtitle);
    dialog.addAccessoryView(buttons);
    dialog.addButtonWithTitle(options.submitButton);
    dialog.addButtonWithTitle(options.cancelButton);

    return {
        dialog,
        buttons
    };
}

const getSelectedValueOfArtboardSelectionDialog = (buttons, options) => {
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