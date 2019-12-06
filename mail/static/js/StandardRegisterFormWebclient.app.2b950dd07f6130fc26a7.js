(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[20],{

/***/ "ROvt":
/*!************************************************************************!*\
  !*** ./modules/StandardRegisterFormWebclient/js/views/RegisterView.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	$ = __webpack_require__(/*! jquery */ "EVdn"),
	ko = __webpack_require__(/*! knockout */ "0h2I"),
	
	TextUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Text.js */ "RN+F"),
	UrlUtils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Url.js */ "ZP6a"),
	Utils = __webpack_require__(/*! modules/CoreWebclient/js/utils/Common.js */ "Yjhd"),
	
	Api = __webpack_require__(/*! modules/CoreWebclient/js/Api.js */ "JFZZ"),
	App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
	Browser = __webpack_require__(/*! modules/CoreWebclient/js/Browser.js */ "HLSX"),
	Screens = __webpack_require__(/*! modules/CoreWebclient/js/Screens.js */ "SQrT"),
	
	CAbstractScreenView = __webpack_require__(/*! modules/CoreWebclient/js/views/CAbstractScreenView.js */ "xcwT"),
	
	Ajax = __webpack_require__(/*! modules/CoreWebclient/js/Ajax.js */ "o0Bx"),
	Settings = __webpack_require__(/*! modules/StandardRegisterFormWebclient/js/Settings.js */ "olEj"),
	
	$html = $('html')
;

/**
 * @constructor
 */
function CRegisterView()
{
	CAbstractScreenView.call(this, 'StandardRegisterFormWebclient');
	
	this.sCustomLogoUrl = Settings.CustomLogoUrl;
	this.sInfoText = Settings.InfoText;
	this.sBottomInfoHtmlText = Settings.BottomInfoHtmlText;
	
	this.login = ko.observable('');
	this.enableLoginEdit = ko.observable(true);
	this.password = ko.observable('');
	this.confirmPassword = ko.observable('');
	
	this.loginFocus = ko.observable(false);
	this.passwordFocus = ko.observable(false);
	this.confirmPasswordFocus = ko.observable(false);

	this.loading = ko.observable(false);

	this.canTryRegister = ko.computed(function () {
		return !this.loading();
	}, this);

	this.registerButtonText = ko.computed(function () {
		return this.loading() ? TextUtils.i18n('COREWEBCLIENT/ACTION_REGISTER_IN_PROGRESS') : TextUtils.i18n('COREWEBCLIENT/ACTION_REGISTER');
	}, this);

	this.registerCommand = Utils.createCommand(this, this.register, this.canTryRegister);

	this.shake = ko.observable(false).extend({'autoResetToFalse': 800});
	
	this.welcomeText = ko.observable('');
	App.subscribeEvent('ShowWelcomeRegisterText', _.bind(function (oParams) {
		this.welcomeText(oParams.WelcomeText);
		this.login(oParams.UserName);
		this.enableLoginEdit(false);
	}, this));
	
	App.broadcastEvent('StandardRegisterFormWebclient::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

_.extendOwn(CRegisterView.prototype, CAbstractScreenView.prototype);

CRegisterView.prototype.ViewTemplate = 'StandardRegisterFormWebclient_RegisterView';
CRegisterView.prototype.ViewConstructorName = 'CRegisterView';

CRegisterView.prototype.onBind = function ()
{
	$html.addClass('non-adjustable-valign');
};

/**
 * Focuses login input after view showing.
 */
CRegisterView.prototype.onShow = function ()
{
	_.delay(_.bind(function(){
		if (this.login() === '')
		{
			this.loginFocus(true);
		}
	},this), 1);
};

/**
 * 
 * @param {string} sLogin
 * @param {string} sPassword
 * @param {string} sConfirmPassword
 * @returns {Boolean}
 */
CRegisterView.prototype.validateForm = function (sLogin, sPassword, sConfirmPassword)
{
	if (sLogin === '')
	{
		this.loginFocus(true);
		this.shake(true);
		return false;
	}
	if (sPassword === '')
	{
		this.passwordFocus(true);
		this.shake(true);
		return false;
	}
	if (sPassword !== '' && sPassword !== sConfirmPassword)
	{
		this.confirmPasswordFocus(true);
		this.shake(true);
		Screens.showError(TextUtils.i18n('COREWEBCLIENT/ERROR_PASSWORDS_DO_NOT_MATCH'));
		return false;
	}
	return true;
};

/**
 * Checks login input value and sends register request to server.
 */
CRegisterView.prototype.register = function ()
{
	if (!this.loading())
	{
		var
			sLogin = $.trim(this.login()),
			sPassword = $.trim(this.password()),
			sConfirmPassword = $.trim(this.confirmPassword()),
			oParameters = {
				'Login': sLogin,
				'Password': sPassword
			}
		;
		if (this.validateForm(sLogin, sPassword, sConfirmPassword))
		{
			this.loading(true);
			Ajax.send('StandardRegisterFormWebclient', 'Register', oParameters, this.onRegisterResponse, this);
		}
	}
};

/**
 * Receives data from the server. Shows error and shakes form if server has returned false-result.
 * Otherwise clears search-string if it don't contain "reset-pass", "invite-auth" and "oauth" parameters and reloads page.
 * 
 * @param {Object} oResponse Data obtained from the server.
 * @param {Object} oRequest Data has been transferred to the server.
 */
CRegisterView.prototype.onRegisterResponse = function (oResponse, oRequest)
{
	if (false === oResponse.Result)
	{
		this.loading(false);
		this.shake(true);
		
		Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_REGISTRATION_FAILED'));
	}
	else
	{
		App.setAuthToken(oResponse.Result.AuthToken);
		
		if (window.location.search !== '' &&
			UrlUtils.getRequestParam('reset-pass') === null &&
			UrlUtils.getRequestParam('invite-auth') === null &&
			UrlUtils.getRequestParam('oauth') === null)
		{
			UrlUtils.clearAndReloadLocation(Browser.ie8AndBelow, true);
		}
		else
		{
			UrlUtils.clearAndReloadLocation(Browser.ie8AndBelow, false);
		}
	}
};

module.exports = new CRegisterView();


/***/ }),

