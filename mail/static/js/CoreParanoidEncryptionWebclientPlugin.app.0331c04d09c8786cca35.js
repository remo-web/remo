(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

/***/ "2d9n":
/*!***************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ConfirmUploadPopup.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF")
;

/**
 * @constructor
 */
function CConfirmUploadPopup()
{
	CAbstractPopup.call(this);
	
	this.fUpload = null;
	this.fCancel = null;
	this.message = ko.observable('');
	this.filesConfirmText = ko.observable('');
	this.sErrorText = ko.observable('');
}

_.extendOwn(CConfirmUploadPopup.prototype, CAbstractPopup.prototype);

CConfirmUploadPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_ConfirmUploadPopup';

CConfirmUploadPopup.prototype.onOpen = function (fUpload, fCancel, iFilesCount, aFileList, sErrorText)
{
	var aEncodedFiles = _.map(aFileList, function (sFileName) {
		return TextUtils.encodeHtml(sFileName);
	});
	
	this.filesConfirmText('');
	this.fUpload = fUpload;
	this.fCancel = fCancel;
	this.message(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/CONFIRM_UPLOAD_PLURAL', {'VALUE': iFilesCount > 1 ? iFilesCount : '"' + aFileList[0] + '"'}, null, iFilesCount));
	if (iFilesCount > 1)
	{
		this.filesConfirmText(aEncodedFiles.join('<br />'));
	}
	this.sErrorText(sErrorText);
};

CConfirmUploadPopup.prototype.cancelUpload = function ()
{
	this.fCancel();
	this.closePopup();
};

CConfirmUploadPopup.prototype.upload = function ()
{
	this.fUpload();
	this.closePopup();
};

module.exports = new CConfirmUploadPopup();


/***/ }),

/***/ "2kfa":
/*!*************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/GenerateKeyPopup.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
	JscryptoKey = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js */ "zDR0")
;

/**
 * @constructor
 */
function CGenerateKeyPopup()
{
	CAbstractPopup.call(this);

	this.keyName = ko.observable(App.getUserPublicId());
	this.fOnGenerateCallback = null;
}

_.extendOwn(CGenerateKeyPopup.prototype, CAbstractPopup.prototype);

CGenerateKeyPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_GenerateKeyPopup';

CGenerateKeyPopup.prototype.onOpen = function (fOnGenerateCallback)
{
	this.fOnGenerateCallback = fOnGenerateCallback;
};

CGenerateKeyPopup.prototype.generateKey = function ()
{
	JscryptoKey.generateKey(_.bind(function() {
			this.fOnGenerateCallback();
		}, this),
		this.keyName()
	);
	this.closePopup();
};

module.exports = new CGenerateKeyPopup();


/***/ }),

/***/ "B9Yq":
/*!***************************************!*\
  !*** (webpack)/buildin/amd-define.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),

/***/ "I5pT":
/*!**********************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/Settings.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	_ = __webpack_require__(/*! underscore */ "F/us"),

	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	ServerModuleName: 'CoreParanoidEncryptionWebclientPlugin',
	HashModuleName: 'paranoid-encryption',
	EncryptionAllowedModules: ['Files'],
	EncryptionAllowedStorages: ['personal', 'corporate'],

	EnableJscrypto: ko.observable(true),
	EncryptionMode: ko.observable(Enums.EncryptionMode.Always),
	ChunkSizeMb: 5,
	AllowMultiChunkUpload: true,
	AllowChangeSettings: false,

	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = _.extend({}, oAppData[this.ServerModuleName] || {}, oAppData['CoreParanoidEncryptionWebclientPlugin'] || {});

		if (!_.isEmpty(oAppDataSection))
		{
			this.EnableJscrypto(Types.pBool(oAppDataSection.EnableModule, this.EnableJscrypto()));
			this.EncryptionMode(Types.pEnum(oAppDataSection.EncryptionMode, Enums.EncryptionMode, this.EncryptionMode()));
			this.ChunkSizeMb = Types.pInt(oAppDataSection.ChunkSizeMb, this.ChunkSizeMb);
			this.AllowMultiChunkUpload = Types.pBool(oAppDataSection.AllowMultiChunkUpload, this.AllowMultiChunkUpload);
			this.AllowChangeSettings = Types.pBool(oAppDataSection.AllowChangeSettings, this.AllowChangeSettings);
		}
	},

	/**
	 * Updates new settings values after saving on server.
	 * 
	 * @param {boolean} bEnableJscrypto
	 * @param {number} iEncryptionMode
	 */
	update: function (bEnableJscrypto, iEncryptionMode)
	{
		this.EnableJscrypto(bEnableJscrypto);
		this.EncryptionMode(Types.pInt(iEncryptionMode));
	}
};


/***/ }),

/***/ "LU2F":
/*!********************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/DecryptKeyPasswordPopup.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF")
;

/**
 * @constructor
 */
function CDecryptKeyPasswordPopup()
{
	CAbstractPopup.call(this);

	this.keyPassword = ko.observable('');
	this.fOnPasswordEnterCallback = null;
	this.fOnCancellCallback = null;
}

_.extendOwn(CDecryptKeyPasswordPopup.prototype, CAbstractPopup.prototype);

CDecryptKeyPasswordPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_DecryptKeyPasswordPopup';

CDecryptKeyPasswordPopup.prototype.onOpen = function (fOnPasswordEnterCallback, fOnCancellCallback)
{
	this.fOnPasswordEnterCallback = fOnPasswordEnterCallback;
	this.fOnCancellCallback = fOnCancellCallback;
};

CDecryptKeyPasswordPopup.prototype.decryptKey = function ()
{
	if (_.isFunction(this.fOnPasswordEnterCallback))
	{
		this.fOnPasswordEnterCallback(this.keyPassword());
	}
	this.closePopup();
};

CDecryptKeyPasswordPopup.prototype.cancelPopup = function ()
{
	if (_.isFunction(this.fOnCancellCallback))
	{
		this.fOnCancellCallback();
	}
	this.closePopup();
};

CDecryptKeyPasswordPopup.prototype.onShow = function ()
{
	this.keyPassword('');
};

module.exports = new CDecryptKeyPasswordPopup();


/***/ }),

/***/ "Npm9":
/*!*****************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ImportKeyStringPopup.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
	JscryptoKey = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js */ "zDR0")
;

/**
 * @constructor
 */
function CImportKeyStringPopup()
{
	CAbstractPopup.call(this);

	this.keyName = ko.observable(App.getUserPublicId());
	this.newKey = ko.observable('');
}

_.extendOwn(CImportKeyStringPopup.prototype, CAbstractPopup.prototype);

CImportKeyStringPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_ImportKeyStringPopup';

CImportKeyStringPopup.prototype.onOpen = function ()
{
	this.newKey('');
};

CImportKeyStringPopup.prototype.importKey = function ()
{
	JscryptoKey.importKeyFromString(this.keyName(), this.newKey());
	this.closePopup();
};

module.exports = new CImportKeyStringPopup();


/***/ }),

/***/ "PDX0":
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),

/***/ "QJDP":
/*!*********************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/CCrypto.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	_ = __webpack_require__(/*! underscore */ "F/us"),

	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	FileSaver = __webpack_require__(/*! modules/CoreWebclient/js/vendors/FileSaver.js */ "uN/E"),
	JscryptoKey = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js */ "zDR0"),
	HexUtils = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/utils/Hex.js */ "wjWM"),
	Settings = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/Settings.js */ "I5pT")
;

/**
 * @constructor
 */
function CCrypto()
{
	this.iChunkNumber = 0;
	this.iChunkSize = Settings.ChunkSizeMb * 1024 * 1024;
	this.iCurrChunk = 0;
	this.oChunk = null;
	this.iv = null;
	// Queue of files awaiting upload
	this.oChunkQueue = {
		isProcessed: false,
		aFiles: []
	};
	this.aStopList = [];
	this.fOnUploadCancelCallback = null;
}

