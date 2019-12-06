'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),
	
	Utils = require('%PathToCoreWebclientModule%/js/utils/Common.js'),
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js'),
	
	Ajax = require('modules/%ModuleName%/js/Ajax.js'),
	CFileModel = require('modules/%ModuleName%/js/models/CFileModel.js')
;

/**
 * @constructor
 */
function CCreateLinkPopup()
{
	CAbstractPopup.call(this);
	
	this.fCallback = null;
	this.link = ko.observable('');
	this.linkPrev = ko.observable('');
	this.linkFocus = ko.observable(false);
	this.checkTimeout = null;
	this.urlChecked = ko.observable(false);
	this.saveCommand = Utils.createCommand(this, this.executeSave, function () {
		return (this.urlChecked());
	});
	this.fileItem = ko.observable(null);
}

_.extendOwn(CCreateLinkPopup.prototype, CAbstractPopup.prototype);

CCreateLinkPopup.prototype.PopupTemplate = '%ModuleName%_CreateLinkPopup';

/**
 * @param {Function} fCallback
 */
CCreateLinkPopup.prototype.onOpen = function (fCallback)
{
	this.link('');
	this.linkFocus(true);
	
	this.fCallback = fCallback;
	this.checkTimer = setTimeout(_.bind(this.checkUrl, this), 2000);
};

CCreateLinkPopup.prototype.checkUrl = function ()
{
	clearTimeout(this.checkTimer);
	if (this.link() !== this.linkPrev())
	{
		this.linkPrev(this.link());
		Ajax.send('CheckUrl', { 'Url': this.link() }, this.onCheckUrlResponse, this);
	}
	this.checkTimer = setTimeout(_.bind(this.checkUrl, this), 1000);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CCreateLinkPopup.prototype.onCheckUrlResponse = function (oResponse, oRequest)
{
	if (oResponse.Result)
	{
		var
			oData = CFileModel.prepareLinkData(oResponse.Result, this.link()),
			oFile = new CFileModel(oData)
		;
		this.fileItem(oFile);
		this.urlChecked(true);
	}
};

CCreateLinkPopup.prototype.executeSave = function ()
{
	if ($.isFunction(this.fCallback))
	{
		this.fCallback(this.fileItem());
		this.link('');
		this.linkPrev('');
		this.urlChecked(false);
	}
	clearTimeout(this.checkTimer);
	this.closePopup();
};

CCreateLinkPopup.prototype.cancelPopup = function ()
{
	this.link('');
	this.linkPrev('');
	this.urlChecked(false);
	clearTimeout(this.checkTimer);
	this.closePopup();
};

module.exports = new CCreateLinkPopup();
