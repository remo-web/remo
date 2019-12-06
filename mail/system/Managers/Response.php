<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\System\Managers;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 *
 * @package Api
 */
class Response
{
	protected static $sMethod = null;

	public static $objectNames = array(
			'Aurora\Modules\Mail\Classes\MessageCollection' => 'MessageCollection',
			'Aurora\Modules\Mail\Classes\Message' => 'Message',
			'Aurora\Modules\Mail\Classes\FolderCollection' => 'FolderCollection',
			'Aurora\Modules\Mail\Classes\Folder' => 'Folder'
	);

	public static function GetMethod()
	{
		return  self::$sMethod;
	}
	
	public static function SetMethod($sMethod)
	{
		self::$sMethod = $sMethod;
	}

	/**
	 * @param string $sObjectName
	 *
	 * @return string
	 */
	public static function GetObjectName($sObjectName)
	{
		return !empty(self::$objectNames[$sObjectName]) ? self::$objectNames[$sObjectName] : $sObjectName;
	}
	
	/**
	 * @param object $oData
	 *
	 * @return array | false
	 */
	public static function objectWrapper($oData, $aParameters = array())
	{
		$mResult = false;
		if (\is_object($oData))
		{
			$sObjectName = \get_class($oData);
			$mResult = array(
				'@Object' => self::GetObjectName($sObjectName)
			);			

			if ($oData instanceof \MailSo\Base\Collection)
			{
				$mResult['@Object'] = 'Collection/'.$mResult['@Object'];
				$mResult['@Count'] = $oData->Count();
				$mResult['@Collection'] = self::GetResponseObject($oData->CloneAsArray(), $aParameters);
			}
			else
			{
				$mResult['@Object'] = 'Object/'.$mResult['@Object'];
			}
		}

		return $mResult;
	}
	
	/**
	 * @param mixed $mResponse
	 *
	 * @return mixed
	 */
	public static function GetResponseObject($mResponse, $aParameters = array())
	{
		$mResult = null;

		if (\is_object($mResponse))
		{
			if (\method_exists($mResponse, 'toResponseArray'))	
			{
				$aArgs = [$mResponse, $aParameters];
				\Aurora\System\Api::GetModuleManager()->broadcastEvent(
					'System', 
					'toResponseArray' . \Aurora\System\Module\AbstractModule::$Delimiter . 'before', 
					$aArgs
				);

				$mResult = \array_merge(
					self::objectWrapper($mResponse, $aParameters), 
					$mResponse->toResponseArray($aParameters)
				);

				\Aurora\System\Api::GetModuleManager()->broadcastEvent(
					'System', 
					'toResponseArray' . \Aurora\System\Module\AbstractModule::$Delimiter . 'after', 
					$aArgs,
					$mResult
				);			
			}
			else
			{
				$mResult = \array_merge(
					self::objectWrapper($mResponse, $aParameters), 
					self::CollectionToResponseArray($mResponse, $aParameters)
				);
			}
		}
		else if (\is_array($mResponse))
		{
			foreach ($mResponse as $iKey => $oItem)
			{
				$mResponse[$iKey] = self::GetResponseObject($oItem, $aParameters);
			}

			$mResult = $mResponse;
		}
		else
		{
			$mResult = $mResponse;
		}

		unset($mResponse);

		return $mResult;
	}	
	
	/**
	 * @param bool $bDownload
	 * @param string $sContentType
	 * @param string $sFileName
	 *
	 * @return bool
	 */
	public static function OutputHeaders($bDownload, $sContentType, $sFileName)
	{
	
		if ($bDownload)
		{
			\header('Content-Type: '.$sContentType, true);
		}
		else
		{
			$aParts = \explode('/', $sContentType, 2);
			if (\in_array(\strtolower($aParts[0]), array('image', 'video', 'audio')) ||
				\in_array(\strtolower($sContentType), array('application/pdf', 'application/x-pdf', 'text/html')))
			{
				\header('Content-Type: '.$sContentType, true);
			}
			else
			{
				\header('Content-Type: text/plain; charset=', true);
			}
		}

		\header('Content-Disposition: '.($bDownload ? 'attachment' : 'inline' ).'; '.
			\trim(\MailSo\Base\Utils::EncodeHeaderUtf8AttributeValue('filename', $sFileName)), true);
		
		\header('Accept-Ranges: none', true);
	}
	
	public static function RemoveThumbFromCache($iUserId, $sHash, $sFileName)
	{
		$oCache = new Cache('thumbs', \Aurora\System\Api::getUserUUIDById($iUserId));
		$sMd5Hash = \md5('Raw/Thumb/'.$sHash.'/'.$sFileName);
		if ($oCache->has($sMd5Hash))
		{
			$oCache->delete($sMd5Hash);
		}
	}
	