CCrypto.prototype.start = function (oFileInfo)
{
	this.oFileInfo = oFileInfo;
	this.oFile = oFileInfo.File;
	this.iChunkNumber = Math.ceil(oFileInfo.File.size/this.iChunkSize);
	this.iCurrChunk = 0;
	this.oChunk = null;
	this.iv = window.crypto.getRandomValues(new Uint8Array(16));
	this.oFileInfo.Hidden = { 'RangeType': 1 };
	this.oFileInfo.Hidden.ExtendedProps = { 'InitializationVector': HexUtils.Array2HexString(new Uint8Array(this.iv)) };
};

CCrypto.prototype.startUpload = function (oFileInfo, sUid, fOnChunkEncryptCallback, fCancelCallback)
{
	this.oChunkQueue.isProcessed = true;
	this.start(oFileInfo);
	JscryptoKey.getKey(
		_.bind(function() {
			this.readChunk(sUid, fOnChunkEncryptCallback);
		},this),
		fCancelCallback
	);
};

CCrypto.prototype.cryptoKey = function ()
{
	return JscryptoKey.key();
};

CCrypto.prototype.readChunk = function (sUid, fOnChunkEncryptCallback)
{
	var
		iStart = this.iChunkSize * this.iCurrChunk,
		iEnd = (this.iCurrChunk < (this.iChunkNumber - 1)) ? this.iChunkSize * (this.iCurrChunk + 1) : this.oFile.size,
		oReader = new FileReader(),
		oBlob = null
	;
	
	if (this.aStopList.indexOf(sUid) !== -1)
	{ // if user canceled uploading file with uid = sUid
		this.aStopList.splice(this.aStopList.indexOf(sUid), 1);
		this.checkQueue();
		return;
	}
	else
	{
		// Get file chunk
		if (this.oFile.slice)
		{
			oBlob = this.oFile.slice(iStart, iEnd);
		}
		else if (this.oFile.webkitSlice)
		{
			oBlob = this.oFile.webkitSlice(iStart, iEnd);
		}
		else if (this.oFile.mozSlice)
		{
			oBlob = this.oFile.mozSlice(iStart, iEnd);
		}

		if (oBlob)
		{
			try
			{ //Encrypt file chunk
				oReader.onloadend = _.bind(function(evt) {
					if (evt.target.readyState === FileReader.DONE)
					{
						this.oChunk = evt.target.result;
						this.iCurrChunk++;
						this.encryptChunk(sUid, fOnChunkEncryptCallback);
					}
				}, this);

				oReader.readAsArrayBuffer(oBlob);
			}
			catch(err)
			{
				Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_ENCRYPTION'));
			}
		}
	}
};

CCrypto.prototype.encryptChunk = function (sUid, fOnChunkEncryptCallback)
{
	crypto.subtle.encrypt({ name: 'AES-CBC', iv: this.iv }, this.cryptoKey(), this.oChunk)
		.then(_.bind(function (oEncryptedContent) {
			//delete padding for all chunks except last one
			oEncryptedContent = (this.iChunkNumber > 1 && this.iCurrChunk !== this.iChunkNumber) ? oEncryptedContent.slice(0, oEncryptedContent.byteLength - 16) : oEncryptedContent;
			var
				oEncryptedFile = new Blob([oEncryptedContent], {type: "text/plain", lastModified: new Date()}),
				//fProcessNextChunkCallback runs after previous chunk uploading
				fProcessNextChunkCallback = _.bind(function (sUid, fOnChunkEncryptCallback) {
					if (this.iCurrChunk < this.iChunkNumber)
					{// if it was not last chunk - read another chunk
						this.readChunk(sUid, fOnChunkEncryptCallback);
					}
					else
					{// if it was last chunk - check Queue for files awaiting upload
						this.oChunkQueue.isProcessed = false;
						this.checkQueue();
					}
				}, this)
			;
			this.oFileInfo.File = oEncryptedFile;
			//use last 16 byte of current chunk as initial vector for next chunk
			this.iv = new Uint8Array(oEncryptedContent.slice(oEncryptedContent.byteLength - 16));
			if (this.iCurrChunk === 1)
			{ // for first chunk enable 'FirstChunk' attribute. This is necessary to solve the problem of simultaneous loading of files with the same name
				this.oFileInfo.Hidden.ExtendedProps.FirstChunk = true;
			}
			else
			{
				delete this.oFileInfo.Hidden.ExtendedProps.FirstChunk;
			}
			
			if (this.iCurrChunk == this.iChunkNumber)
			{ // unmark file as loading
				delete this.oFileInfo.Hidden.ExtendedProps.Loading;
			}
			else
			{ // mark file as loading until upload doesn't finish
				this.oFileInfo.Hidden.ExtendedProps.Loading = true;
			}
			// call upload of encrypted chunk
			fOnChunkEncryptCallback(sUid, this.oFileInfo, fProcessNextChunkCallback, this.iCurrChunk, this.iChunkNumber, (this.iCurrChunk - 1) * this.iChunkSize);
		}, this))
		.catch(function(err) {
			Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_ENCRYPTION'));
		})
	;
};

CCrypto.prototype.downloadDividedFile = function (oFile, iv, fProcessBlobCallback)
{
	new CDownloadFile(oFile, iv, this.iChunkSize, fProcessBlobCallback);
};
/**
* Checking Queue for files awaiting upload
*/
CCrypto.prototype.checkQueue = function ()
{
	var aNode = null;
	if (this.oChunkQueue.aFiles.length > 0)
	{
		aNode = this.oChunkQueue.aFiles.shift();
		aNode.fStartUploadCallback.apply(aNode.fStartUploadCallback, [aNode.oFileInfo, aNode.sUid, aNode.fOnChunkEncryptCallback]);
	}
};
/**
* Stop file uploading
* 
* @param {String} sUid
* @param {Function} fOnUploadCancelCallback
*/
CCrypto.prototype.stopUploading = function (sUid, fOnUploadCancelCallback, sFileName)
{
	var bFileInQueue = false;
	 // If file await to be uploaded - delete it from queue
	this.oChunkQueue.aFiles.forEach(function (oData, index, array) {
		if (oData.sUid === sUid)
		{
			fOnUploadCancelCallback(sUid, oData.oFileInfo.FileName);
			array.splice(index, 1);
			bFileInQueue = true;
		}
	});

	if (!bFileInQueue)
	{
		this.aStopList.push(sUid);
		this.oChunkQueue.isProcessed = false;
		fOnUploadCancelCallback(sUid, sFileName);
//		this.checkQueue();
	}
};

CCrypto.prototype.viewEncryptedImage = function (oFile, iv)
{
	if (!this.isKeyInStorage())
	{
		Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/INFO_EMPTY_JSCRYPTO_KEY'));
	}
	else
	{
		new CViewImage(oFile, iv, this.iChunkSize);
	}
};

CCrypto.prototype.isKeyInStorage = function ()
{
	return !!JscryptoKey.loadKeyFromStorage();
};

function CDownloadFile(oFile, iv, iChunkSize, fProcessBlobCallback)
{
	this.oFile = oFile;
	this.sFileName = oFile.fileName();
	this.iFileSize = oFile.size();
	this.sDownloadLink = oFile.getActionUrl('download');
	this.oWriter = new CWriter(this.sFileName, fProcessBlobCallback);
	this.iCurrChunk = 0;
	this.iv = new Uint8Array(HexUtils.HexString2Array(iv));
	this.key = null;
	this.iChunkNumber = Math.ceil(this.iFileSize/iChunkSize);
	this.iChunkSize = iChunkSize;
	JscryptoKey.getKey(_.bind(function(oKey) {
			this.key = oKey;
			this.decryptChunk();
		}, this),
		_.bind(function() {
			this.stopDownloading();
		}, this)
	);
}

CDownloadFile.prototype.writeChunk = function (oDecryptedUint8Array)
{
	if (this.oFile.downloading() !== true)
	{ // if download was canceled
		return;
	}
	else
	{
		this.oWriter.write(oDecryptedUint8Array); //write decrypted chunk
		if (this.iCurrChunk < this.iChunkNumber)
		{ //if it was not last chunk - decrypting another chunk
			this.decryptChunk();
		}
		else
		{
			this.stopDownloading();
			this.oWriter.close();
		}
	}
};