/***/ "olEj":
/*!**************************************************************!*\
  !*** ./modules/StandardRegisterFormWebclient/js/Settings.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	_ = __webpack_require__(/*! underscore */ "F/us"),
	
	Types = __webpack_require__(/*! modules/CoreWebclient/js/utils/Types.js */ "AFLV")
;

module.exports = {
	ServerModuleName: 'StandardRegisterFormWebclient',
	HashModuleName: 'register',
	
	CustomLogoUrl: '',
	InfoText: '',
	BottomInfoHtmlText: '',
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['StandardRegisterFormWebclient'];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.ServerModuleName = Types.pString(oAppDataSection.ServerModuleName, this.ServerModuleName);
			this.HashModuleName = Types.pString(oAppDataSection.HashModuleName, this.HashModuleName);
			
			this.CustomLogoUrl = Types.pString(oAppDataSection.CustomLogoUrl, this.CustomLogoUrl);
			this.InfoText = Types.pString(oAppDataSection.InfoText, this.InfoText);
			this.BottomInfoHtmlText = Types.pString(oAppDataSection.BottomInfoHtmlText, this.BottomInfoHtmlText);
		}
	}
};


/***/ }),

/***/ "vvqS":
/*!*************************************************************!*\
  !*** ./modules/StandardRegisterFormWebclient/js/manager.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = function (oAppData) {
	var
		App = __webpack_require__(/*! modules/CoreWebclient/js/App.js */ "IAk5"),
		
		Settings = __webpack_require__(/*! modules/StandardRegisterFormWebclient/js/Settings.js */ "olEj"),
		
		bAnonimUser = App.getUserRole() === Enums.UserRole.Anonymous
	;
	
	Settings.init(oAppData);
	
	if (!App.isPublic() && bAnonimUser)
	{
		if (App.isMobile())
		{
			return {
				/**
				 * Returns register view screen as is.
				 */
				getRegisterScreenView: function () {
					return __webpack_require__(/*! modules/StandardRegisterFormWebclient/js/views/RegisterView.js */ "ROvt");
				},
				
				getHashModuleName: function () {
					return Settings.HashModuleName;
				}
			};
		}
		else
		{
			return {
				/**
				 * Returns login view screen.
				 */
				getScreens: function () {
					var oScreens = {};
					oScreens[Settings.HashModuleName] = function () {
						return __webpack_require__(/*! modules/StandardRegisterFormWebclient/js/views/RegisterView.js */ "ROvt");
					};
					return oScreens;
				}
			};
		}
	}
	
	return null;
};


/***/ })

}]);