	public static function getImageAngle($rResource)
	{
		$iRotateAngle = 0;
		if (\function_exists('exif_read_data')) 
		{ 
			if ($exif_data = @\exif_read_data($rResource, 'IFD0')) 
			{ 
				switch (@$exif_data['Orientation']) 
				{ 
					case 1: 
						$iRotateAngle = 0; 
						break; 
					case 3: 
						$iRotateAngle = 180; 
						break; 
					case 6: 
						$iRotateAngle = 270; 
						break; 
					case 8: 
						$iRotateAngle = 90; 
						break; 
				}
			}
		}

		return $iRotateAngle;
	}

	public static function GetThumbHash()
	{
		$sHash = (string) \Aurora\System\Router::getItemByIndex(1, '');
		if (empty($sHash))
		{
			$sHash = \rand(1000, 9999);
		}

		return $sHash;
	}

	public static function GetThumbCacheFilename($sHash, $sFileName)
	{
		return \md5('Raw/Thumb/'.$sHash.'/'.$sFileName);
	}

	public static function GetThumbResourceCache($iUserId, $sFileName)
	{
		$oCache = new Cache('thumbs', \Aurora\System\Api::getUserUUIDById($iUserId));

		return $oCache->get(
			self::GetThumbCacheFilename(self::GetThumbHash(), $sFileName)
		);		
	}

	public static function GetThumbResource($iUserId, $rResource, $sFileName, $bShow = true)
	{
		$sThumb = null;

		$iRotateAngle = self::getImageAngle($rResource);
		try
		{
			$oImageManager = new \Intervention\Image\ImageManager(['driver' => 'Gd']);
			$oThumb = $oImageManager->make($rResource);
			if ($iRotateAngle > 0)
			{
				$oThumb = $oThumb->rotate($iRotateAngle);
			}
			$sThumb = $oThumb->heighten(100)->widen(100)->response();

			$oCache = new Cache('thumbs', \Aurora\System\Api::getUserUUIDById($iUserId));
			$sHash = self::GetThumbHash();
			$oCache->set(self::GetThumbCacheFilename($sHash, $sFileName), $sThumb);
		}
		catch (\Exception $oE) {}

		if ($bShow)
		{
			echo $sThumb; exit();
		}
		else 
		{
			return $sThumb;
		}
	}	
	
	/**
	 * @param string $sKey
	 *
	 * @return void
	 */
	public static function cacheByKey($sKey)
	{
		if (!empty($sKey))
		{
			$iUtcTimeStamp = time();
			$iExpireTime = 3600 * 24 * 5;

			\header('Cache-Control: private', true);
			\header('Pragma: private', true);
			\header('Etag: '.\md5('Etag:'.\md5($sKey)), true);
			\header('Last-Modified: '.\gmdate('D, d M Y H:i:s', $iUtcTimeStamp - $iExpireTime).' UTC', true);
			\header('Expires: '.\gmdate('D, j M Y H:i:s', $iUtcTimeStamp + $iExpireTime).' UTC', true);
		}
	}

	/**
	 * @param string $sKey
	 *
	 * @return void
	 */
	public static function verifyCacheByKey($sKey)
	{
		if (!empty($sKey))
		{
			$oHttp = \MailSo\Base\Http::NewInstance();
			$sIfModifiedSince = $oHttp->GetHeader('If-Modified-Since', '');
			if (!empty($sIfModifiedSince))
			{
				$oHttp->StatusHeader(304);
				self::cacheByKey($sKey);
				exit();
			}
		}
	}	
	
	public static function CollectionToResponseArray($oCollection, $aParameters = array())
	{
		$aResult = array();
		if ($oCollection instanceof \MailSo\Base\Collection)
		{
			$sObjectName = \get_class($oCollection);

			$aResult = array(
				'@Object' => 'Collection/'. self::GetObjectName($sObjectName),
				'@Count' => $oCollection->Count(),
				'@Collection' => self::GetResponseObject($oCollection->CloneAsArray(), $aParameters)
			);
		}
		
		return $aResult;
	}