CDownloadFile.prototype.decryptChunk = function ()
{
	var oReq = new XMLHttpRequest();
	oReq.open("GET", this.getChunkLink(), true);

	oReq.responseType = 'arraybuffer';

	oReq.onprogress = _.bind(function(oEvent) {
		if (this.isDownloading())
		{
			this.oFile.onDownloadProgress(oEvent.loaded + (this.iCurrChunk-1) * this.iChunkSize, this.iFileSize);
		}
		else
		{
			oReq.abort();
		}
	}, this);
	oReq.onload =_.bind(function (oEvent)
	{
		var
			oArrayBuffer = oReq.response,
			oDataWithPadding = {}
		;
		if (oReq.status === 200 && oArrayBuffer)
		{
			oDataWithPadding = new Uint8Array(oArrayBuffer.byteLength + 16);
			oDataWithPadding.set( new Uint8Array(oArrayBuffer), 0);
			if (this.iCurrChunk !== this.iChunkNumber)
			{// for all chunk except last - add padding
				crypto.subtle.encrypt(
					{
						name: 'AES-CBC',
						iv: new Uint8Array(oArrayBuffer.slice(oArrayBuffer.byteLength - 16))
					},
					this.key,
					(new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16])).buffer // generate padding for chunk
				).then(_.bind(function(oEncryptedContent) {
						// add generated padding to data
						// oEncryptedContent.slice(0, 16) - use only first 16 bytes of generated padding, other data is padding for our padding
						oDataWithPadding.set(new Uint8Array(new Uint8Array(oEncryptedContent.slice(0, 16))), oArrayBuffer.byteLength);
						// decrypt data
						crypto.subtle.decrypt({ name: 'AES-CBC', iv: this.iv }, this.key, oDataWithPadding.buffer)
							.then(_.bind(function (oDecryptedArrayBuffer) {
								var oDecryptedUint8Array = new Uint8Array(oDecryptedArrayBuffer);
								// use last 16 byte of current chunk as initial vector for next chunk
								this.iv = new Uint8Array(oArrayBuffer.slice(oArrayBuffer.byteLength - 16));
								this.writeChunk(oDecryptedUint8Array);
							}, this))
							.catch(_.bind(function(err) {
								this.stopDownloading();
								Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_DECRYPTION'));
							}, this));
					}, this)
				);
			}
			else
			{ //for last chunk just decrypt data
				crypto.subtle.decrypt({ name: 'AES-CBC', iv: this.iv }, this.key, oArrayBuffer)
					.then(_.bind(function (oDecryptedArrayBuffer) {
						var oDecryptedUint8Array = new Uint8Array(oDecryptedArrayBuffer);
						// use last 16 byte of current chunk as initial vector for next chunk
						this.iv = new Uint8Array(oArrayBuffer.slice(oArrayBuffer.byteLength - 16));
						this.writeChunk(oDecryptedUint8Array);
					}, this))
					.catch(_.bind(function(err) {
						this.stopDownloading();
						Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_DECRYPTION'));
					}, this))
					;
			}
		}
	}, this);
	oReq.send(null);
};

CDownloadFile.prototype.stopDownloading = function ()
{
	this.oFile.stopDownloading();
};

/**
 * Generate link for downloading current chunk
 */
CDownloadFile.prototype.getChunkLink = function ()
{
	return this.sDownloadLink + '/download/' + this.iCurrChunk++ + '/' + this.iChunkSize;
};

CDownloadFile.prototype.isDownloading = function ()
{
	return this.oFile.downloading();
};

function CViewImage(oFile, iv, iChunkSize)
{
	this.oFile = oFile;
	this.sFileName = oFile.fileName();
	this.iFileSize = oFile.size();
	this.sDownloadLink = oFile.getActionUrl('download');
	this.oWriter = null;
	this.iCurrChunk = 0;
	this.iv = new Uint8Array(HexUtils.HexString2Array(iv));
	this.key = null;
	this.iChunkNumber = Math.ceil(this.iFileSize/iChunkSize);
	this.iChunkSize = iChunkSize;
	JscryptoKey.getKey(_.bind(function(oKey) {
		this.key = oKey;
		this.decryptChunk();
	}, this));
}
CViewImage.prototype = Object.create(CDownloadFile.prototype);
CViewImage.prototype.constructor = CViewImage;

CViewImage.prototype.writeChunk = function (oDecryptedUint8Array)
{
		this.oWriter = this.oWriter === null ? new CBlobViewer(this.sFileName) : this.oWriter;
		this.oWriter.write(oDecryptedUint8Array); //write decrypted chunk
		if (this.iCurrChunk < this.iChunkNumber)
		{ //if it was not last chunk - decrypting another chunk
			this.decryptChunk();
		}
		else
		{
			this.stopDownloading();
			this.oWriter.close();
		}
};

CDownloadFile.prototype.isDownloading = function ()
{//image download can't be aborted
	return true;
};
/**
* Writing chunks in file
* 
* @constructor
* @param {String} sFileName
* @param {Function} fProcessBlobCallback
*/
function CWriter(sFileName, fProcessBlobCallback)
{
	this.sName = sFileName;
	this.aBuffer = [];
	if (_.isFunction(fProcessBlobCallback))
	{
		this.fProcessBlobCallback = fProcessBlobCallback;
	}
}
CWriter.prototype.write = function (oDecryptedUint8Array)
{
	this.aBuffer.push(oDecryptedUint8Array);
};
CWriter.prototype.close = function ()
{
	let file = new Blob(this.aBuffer);

	if (typeof this.fProcessBlobCallback !== 'undefined')
	{
		this.fProcessBlobCallback(file);
	}
	else
	{
		FileSaver.saveAs(file, this.sName);
	}
	file = null;
};

/**
* Writing chunks in blob for viewing
* 
* @constructor
* @param {String} sFileName
*/
function CBlobViewer(sFileName) {
	this.sName = sFileName;
	this.aBuffer = [];
	this.imgWindow = window.open("", "_blank", "height=auto, width=auto,toolbar=no,scrollbars=no,resizable=yes");
}

CBlobViewer.prototype = Object.create(CWriter.prototype);
CBlobViewer.prototype.constructor = CBlobViewer;
CBlobViewer.prototype.close = function ()
{
	try
	{
		var
			file = new Blob(this.aBuffer),
			link = window.URL.createObjectURL(file),
			img = null
		;
		this.imgWindow.document.write("<head><title>" + this.sName + '</title></head><body><img src="' + link + '" /></body>');

		img = $(this.imgWindow.document.body).find('img');
		img.on('load', function () {
			//remove blob after showing image
			window.URL.revokeObjectURL(link);
		});
	}
	catch (err)
	{
		Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_POPUP_WINDOWS'));
	}
};

module.exports = new  CCrypto();

/***/ }),

/***/ "c2EW":
/*!*******************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ConfirmEncryptionPopup.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF")
;

/**
 * @constructor
 */
function CConfirmEncryptionPopup()
{
	CAbstractPopup.call(this);
	
	this.fEncrypt = null;
	this.fUpload = null;
	this.fCancel = null;
	this.message = ko.observable('');
	this.filesConfirmText = ko.observable('');
}

_.extendOwn(CConfirmEncryptionPopup.prototype, CAbstractPopup.prototype);

CConfirmEncryptionPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_ConfirmEncryptionPopup';

CConfirmEncryptionPopup.prototype.onOpen = function (fEncrypt, fUpload, fCancel, iFilesCount, aFileList)
{
	var aEncodedFiles = _.map(aFileList, function (sFileName) {
		return TextUtils.encodeHtml(sFileName);
	});
	
	this.filesConfirmText('');
	this.fEncrypt = fEncrypt;
	this.fUpload = fUpload;
	this.fCancel = fCancel;
	this.message(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/CONFIRM_ENCRYPT_PLURAL', {'VALUE': iFilesCount > 1 ? iFilesCount : '"' + aFileList[0] + '"'}, null, iFilesCount));
	if (iFilesCount > 1)
	{
		this.filesConfirmText(aEncodedFiles.join('<br />'));
	}
};

CConfirmEncryptionPopup.prototype.cancelUpload = function ()
{
	this.fCancel();
	this.closePopup();
};

CConfirmEncryptionPopup.prototype.encrypt = function ()
{
	this.fEncrypt();
	this.closePopup();
};

CConfirmEncryptionPopup.prototype.upload = function ()
{
	this.fUpload();
	this.closePopup();
};

module.exports = new CConfirmEncryptionPopup();


/***/ }),

