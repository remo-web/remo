'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js'),
	CAbstractPopup = require('%PathToCoreWebclientModule%/js/popups/CAbstractPopup.js'),
	
	Ajax = require('modules/%ModuleName%/js/Ajax.js'),
	CFolderModel = require('modules/%ModuleName%/js/models/CFolderModel.js')
;

/**
 * @constructor
 */
function CSharePopup()
{
	CAbstractPopup.call(this);
	
	this.item = null;
	this.pub = ko.observable('');
	this.pubFocus = ko.observable(false);
}

_.extendOwn(CSharePopup.prototype, CAbstractPopup.prototype);

CSharePopup.prototype.PopupTemplate = '%ModuleName%_SharePopup';

/**
 * @param {Object} oItem
 */
CSharePopup.prototype.onOpen = function (oItem)
{
	this.item = oItem;
	
	this.pub('');
		
	Ajax.send('CreatePublicLink', {
			'Type': oItem.storageType(),
			'Path': oItem.path(),
			'Name': oItem.fileName(),
			'Size': oItem instanceof CFolderModel ? 0 : oItem.size(),
			'IsFolder': oItem instanceof CFolderModel
		}, this.onCreatePublicLinkResponse, this
	);
};

/**
 * @param {Object} oResponse
 * @param {Object} oRequest
 */
CSharePopup.prototype.onCreatePublicLinkResponse = function (oResponse, oRequest)
{
	if (oResponse.Result)
	{
		this.pub(UrlUtils.getAppPath() + oResponse.Result);
		this.pubFocus(true);
		this.item.published(true);
	}
};

CSharePopup.prototype.onCancelSharingClick = function ()
{
	if (this.item)
	{
		Ajax.send('DeletePublicLink', {
				'Type': this.item.storageType(),
				'Path': this.item.path(),
				'Name': this.item.fileName()
			}, this.closePopup, this);
		this.item.published(false);
	}
};

module.exports = new CSharePopup();