	/**
	 * @param string $sMethod
	 * @param mixed $mResult = false
	 *
	 * @return array
	 */
	public static function DefaultResponse($sModuleName, $sMethod, $mResult = false)
	{
		$aResult = [
			'AuthenticatedUserId' => \Aurora\System\Api::getAuthenticatedUserId(),
			'@Time' => 0
		];
		if (is_array($mResult))
		{
			foreach ($mResult as $aValue)
			{
				if ($aValue['Module'] === $sModuleName && $aValue['Method'] === $sMethod)
				{
					$aResult['Module'] = $sModuleName;
					$aResult['Method'] = $sMethod;
					$aResult['Result'] = self::GetResponseObject(
						$aValue['Result'], 
						[
							'Module' => $aValue['Module'],
							'Method' => $aValue['Method'],
							'Parameters' => $aValue['Parameters']
						]
					);
				}
				else if (\Aurora\System\Api::$bDebug)
				{
					$aResult['Stack'][] =  self::GetResponseObject(
						$aValue['Result'], 
						[
							'Module' => $aValue['Module'],
							'Method' => $aValue['Method'],
							'Parameters' => $aValue['Parameters']
						]
					);
				}
			}
		}
		$aResult['SubscriptionsResult'] = \Aurora\System\Api::GetModuleManager()->GetSubscriptionsResult();
		$aResult['@Time'] = number_format(microtime(true) - AU_APP_START, 4) + 0;
		$aResult['@TimeApiInit'] = number_format(AU_API_INIT, 4) + 0;
		
		\Aurora\System\Api::Log('@Time: ' . $aResult['@Time']);
		\Aurora\System\Api::Log('@TimeApiInit: ' . $aResult['@TimeApiInit']);
		$sLoggerGuid = \Aurora\System\Api::GetLoggerGuid();
		if (!empty($sLoggerGuid))
		{
			$aResult['@LoggerGuid'] = \MailSo\Log\Logger::Guid();
		}
		
		if (version_compare(phpversion(), '7.1', '>=')) {
		    ini_set( 'serialize_precision', -1 );
		}
		
		return $aResult;
	}		

	/**
	 * @param string $sMethod
	 * @param int $iErrorCode
	 * @param string $sErrorMessage
	 * @param array $aAdditionalParams = null
	 *
	 * @return array
	 */
	public static function FalseResponse($sMethod, $iErrorCode = null, $sErrorMessage = null, $aAdditionalParams = null, $sModule = null)
	{
		$aResponseItem = self::DefaultResponse($sModule, $sMethod, false);

		if (null !== $iErrorCode) 
		{
			$aResponseItem['ErrorCode'] = (int) $iErrorCode;
			if (null !== $sErrorMessage) 
			{
				$aResponseItem['ErrorMessage'] = null === $sErrorMessage ? '' : (string) $sErrorMessage;
			}
		}

		if (null !== $sModule) 
		{
			$aResponseItem['Module'] = $sModule;
		}

		if (is_array($aAdditionalParams)) 
		{			
			foreach ($aAdditionalParams as $sKey => $mValue) 
			{
				$aResponseItem[$sKey] = $mValue;
			}
		}

		return $aResponseItem;
	}		

	/**
	 * @param string $sActionName
	 * @param \Exception $oException
	 * @param array $aAdditionalParams = null
	 *
	 * @return array
	 */
	public static function ExceptionResponse($sActionName, $oException, $aAdditionalParams = null)
	{
		$iErrorCode = null;
		$sErrorMessage = null;
		$sModule = '';

		$oSettings =& \Aurora\System\Api::GetSettings();
		$bShowError = $oSettings->GetValue('DisplayServerErrorInformation', false);

		if ($oException instanceof \Aurora\System\Exceptions\ApiException) 
		{
			$iErrorCode = $oException->getCode();
			$sErrorMessage = null;
			if ($bShowError) 
			{
				$sErrorMessage = $oException->getMessage();
				if (empty($sErrorMessage) || 'ApiException' === $sErrorMessage) 
				{
					$sErrorMessage = null;
				}
			}
			$oModule = $oException->GetModule();
			if ($oModule)
			{
				$sModule = $oModule::GetName();
			}
		}
		else if ($bShowError && $oException instanceof \MailSo\Imap\Exceptions\ResponseException) 
		{
			$iErrorCode = \Aurora\System\Notifications::MailServerError;
			
			$oResponse = /* @var $oResponse \MailSo\Imap\Response */ $oException->GetLastResponse();
			if ($oResponse instanceof \MailSo\Imap\Response) 
			{
				$sErrorMessage = $oResponse instanceof \MailSo\Imap\Response ?
					$oResponse->Tag.' '.$oResponse->StatusOrIndex.' '.$oResponse->HumanReadable : null;
			}
		} 
		else 
		{
			$iErrorCode = \Aurora\System\Notifications::UnknownError;
//			$sErrorMessage = $oException->getCode().' - '.$oException->getMessage();
		}

		return self::FalseResponse($sActionName, $iErrorCode, $sErrorMessage, $aAdditionalParams, $sModule);
	}		

	public static function GetJsonFromObject($sFormat, $aResponseItem)
	{
		if ($sFormat !== 'Raw')
		{
			@header('Content-Type: application/json; charset=utf-8');
		}
		return \MailSo\Base\Utils::Php2js($aResponseItem, \Aurora\System\Api::SystemLogger());		
	}
}