/***/ "hYvh":
/*!*******************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/enums.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	Enums = {}
;

/**
 * @enum {number}
 */
Enums.EncryptionMode = {
	Always: 0,
	AskMe: 1,
	Never: 2,
	AlwaysInEncryptedFolder: 3
};

if (typeof window.Enums === 'undefined')
{
	window.Enums = {};
}

_.extendOwn(window.Enums, Enums);


/***/ }),

/***/ "mHl/":
/*!******************************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/views/ParanoidEncryptionSettingsFormView.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV"),
	ModulesManager = __webpack_require__(/*! modules/CoreWebclient/js/ModulesManager.js */ "OgeD"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	JscryptoKey = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js */ "zDR0"),
	Settings = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/Settings.js */ "I5pT"),
	ImportKeyStringPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ImportKeyStringPopup.js */ "Npm9"),
	GenerateKeyPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/GenerateKeyPopup.js */ "2kfa"),
	ExportInformationPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ExportInformationPopup.js */ "t19A"),
	DeleteKeyPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/DeleteKeyPopup.js */ "nTW+"),
	HexUtils = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/utils/Hex.js */ "wjWM")
;

/**
 * @constructor
 */
function CParanoidEncryptionSettingsFormView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);

	this.enableJscrypto = ko.observable(Settings.EnableJscrypto());
	this.keyName = ko.observable('');
	this.bIsHttpsEnable = window.location.protocol === "https:";
	this.encryptionMode = ko.observable(Settings.EncryptionMode());
	this.allowChangeSettings = ko.observable(Settings.AllowChangeSettings);
	this.isImporting = ko.observable(false);
	this.exportKeyBound = _.bind(this.exportKey, this);

	if (ko.isObservable(JscryptoKey.keyName))
	{
		JscryptoKey.keyName.subscribe(function () {
			this.keyName(JscryptoKey.keyName());
		}, this);
	}
}

_.extendOwn(CParanoidEncryptionSettingsFormView.prototype, CAbstractSettingsFormView.prototype);

CParanoidEncryptionSettingsFormView.prototype.ViewTemplate = 'CoreParanoidEncryptionWebclientPlugin_ParanoidEncryptionSettingsFormView';

CParanoidEncryptionSettingsFormView.prototype.importFileKey = function ()
{
	$("#import-key-file").click();
};

CParanoidEncryptionSettingsFormView.prototype.importStringKey = function ()
{
	Popups.showPopup(ImportKeyStringPopup);
};

CParanoidEncryptionSettingsFormView.prototype.readKeyFromFile = function ()
{
	var 
		input = document.getElementById('import-key-file'),
		file = input.files[0],
		reader = new FileReader(),
		sContents = '',
		aFileNameParts = input.files[0].name.split('.'),
		sKeyName = '',
		fOnGenerateCallback = _.bind(function() {
			this.isImporting(false);
		}, this),
		fOnErrorCallback = _.bind(function() {
			this.isImporting(false);
		}, this)
	;
	aFileNameParts.splice(aFileNameParts.length - 1, 1);
	sKeyName = aFileNameParts.join('');
	if (!file)
	{
		Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_IMPORT_KEY'));
		return;
	}
	this.isImporting(true);
	reader.onload = function(e) {
		sContents = e.target.result;
		JscryptoKey.importKeyFromString(sKeyName, sContents, fOnGenerateCallback, fOnErrorCallback);
	};

	try
	{
		reader.readAsText(file);
	}
	catch (e)
	{
		Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_IMPORT_KEY'));
	}
};

CParanoidEncryptionSettingsFormView.prototype.generateNewKey = function ()
{
	Popups.showPopup(GenerateKeyPopup, [_.bind(function () {
		//After generating new key show "export key" dialog
		Popups.showPopup(ExportInformationPopup, [this.exportKeyBound, this.keyName()]);
	}, this)]);
};

CParanoidEncryptionSettingsFormView.prototype.removeJscryptoKey = function ()
{
	var
		fRemove = _.bind(function (bRemove) {
			if (bRemove)
			{
				var oResult = JscryptoKey.deleteKey();
				if (oResult.error)
				{
					Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_DELETE_KEY'));
				}
			}
		}, this)
	;

	Popups.showPopup(DeleteKeyPopup, [this.exportKeyBound, this.keyName(), fRemove]);
};

CParanoidEncryptionSettingsFormView.prototype.getCurrentValues = function ()
{
	return [
		this.enableJscrypto(),
		this.encryptionMode()
	];
};

CParanoidEncryptionSettingsFormView.prototype.revertGlobalValues = function ()
{
	this.enableJscrypto(Settings.EnableJscrypto());
	this.encryptionMode(Settings.EncryptionMode());
};

CParanoidEncryptionSettingsFormView.prototype.getParametersForSave = function ()
{
	return {
		'EnableModule': this.enableJscrypto(),
		'EncryptionMode': Types.pInt(this.encryptionMode())
	};
};

CParanoidEncryptionSettingsFormView.prototype.applySavedValues = function ()
{
	Settings.update(this.enableJscrypto(), this.encryptionMode());
};

CParanoidEncryptionSettingsFormView.prototype.onShow = function ()
{
	JscryptoKey.loadKeyNameFromStorage();
};

CParanoidEncryptionSettingsFormView.prototype.exportKey= function ()
{
	var
		oBlob = null,
		downloadLinkHref = null,
		oDownloadLink = document.createElement("a")
	;

	JscryptoKey.getKey(
		/*fOnGenerateKeyCallback*/_.bind(function(oKey) {
			if (oKey)
			{
				JscryptoKey.exportKey()
					.then(_.bind(function(keydata) {
						oBlob = new Blob([HexUtils.Array2HexString(new Uint8Array(keydata))], {type: 'text/plain'});
						downloadLinkHref = window.URL.createObjectURL(oBlob);
						document.body.appendChild(oDownloadLink);
						oDownloadLink.style = "display: none";
						oDownloadLink.href = downloadLinkHref;
						oDownloadLink.download = this.keyName();
						oDownloadLink.click();
						window.URL.revokeObjectURL(downloadLinkHref);
					}, this))
					.catch(function() {
						Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));
					});
			}
			else
			{
				Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));
			}
		}, this),
		/*fOnErrorCallback*/		false,
		/*sPassword*/			false,
		/*bForcedKeyLoading*/	true
	);
};

module.exports = new CParanoidEncryptionSettingsFormView();


/***/ }),

/***/ "mtgd":
/*!********************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/EncryptKeyPasswordPopup.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT")
;

/**
 * @constructor
 */
function CEncryptKeyPasswordPopup()
{
	CAbstractPopup.call(this);

	this.keyPassword = ko.observable('');
	this.keyPasswordConfirm = ko.observable('');
	this.fOnPasswordEnterCallback = null;
	this.fOnWrongPasswordCallback = null;
	this.fOnCancellCallback = null;
}

_.extendOwn(CEncryptKeyPasswordPopup.prototype, CAbstractPopup.prototype);

CEncryptKeyPasswordPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_EncryptKeyPasswordPopup';

CEncryptKeyPasswordPopup.prototype.onOpen = function (fOnPasswordEnterCallback, fOnCancellCallback)
{
	this.fOnPasswordEnterCallback = fOnPasswordEnterCallback;
	this.fOnCancellCallback = fOnCancellCallback;
};

CEncryptKeyPasswordPopup.prototype.encryptKey = function ()
{
	if ($.trim(this.keyPassword()) === '')
	{
		this.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_PASSWORD_CANT_BE_BLANK'));
	}
	else if ($.trim(this.keyPassword()) !== $.trim(this.keyPasswordConfirm()))
	{
		this.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORDS_DO_NOT_MATCH'));
	}
	else
	{
		if (_.isFunction(this.fOnPasswordEnterCallback))
		{
			this.fOnPasswordEnterCallback($.trim(this.keyPassword()));
		}
		this.closePopup();
	}
};

