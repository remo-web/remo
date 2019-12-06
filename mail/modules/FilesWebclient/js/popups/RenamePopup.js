'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),
	
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js')
;

/**
 * @constructor
 */
function CRenamePopup()
{
	CAbstractPopup.call(this);
	
	this.fCallback = null;
	
	this.name = ko.observable('');
	this.focused = ko.observable(false);
	this.error = ko.observable('');
	this.name.subscribe(function () {
		this.error('');
	}, this);
}

_.extendOwn(CRenamePopup.prototype, CAbstractPopup.prototype);

CRenamePopup.prototype.PopupTemplate = '%ModuleName%_RenamePopup';

/**
 * @param {string} sName
 * @param {function} fCallback
 */
CRenamePopup.prototype.onOpen = function (sName, fCallback)
{
	this.fCallback = fCallback;
	
	this.name(sName);
	this.focused(true);
	this.error('');
};

CRenamePopup.prototype.onOKClick = function ()
{
	this.error('');
	
	if ($.isFunction(this.fCallback))
	{
		var sError = this.fCallback(this.name());
		if (sError)
		{
			this.error(sError);
		}
		else
		{
			this.closePopup();
		}
	}
	else
	{
		this.closePopup();
	}
};

module.exports = new CRenamePopup();