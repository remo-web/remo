window.onload = function(){
    
    // TOP APP BAR
    var topAppBars = document.querySelectorAll('.mdc-top-app-bar')
    for (var i = 0, topAppBar; topAppBar = topAppBars[i]; i++) {
        mdc.topAppBar.MDCTopAppBar.attachTo(topAppBar);
    }
    
    // DRAWER
    let drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));
    document.querySelector('.gsf-drawer-open').addEventListener('click', () => drawer.open = true);

// RUNNING INSIDE INCLUDE.JS

    //TEXT FIELDS
//    var textFields = document.querySelectorAll('.mdc-text-field')
//    for (var i = 0, textField; textField = textFields[i]; i++) {
//        mdc.textField.MDCTextField.attachTo(textField);
//    }

    // DIALOGS
    var dialogs = document.querySelectorAll('.mdc-dialog')
    for (var i = 0, dialog; dialog = dialogs[i]; i++) {
        mdc.dialog.MDCDialog.attachTo(dialog);
    }

    var dialogAnalise = new mdc.dialog.MDCDialog(document.querySelector('#gsf-dialog-analise'));
    document.querySelector('#gsf-mais-analise').addEventListener('click', function (evt) {
        dialogAnalise.lastFocusedTarget = evt.target;
        dialogAnalise.show();
    })

    var dialogOperacao = new mdc.dialog.MDCDialog(document.querySelector('#gsf-dialog-operacao'));
    document.querySelector('#gsf-mais-operacao').addEventListener('click', function (evt) {
        dialogOperacao.lastFocusedTarget = evt.target;
        dialogOperacao.show();
    })

    var dialogManutencao = new mdc.dialog.MDCDialog(document.querySelector('#gsf-dialog-manutencao'));
    document.querySelector('#gsf-mais-manutencao').addEventListener('click', function (evt) {
        dialogManutencao.lastFocusedTarget = evt.target;
        dialogManutencao.show();
    })
    
}