CEncryptKeyPasswordPopup.prototype.cancelPopup = function ()
{
	if (_.isFunction(this.fOnCancellCallback))
	{
		this.fOnCancellCallback();
	}
	this.closePopup();
};

CEncryptKeyPasswordPopup.prototype.onShow = function ()
{
	this.keyPassword('');
	this.keyPasswordConfirm('');
};

CEncryptKeyPasswordPopup.prototype.showError = function (sMessage)
{
	Screens.showError(sMessage);
};

module.exports = new CEncryptKeyPasswordPopup();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ "EVdn")))

/***/ }),

/***/ "nTW+":
/*!***********************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/DeleteKeyPopup.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF"),
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	ConfirmPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/ConfirmPopup.js */ "20Ah")
;

/**
 * @constructor
 */
function CDeleteKeyPopup()
{
	CAbstractPopup.call(this);
	
	this.fExportKeyCallback = null;
	this.keyName = ko.observable('');
	this.fDelete = null;
	this.fDeleteCallback = null;
}

_.extendOwn(CDeleteKeyPopup.prototype, CAbstractPopup.prototype);

CDeleteKeyPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_DeleteKeyPopup';

CDeleteKeyPopup.prototype.onOpen = function (fExportKeyCallback, sKeyName, fDelete)
{
	if (_.isFunction(fExportKeyCallback))
	{
		this.fExportKeyCallback = _.bind(function() {
			this.closePopup();
			fExportKeyCallback();
		}, this);
	}
	this.keyName(sKeyName);
	this.fDeleteCallback = _.bind(function (bRemove) {
		fDelete.call(this, bRemove);
		
		if (bRemove)
		{
			this.closePopup();
		}
		else
		{
			this.showPopup();
		}
	}, this);
};

CDeleteKeyPopup.prototype.deleteKey = function ()
{
	this.hidePopup();
	Popups.showPopup(ConfirmPopup, [TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/CONFIRM_DELETE_KEY'), this.fDeleteCallback]);
};

module.exports = new CDeleteKeyPopup();


/***/ }),

/***/ "oBzO":
/*!*********************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/manager.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/enums.js */ "hYvh");

var
	_ = __webpack_require__(/*! underscore */ "F/us"),

	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
	Crypto = null,
	Settings = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/Settings.js */ "I5pT"),
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	ConfirmEncryptionPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ConfirmEncryptionPopup.js */ "c2EW"),
	ConfirmUploadPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ConfirmUploadPopup.js */ "2d9n"),
	Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "HLSX"),
	AwaitConfirmationQueue = [],	//List of files waiting for the user to decide on encryption
	isConfirmPopupShown = false,
	oButtonsView = null
;

function IsHttpsEnable()
{
	return window.location.protocol === "https:";
}

function ShowUploadPopup(sUid, oFileInfo, fUpload, fCancel, sErrorText)
{
	if (isConfirmPopupShown)
	{
		AwaitConfirmationQueue.push({
			sUid: sUid,
			oFileInfo: oFileInfo
		});
	}
	else
	{
		setTimeout(function () {
			Popups.showPopup(ConfirmUploadPopup, [
				fUpload,
				fCancel,
				AwaitConfirmationQueue.length,
				_.map(AwaitConfirmationQueue, function(element) {
					return element.oFileInfo.FileName; 
				}),
				sErrorText
			]);
		}, 10);
		isConfirmPopupShown = true;
		AwaitConfirmationQueue.push({
			sUid: sUid,
			oFileInfo: oFileInfo
		});
	}
}

