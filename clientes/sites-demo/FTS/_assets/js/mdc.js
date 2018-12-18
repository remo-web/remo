function ftsMDC(){

    //TOP BAR
    var topAppBars = document.querySelectorAll('.mdc-top-app-bar')
    for (var i = 0, topAppBar; topAppBar = topAppBars[i]; i++) {
        mdc.topAppBar.MDCTopAppBar.attachTo(topAppBar);
    }

    //BUTTON RIPPLE
//    var buttonRipples = document.querySelectorAll('.mdc-button')
//    for (var i = 0, buttonRipple; buttonRipple = buttonRipples[i]; i++) {
//        mdc.buttonRipple.MDCRipple.attachTo(buttonRipple);
//    }

    //TEXT FIELDS
    var textFields = document.querySelectorAll('.mdc-text-field')
    for (var i = 0, textField; textField = textFields[i]; i++) {
        mdc.textField.MDCTextField.attachTo(textField);
    }
};