function StartModule (ModulesManager)
{
	ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
		function () { return __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/views/ParanoidEncryptionSettingsFormView.js */ "mHl/"); },
		Settings.HashModuleName,
		TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/LABEL_SETTINGS_TAB')
	]);

	App.subscribeEvent('AbstractFileModel::FileDownload::before', function (oParams) {
		var
			oFile = oParams.File,
			iv = 'oExtendedProps' in oFile ? ('InitializationVector' in oFile.oExtendedProps ? oFile.oExtendedProps.InitializationVector : false) : false
		;
		//User can decrypt only own files
		if (!Settings.EnableJscrypto() || !iv || oFile.sOwnerName !== App.getUserPublicId())
		{
			//regular upload will start in Jua in this case
		}
		else if (!IsHttpsEnable())
		{
			Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_HTTPS_NEEDED'));
			oParams.CancelDownload = true;
		}
		else if (!Crypto.isKeyInStorage())
		{
			Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/INFO_EMPTY_JSCRYPTO_KEY'));
			oParams.CancelDownload = true;
		}
		else
		{
			oParams.CustomDownloadHandler = function () {
				oFile.startDownloading();
				Crypto.downloadDividedFile(oFile, iv);
			};
		}
	});

	App.subscribeEvent('OpenPgpFilesWebclient::DownloadSecureFile', function (oParams) {
		var
			oFile = oParams.File,
			iv = 'oExtendedProps' in oFile ? ('InitializationVector' in oFile.oExtendedProps ? oFile.oExtendedProps.InitializationVector : false) : false,
			fProcessBlobCallback = oParams.fProcessBlobCallback
		;

		//User can decrypt only own files
		if (!Settings.EnableJscrypto() || !iv || oFile.sOwnerName !== App.getUserPublicId())
		{
			Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_СANT_DECRYPT_FILE'));
		}
		else if (!IsHttpsEnable())
		{
			Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_HTTPS_NEEDED'));
			oParams.CancelDownload = true;
		}
		else if (!Crypto.isKeyInStorage())
		{
			Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/INFO_EMPTY_JSCRYPTO_KEY'));
			oParams.CancelDownload = true;
		}
		else
		{
			oFile.startDownloading();
			Crypto.downloadDividedFile(oFile, iv, fProcessBlobCallback);
		}
	});

	App.subscribeEvent('Jua::FileUpload::before', function (oParams) {
		var
			sUid = oParams.sUid,
			sModuleName = oParams.sModuleName,
			oFileInfo = oParams.oFileInfo,
			fOnChunkEncryptCallback = oParams.fOnChunkReadyCallback,
			fRegularUploadFileCallback = oParams.fRegularUploadFileCallback,
			fCancelFunction = oParams.fCancelFunction,
			fStartUploadCallback = function (oFileInfo, sUid, fOnChunkEncryptCallback) {
				if (!Settings.AllowMultiChunkUpload && oFileInfo.File.size > Crypto.iChunkSize)
				{
					Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_FILE_SIZE_LIMIT', {'VALUE': Settings.ChunkSizeMb}));
					fCancelFunction(sUid);
					Crypto.oChunkQueue.isProcessed = false;
					Crypto.checkQueue();
				}
				else
				{
					// Starts upload an encrypted file
					Crypto.startUpload(
						oFileInfo,
						sUid,
						fOnChunkEncryptCallback,
						_.bind(function () {
							fCancelFunction(sUid);
							Crypto.oChunkQueue.isProcessed = false;
							Crypto.checkQueue();
						}, this)
					);
				}
			},
			fUpload = _.bind(function () {
				AwaitConfirmationQueue.forEach(function (element) {
					fRegularUploadFileCallback(element.sUid, element.oFileInfo);
				});
				AwaitConfirmationQueue = [];
				isConfirmPopupShown = false;
			}, this),
			fEncrypt = _.bind(function () {
				AwaitConfirmationQueue.forEach(function (element) {
					// if another file is being uploaded now - add a file to the queue
					Crypto.oChunkQueue.aFiles.push({
						fStartUploadCallback: fStartUploadCallback,
						oFileInfo: element.oFileInfo,
						sUid: element.sUid,
						fOnChunkEncryptCallback: fOnChunkEncryptCallback
					});
				});
				AwaitConfirmationQueue = [];
				isConfirmPopupShown = false;
				if (!Crypto.oChunkQueue.isProcessed)
				{
					Crypto.oChunkQueue.isProcessed = true;
					Crypto.checkQueue();
				}
			}),
			fCancel = _.bind(function () {
				AwaitConfirmationQueue.forEach(function (element) {
					fCancelFunction(element.sUid);
				});
				AwaitConfirmationQueue = [];
				isConfirmPopupShown = false;
			})
		;

		if (!Settings.EnableJscrypto()
			|| (
				Settings.EncryptionAllowedModules &&
				Settings.EncryptionAllowedModules.length > 0 &&
				!Settings.EncryptionAllowedModules.includes(sModuleName)
			)
			|| (!Settings.EncryptionAllowedStorages.includes(oParams.sStorageType) && oParams.sStorageType !== 'encrypted')
			|| Settings.EncryptionMode() === Enums.EncryptionMode.Never 
			|| (Settings.EncryptionMode() === Enums.EncryptionMode.AlwaysInEncryptedFolder && oParams.sStorageType !== 'encrypted')
		)
		{
			fRegularUploadFileCallback(sUid, oFileInfo);
		}
		else if (!IsHttpsEnable())
		{
			if (Settings.EncryptionMode() === Enums.EncryptionMode.Always || Settings.EncryptionMode() === Enums.EncryptionMode.AlwaysInEncryptedFolder)
			{
				//for Always encryption mode show error
				Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_HTTPS_NEEDED'));
				fCancelFunction(sUid);
			}
			else if (Settings.EncryptionMode() === Enums.EncryptionMode.AskMe)
			{
				//for AskMe encryption mode show dialog with warning and regular upload button
				ShowUploadPopup(sUid, oFileInfo, fUpload, fCancel, TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_HTTPS_NEEDED'));
			}
		}
		else if (!Crypto.isKeyInStorage())
		{
			if (Settings.EncryptionMode() === Enums.EncryptionMode.Always || Settings.EncryptionMode() === Enums.EncryptionMode.AlwaysInEncryptedFolder)
			{
				//for Always encryption mode show error
				Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/INFO_EMPTY_JSCRYPTO_KEY'));
				fCancelFunction(sUid);
			}
			else if (Settings.EncryptionMode() === Enums.EncryptionMode.AskMe)
			{
				//for AskMe encryption mode show dialog with warning and regular upload button
				ShowUploadPopup(sUid, oFileInfo, fUpload, fCancel, TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/INFO_EMPTY_JSCRYPTO_KEY'));
			}
		}
		else
		{
			if (Settings.EncryptionMode() === Enums.EncryptionMode.AskMe)
			{
				if (isConfirmPopupShown)
				{
					AwaitConfirmationQueue.push({
						sUid: sUid,
						oFileInfo: oFileInfo
					});
				}
				else
				{
					setTimeout(function () {
						Popups.showPopup(ConfirmEncryptionPopup, [
							fEncrypt,
							fUpload,
							fCancel,
							AwaitConfirmationQueue.length,
							_.map(AwaitConfirmationQueue, function(element) {
								return element.oFileInfo.FileName; 
							})
						]);
					}, 10);
					isConfirmPopupShown = true;
					AwaitConfirmationQueue.push({
						sUid: sUid,
						oFileInfo: oFileInfo
					});
				}
			}
			else
			{
				if (Crypto.oChunkQueue.isProcessed === true)
				{ // if another file is being uploaded now - add a file to the queue
					Crypto.oChunkQueue.aFiles.push({
						fStartUploadCallback: fStartUploadCallback,
						oFileInfo: oFileInfo, 
						sUid: sUid, 
						fOnChunkEncryptCallback: fOnChunkEncryptCallback
					});
				}
				else
				{ // If the queue is not busy - start uploading
					fStartUploadCallback(oFileInfo, sUid, fOnChunkEncryptCallback);
				}
			}
		}
	});

	App.subscribeEvent('CFilesView::FileDownloadCancel', function (oParams) {
		if (Settings.EnableJscrypto() && IsHttpsEnable())
		{
			oParams.oFile.stopDownloading();
		}
	});

	App.subscribeEvent('CFilesView::FileUploadCancel', function (oParams) {
		if (Settings.EnableJscrypto() && IsHttpsEnable())
		{
			//clear queue
			Crypto.oChunkQueue.aFiles.forEach(function (oData, index, array) {
					oParams.fOnUploadCancelCallback(oData.sUid, oData.oFileInfo.FileName);
			});
			Crypto.oChunkQueue.aFiles = [];

			Crypto.stopUploading(oParams.sFileUploadUid , oParams.fOnUploadCancelCallback, oParams.sFileUploadName);
		}
		else if (_.isFunction(oParams.fOnUploadCancelCallback))
		{
			oParams.fOnUploadCancelCallback(oParams.sFileUploadUid, oParams.sFileUploadName);
		}
	});
	App.subscribeEvent('Jua::FileUploadingError', function () {
		if (Settings.EnableJscrypto() && IsHttpsEnable())
		{
			Crypto.oChunkQueue.isProcessed = false;
			Crypto.checkQueue();
		}
	});
	App.subscribeEvent('FilesWebclient::ParseFile::after', function (aParams) {

		var
			oFile = aParams[0],
			bIsEncrypted = typeof(oFile.oExtendedProps) !== 'undefined' &&  typeof(oFile.oExtendedProps.InitializationVector) !== 'undefined',
			iv = bIsEncrypted ? oFile.oExtendedProps.InitializationVector : false
		;

		if (bIsEncrypted)
		{
			oFile.thumbnailSrc('');
			if (oFile.sOwnerName === App.getUserPublicId() && (/\.(png|jpe?g|gif)$/).test(oFile.fileName()) && Settings.EnableJscrypto())
			{// change view action for images
				oFile.oActionsData.view.Handler = _.bind(function () {
					Crypto.viewEncryptedImage(this.oFile, this.iv);
				}, {oFile: oFile, iv: iv});
			}
			else
			{// remove view action for non-images
				oFile.removeAction('view');
			}
			oFile.removeAction('list');
			oFile.bIsSecure(true);
		}
	});
	App.subscribeEvent('FileViewerWebclientPlugin::FilesCollection::after', function (oParams) {
		oParams.aFilesCollection(_.filter(oParams.aFilesCollection(), function (oArg) {
			return !(typeof(oArg.oExtendedProps) !== 'undefined' &&  typeof(oArg.oExtendedProps.InitializationVector) !== 'undefined');
		}));
	});
}

function getButtonView()
{
	if (!oButtonsView)
	{
		oButtonsView = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/views/ButtonsView.js */ "uPeM");
	}

	return oButtonsView;
}

module.exports = function (oAppData) {
	Settings.init(oAppData);
	Crypto = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/CCrypto.js */ "QJDP");

	return {
		/**
		 * Runs before application start. Subscribes to the event before post displaying.
		 * 
		 * @param {Object} ModulesManager
		 */
		start: function (ModulesManager) {
			ModulesManager.run('FilesWebclient', 'registerToolbarButtons', [getButtonView()]);

			var bBlobSavingEnable = window.Blob && window.URL && _.isFunction(window.URL.createObjectURL);
			// Module can't work without saving blob and shouldn't be initialized.
			if (bBlobSavingEnable)
			{
				if (Browser.chrome && !IsHttpsEnable())
				{
					// Module can't work without https.0
					// Module should be initialized to display message about https enabling.
					StartModule(ModulesManager);
				}
				else if (window.crypto && window.crypto.subtle)
				{
					var sPassword = window.crypto.getRandomValues(new Uint8Array(16));
					// window.crypto can't work with PBKDF2 in Edge.
					// Checks if it works (in case if it will work in Edge one day) and then inizializes module.
					window.crypto.subtle.importKey('raw', sPassword, {name: 'PBKDF2'}, false, ['deriveBits', 'deriveKey'])
						.then(function () {
							StartModule(ModulesManager);
						});
				}
			}
		}
	};
};


/***/ }),

/***/ "t19A":
/*!*******************************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/popups/ExportInformationPopup.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	CAbstractPopup = __webpack_require__(/*! modules/CoreWebclient/js/popups/CAbstractPopup.js */ "czxF")
;

/**
 * @constructor
 */
function CExportInformationPopup()
{
	CAbstractPopup.call(this);
	
	this.fExportKeyCallback = null;
	this.keyName = ko.observable('');
}

_.extendOwn(CExportInformationPopup.prototype, CAbstractPopup.prototype);

CExportInformationPopup.prototype.PopupTemplate = 'CoreParanoidEncryptionWebclientPlugin_ExportInformationPopup';

CExportInformationPopup.prototype.onOpen = function (fExportKeyCallback, sKeyName)
{
	if (_.isFunction(fExportKeyCallback))
	{
		this.fExportKeyCallback = _.bind(function() {
			this.closePopup();
			fExportKeyCallback();
		}, this);
	}
	this.keyName(sKeyName);
};

module.exports = new CExportInformationPopup();


/***/ }),

/***/ "uN/E":
/*!*******************************************************!*\
  !*** ./modules/CoreWebclient/js/vendors/FileSaver.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if ( true && module.exports) {
  module.exports.saveAs = saveAs;
} else if (( true && __webpack_require__(/*! !webpack amd define */ "B9Yq") !== null) && (__webpack_require__(/*! !webpack amd options */ "PDX0") !== null)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    return saveAs;
  }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),

/***/ "uPeM":
/*!*******************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/views/ButtonsView.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd")
;

/**
 * @constructor
 */
function ButtonsView()
{
	this.storageType = null;
}

ButtonsView.prototype.useFilesViewData = function (oFilesView)
{
	this.storageType = oFilesView.storageType;
	oFilesView.pathItems.subscribe(function () {
		if (this.isEncryptedStorage())
		{
			oFilesView.disableButton(oFilesView.shortcutButtonModules, 'CoreParanoidEncryptionWebclientPlugin');
		}
		else
		{
			oFilesView.enableButton(oFilesView.shortcutButtonModules, 'CoreParanoidEncryptionWebclientPlugin');
		}
	}, this);
};

ButtonsView.prototype.isEncryptedStorage = function ()
{
	return this.storageType() === 'encrypted';
};

module.exports = new ButtonsView();


/***/ }),

/***/ "wjWM":
/*!***********************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/utils/Hex.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	HexUtils = {}
;

HexUtils.Array2HexString = function (aInput)
{
	var sHexAB = '';
	_.each(aInput, function(element) {
		var sHex = element.toString(16);
		sHexAB += ((sHex.length === 1) ? '0' : '') + sHex;
	})
	return sHexAB;
};

HexUtils.HexString2Array = function (sHex)
{
	var aResult = [];
	if (sHex.length === 0 || sHex.length % 2 !== 0)
	{
		return aResult;
	}
	for (var i = 0; i < sHex.length; i+=2)
	{
		aResult.push(parseInt(sHex.substr(i, 2), 16));
	}
	return aResult;
};

module.exports = HexUtils;

/***/ }),

/***/ "zDR0":
/*!*************************************************************************!*\
  !*** ./modules/CoreParanoidEncryptionWebclientPlugin/js/JscryptoKey.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),

	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	Storage = __webpack_require__(/*! modules/CoreWebclient/js/Storage.js */ "gcBV"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
	UserSettings = __webpack_require__(/*! modules/CoreWebclient/js/Settings.js */ "hPb3"),
	HexUtils = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/utils/Hex.js */ "wjWM"),
	Popups = __webpack_require__(/*! modules/CoreWebclient/js/Popups.js */ "76Kh"),
	DecryptKeyPasswordPopup =  __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/DecryptKeyPasswordPopup.js */ "LU2F"),
	EncryptKeyPasswordPopup = __webpack_require__(/*! modules/CoreParanoidEncryptionWebclientPlugin/js/popups/EncryptKeyPasswordPopup.js */ "mtgd")
;

/**
 * @constructor
 */
function CJscryptoKey()
{
	this.sPrefix = 'user_' + (UserSettings.UserId || '0') + '_';
	this.key = ko.observable();
	this.keyName = ko.observable();
	this.storageName = 'cryptoKeyEncrypted';
}

CJscryptoKey.prototype.key = null;
CJscryptoKey.prototype.sPrefix = '';

/**
 * Asynchronously read key from storage, decrypt and generate key-object
 * 
 * @param {Function} fOnGenerateKeyCallback - starts after the key is successfully generated
 * @param {Function} fOnErrorCallback - starts if error occurred during key generation process
 * @param {string} sPassword - encrypt key with given password, "password dialog" wouldn't show
 * @param {boolean} bForcedKeyLoading - forced key loading and decryption
 */
CJscryptoKey.prototype.getKey = function (fOnGenerateKeyCallback, fOnErrorCallback, sPassword, bForcedKeyLoading)
{
	var
		sEncryptedKeyData = this.loadKeyFromStorage(),
		oPromise = new Promise(function (resolve, reject) {
			var fDecryptKeyCallback = _.bind(function(sPassword) {
				//Decrypt key with user password
				this.decryptKeyData(sEncryptedKeyData, sPassword)
					.then(_.bind(function(aKeyData) {
						//generate key object from encrypted data
						this.generateKeyFromArray(aKeyData)
							.then(function(oKey) {
								//return key object
								resolve(oKey);
							})
							.catch(function() {
								reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
							});
					}, this))
					.catch(function() {
						reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
					});
			}, this);
			if (!sEncryptedKeyData)
			{
				reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/INFO_EMPTY_JSCRYPTO_KEY')));
			}
			else
			{
				if (!this.key() || bForcedKeyLoading)
				{//if key not available or loading is forced - encrypt key data
					if (!sPassword)
					{//if password is unknown - request password
						Popups.showPopup(DecryptKeyPasswordPopup, [
							fDecryptKeyCallback,
							function() {
								if (_.isFunction(fOnErrorCallback))
								{
									fOnErrorCallback();
								}
							}
						]);
					}
					else
					{//if password is known - decrypt key with this password
						fDecryptKeyCallback(sPassword);
					}
				}
				else
				{//if key already available - return key
					resolve(this.key());
				}
			}
		}.bind(this))
	;

	this.loadKeyNameFromStorage();
	oPromise
		.then(_.bind(function(oKey) {
			this.onKeyGenerateSuccess(oKey);
			if (_.isFunction(fOnGenerateKeyCallback))
			{
				fOnGenerateKeyCallback(oKey);
			}
		}, this))
		.catch(_.bind(function(oError) {
			if (_.isFunction(fOnErrorCallback))
			{
				fOnErrorCallback();
			}
			this.onKeyGenerateError(oError);
		}, this));
};

/**
 * Read key name from local storage
 */
CJscryptoKey.prototype.loadKeyNameFromStorage = function ()
{
	if (Storage.hasData(this.getStorageName()))
	{
		this.keyName(Storage.getData(this.getStorageName()).keyname);
	}
};

/**
 *  read key data from local storage
 *  
 *  @returns {string}
 */
CJscryptoKey.prototype.loadKeyFromStorage = function ()
{
	var 
		sKey = ''
	;

	if (Storage.hasData(this.getStorageName()))
	{
		sKey = Storage.getData(this.getStorageName()).keydata;
	}
	return sKey;
};

/**
 * Asynchronously generate key object from array data
 * 
 * @param {ArrayBuffer} aKey
 * @returns {Promise}
 */
CJscryptoKey.prototype.generateKeyFromArray = function (aKey)
{
	var keyPromise = window.crypto.subtle.importKey(
		"raw",
		aKey,
		{
			name: "AES-CBC"
		},
		true,
		["encrypt", "decrypt"]
	);
	return keyPromise;
};

/**
 * Write key-object to knockout variable
 * 
 * @param {Object} oKey
 */
CJscryptoKey.prototype.onKeyGenerateSuccess = function (oKey)
{
	this.key(oKey);
};

/**
 * Show error message
 * 
 * @param {Object} oError
 */
CJscryptoKey.prototype.onKeyGenerateError = function (oError)
{
	if (oError && oError.message)
	{
		Screens.showError(oError.message);
	}
};

/**
 * Asynchronously  generate new key
 * 
 * @param {Function} fOnGenerateCallback - starts after the key is successfully generated
 * @param {string} sKeyName
 */
CJscryptoKey.prototype.generateKey = function (fOnGenerateCallback, sKeyName)
{
	var
		sKeyData = ''
	;

	window.crypto.subtle.generateKey(
		{
			name: "AES-CBC",
			length: 256
		},
		true,
		["encrypt", "decrypt"]
	)
	.then(_.bind(function (key) {
		window.crypto.subtle.exportKey(
			"raw",
			key
		)
		.then(_.bind(function(aKeyData) {
			sKeyData = HexUtils.Array2HexString(new Uint8Array(aKeyData)); 
			Popups.showPopup(EncryptKeyPasswordPopup, [
				_.bind(function(sPassword) {//Encrypt generated Key with User password
					this.encryptKeyData(sKeyData, sPassword)
						.then(_.bind(function(sKeyDataEncrypted) {//Store encrypted key in local storage
							Storage.setData(
								this.getStorageName(),
								{
									keyname: sKeyName,
									keydata: sKeyDataEncrypted
								}
							);
							this.loadKeyNameFromStorage();
							this.onKeyGenerateSuccess(key);
							if (_.isFunction(fOnGenerateCallback))
							{
								fOnGenerateCallback();
							}
						}, this))
						.catch(function() {
							Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));
						});
				}, this),
				function() {}
			]);
		}, this))
		.catch(function() {
			Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_EXPORT_KEY'));
		});
	}, this))
	.catch(function() {
		Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_GENERATE_KEY'));
	});
};

/**
 * Asynchronously generate key-object from string key-data
 * 
 * @param {string} sKeyName
 * @param {string} sKeyData
 * @param {Function} fOnImportKeyCallback - starts after the key is successfully imported
 * @param {Function} fOnErrorCallback - starts if an error occurs during the key import process
 */
CJscryptoKey.prototype.importKeyFromString = function (sKeyName, sKeyData, fOnImportKeyCallback, fOnErrorCallback)
{
	try
	{
		Popups.showPopup(EncryptKeyPasswordPopup, [
			_.bind(function(sPassword) { // Encrypt imported Key with User password
				this.encryptKeyData(sKeyData, sPassword)
					.then(_.bind(function(sKeyDataEncrypted) { // Store encrypted key in local storage
						Storage.setData(
							this.getStorageName(),
							{
								keyname: sKeyName,
								keydata: sKeyDataEncrypted
							}
						);
						this.getKey(fOnImportKeyCallback, fOnErrorCallback, sPassword);
					}, this))
					.catch(function() {
						Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY'));
						if (_.isFunction(fOnErrorCallback))
						{
							fOnErrorCallback();
						}
					});
			}, this),
			function() {
				// Cancel callback
				if (_.isFunction(fOnErrorCallback))
				{
					fOnErrorCallback();
				}
			}
		]);
	}
	catch (e)
	{
		Screens.showError(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_IMPORT_KEY'));
		if (_.isFunction(fOnErrorCallback))
		{
			fOnErrorCallback();
		}
	}
};

/**
 * Asynchronously export key
 * 
 * @returns {Promise}
 */
CJscryptoKey.prototype.exportKey = function ()
{
	return window.crypto.subtle.exportKey(
		"raw",
		this.key()
	);
};

/**
 * Remove key-object and clear key-data in local storage
 * 
 * @returns {Object}
 */
CJscryptoKey.prototype.deleteKey = function ()
{
	try
	{
		this.key(null);
		this.keyName(null);
		Storage.removeData(this.getStorageName());
	}
	catch (e)
	{
		return {error: e};
	}

	return {status: 'ok'};
};

/**
 * Asynchronously decrypt key with user password
 * 
 * @param {string} sEncryptedKeyData
 * @param {string} sPassword
 * @returns {Promise}
 */
CJscryptoKey.prototype.decryptKeyData = function (sEncryptedKeyData, sPassword)
{
	var
		aVector = new Uint8Array(16) //defaults to zero
	;
	return new Promise(function (resolve, reject) {
		if (!sEncryptedKeyData)
		{
			reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
		}
		else
		{
			//get password-key
			this.deriveKeyFromPasswordPromise(sPassword,
				_.bind(function(oDerivedKey) {
					crypto.subtle.decrypt({ name: 'AES-CBC', iv: aVector }, oDerivedKey, new Uint8Array(HexUtils.HexString2Array(sEncryptedKeyData)))
						.then(_.bind(function(aDecryptedKeyData) {
							resolve(new Uint8Array(aDecryptedKeyData));
						}, this))
						.catch(function() {
							reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
						});
				}, this),
				function() {
					reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
				}
			);
		}
	}.bind(this));
};

/**
 * Asynchronously encrypt key with user password
 * 
 * @param {string} sUserKeyData
 * @param {string} sPassword
 * @returns {Promise}
 */
CJscryptoKey.prototype.encryptKeyData = function (sUserKeyData, sPassword)
{
	var
		aKeyData = null,
		sEncryptedKeyData = null,
		aVector = new Uint8Array(16) //defaults to zero
	;

	return new Promise(function (resolve, reject) {
		if (!sUserKeyData)
		{
			reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
		}
		else
		{
			aKeyData = HexUtils.HexString2Array(sUserKeyData);
			if (aKeyData.length > 0)
			{
				aKeyData = new Uint8Array(aKeyData);
			}
			else
			{
				reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
			}
			//get password-key
			this.deriveKeyFromPasswordPromise(sPassword,
				_.bind(function(oDerivedKey) {//encrypt user-key with password-key
					crypto.subtle.encrypt({ name: 'AES-CBC', iv: aVector }, oDerivedKey, aKeyData)
						.then(_.bind(function(aEncryptedKeyData) {
							sEncryptedKeyData = HexUtils.Array2HexString(new Uint8Array(aEncryptedKeyData));
							resolve(sEncryptedKeyData);
						}, this))
						.catch(function() {
							reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
						});
				}, this),
				function() {
					reject(new Error(TextUtils.i18n('COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN/ERROR_LOAD_KEY')));
				}
			);
		}
	}.bind(this));
};

/**
 * Asynchronously generate special key from user password. This key used in process of encryption/decryption user key.
 * 
 * @param {string} sPassword
 * @param {Function} fOnGetDerivedKeyCallback - starts after the key is successfully generated
 * @param {Function} fOnErrorCallback - starts if an error occurs during the key generation process
 */
CJscryptoKey.prototype.deriveKeyFromPasswordPromise = function (sPassword, fOnGetDerivedKeyCallback, fOnErrorCallback)
{
	var
		sSalt = "the salt is this string",
		convertStringToArrayBuffer = function (sData)
		{
			if (window.TextEncoder)
			{
				return new TextEncoder('utf-8').encode(sData);
			}
			
			var
				sUtf8 = unescape(encodeURIComponent(sData)),
				sResult = new Uint8Array(sUtf8.length)
			;
			for (var i = 0; i < sUtf8.length; i++)
			{
				sResult[i] = sUtf8.charCodeAt(i);
			}
			return sResult;
		}
	;

	window.crypto.subtle.importKey(
		"raw",
		convertStringToArrayBuffer(sPassword),
		{"name": "PBKDF2"},
		false,
		["deriveKey"]
	)
	.then(_.bind(function (oPasswordKey) {
		window.crypto.subtle.deriveKey(
			{
				"name": "PBKDF2",
				"salt": convertStringToArrayBuffer(sSalt),
				"iterations": 100000,
				"hash": "SHA-256"
			},
			oPasswordKey,
			{
				"name": "AES-CBC",
				"length": 256
			},
			true,
			["encrypt", "decrypt"]
		)
		.then(function(oDerivedKey) {
			if (_.isFunction(fOnGetDerivedKeyCallback))
			{
				fOnGetDerivedKeyCallback(oDerivedKey);
			}
		})
		.catch(function() {
			if (_.isFunction(fOnErrorCallback))
			{
				fOnErrorCallback();
			}
		});
	}, this))
	.catch(function() {
		if (_.isFunction(fOnErrorCallback))
		{
			fOnErrorCallback();
		}
	});
};

CJscryptoKey.prototype.getStorageName = function ()
{
	return this.sPrefix + this.storageName;
};

module.exports = new CJscryptoKey();


/***/ })

}]);