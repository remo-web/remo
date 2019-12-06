<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\PersonalFiles;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 * 
 * @package Filestorage
 */
class Manager extends \Aurora\System\Managers\AbstractManagerWithStorage
{
	/**
	 * @param \Aurora\System\Module\AbstractModule $oModule
	 */
	public function __construct(\Aurora\System\Module\AbstractModule $oModule = null)
	{
		parent::__construct($oModule, new Storages\Sabredav\Storage($this));
	}
	
	/**
	* Returns Min module decorator.
	* 
	* @return \CApiModuleDecorator
	*/
	public function getMinModuleDecorator()
	{
		static $oMinModuleDecorator = null;
		if ($oMinModuleDecorator === null)
		{
			$oMinModuleDecorator = \Aurora\Modules\Min\Module::Decorator();
		}
		
		return $oMinModuleDecorator;
	}	
	
	/**
	 * Checks if file exists. 
	 * 
	 * @param int $UserId Account object. 
	 * @param int $Type Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $Path Path to the folder which contains the file, empty string means the file is in the root folder. 
	 * @param string $Name Filename. 
	 * 
	 * @return bool
	 */
	public function IsFileExists($UserId, $Type, $Path, $Name)
	{
		return $this->oStorage->isFileExists($UserId, $Type, $Path, $Name);
	}

	/**
	 * Retrieves array of metadata on the specific file. 
	 * 
	 * @param int $iUserId Account object 
	 * @param string $sType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder which contains the file, empty string means the file is in the root folder.
	 * @param string $sName Filename. 
	 * 
	 * @return \Aurora\Modules\Files\Classes\FileItem
	 */
	public function getFileInfo($iUserId, $sType, $sPath, $sName)
	{
		$oResult = null;
		$oDirectory = $this->oStorage->getDirectory($iUserId, $sType, $sPath);
		if ($oDirectory !== null)
		{
			$oItem = $oDirectory->getChild($sName);
			if ($oItem !== null)
			{
				$oResult = $this->oStorage->getFileInfo($iUserId, $sType, $oItem);
			}
		}
		return $oResult;
	}

	/**
	 * Retrieves array of metadata on the specific directory. 
	 * 
	 * @param int $iUserId Account object 
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder. 
	 * 
	 * @return \Aurora\Modules\Files\Classes\FileItem
	 */
	public function getDirectoryInfo($iUserId, $iType, $sPath)
	{
		return $this->oStorage->getDirectoryInfo($iUserId, $iType, $sPath);
	}
	
	/**
	 * Retrieves object on the specific directory. 
	 * 
	 * @param int $iUserId Account object 
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * 
	 * @return \Aurora\Modules\Files\Classes\FileItem
	 */
	public function getDirectory($iUserId, $iType)
	{
		return $this->oStorage->getDirectory($iUserId, $iType);
	}	

	/**
	 * Allows for reading contents of the file. 
	 * 
	 * @param int $iUserId Account object 
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder which contains the file, empty string means the file is in the root folder. 
	 * @param string $sName Filename. 
	 * 
	 * @return resource|bool
	 */
	public function getFile($iUserId, $iType, $sPath, $sName, $iOffset = 0, $iChunkSize = 0)
	{
		return $this->oStorage->getFile($iUserId, $iType, $sPath, $sName, $iOffset, $iChunkSize);
	}

	/**
	 * Creates public link for specific file or folder. 
	 * 
	 * @param int $iUserId
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder. 
	 * @param string $sName Filename. 
	 * @param string $sSize Size information, it will be displayed when recipient opens the link. 
	 * @param string $bIsFolder If **true**, it is assumed the link is created for a folder, **false** otherwise. 
	 * 
	 * @return string|bool
	 */
	public function createPublicLink($iUserId, $iType, $sPath, $sName, $sSize, $bIsFolder)
	{
		return $this->oStorage->createPublicLink($iUserId, $iType, $sPath, $sName, $sSize, $bIsFolder);
	}
	
	/**
	 * Removes public link created for specific file or folder. 
	 * 
	 * @param int $iUserId
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder. 
	 * @param string $sName Filename. 
	 * 
	 * @return bool
	 */
	public function deletePublicLink($iUserId, $iType, $sPath, $sName)
	{
		return $this->oStorage->deletePublicLink($iUserId, $iType, $sPath, $sName);
	}

	/**
	 * Performs search for files. 
	 * 
	 * @param int $iUserId 
	 * @param string $sType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder. 
	 * @param string $sPattern Search string. 
	 * @param string $sPublicHash Public hash. 
	 * 
	 * @return array|bool array of \Aurora\Modules\Files\Classes\FileItem. 
	 */
	public function getFiles($iUserId, $sType, $sPath, $sPattern = '', $sPublicHash = null)
	{
		$aFiles = $this->oStorage->getFiles($iUserId, $sType, $sPath, $sPattern, $sPublicHash);
		$aUsers = array();
		foreach ($aFiles as $oFile)
		{
			if (!isset($aUsers[$oFile->Owner]))
			{
				$oUser = \Aurora\Modules\Core\Module::Decorator()->GetUserByPublicId($oFile->Owner);
				$aUsers[$oFile->Owner] = $oUser ? $oUser->PublicId : '';
			}
			$oFile->Owner = $aUsers[$oFile->Owner];
		}
		
		return $aFiles;
	}

	/**
	 * Creates a new folder. 
	 * 
	 * @param int $iUserId
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the parent folder, empty string means top-level folder is created. 
	 * @param string $sFolderName Folder name. 
	 * 
	 * @return bool
	 */
	public function createFolder($iUserId, $iType, $sPath, $sFolderName)
	{
		return $this->oStorage->createFolder($iUserId, $iType, $sPath, $sFolderName);
	}
	
	/**
	 * Creates a new file. 
	 * 
	 * @param int $iUserId Account object 
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder which contains the file, empty string means the file is created in the root folder. 
	 * @param string $sFileName Filename. 
	 * @param $mData Data to be stored in the file. 
	 * @param bool $bOverride If **true**, existing file with that name will be overwritten. 
	 * 
	 * @return bool
	 */
	public function createFile($iUserId, $iType, $sPath, $sFileName, $mData, $bOverride = true, $rangeType = 0, $offset = 0, $extendedProps = [])
	{
		if (!$bOverride)
		{
			$sFileName = $this->oStorage->getNonExistentFileName($iUserId, $iType, $sPath, $sFileName);
		}
		return $this->oStorage->createFile($iUserId, $iType, $sPath, $sFileName, $mData, $rangeType, $offset, $extendedProps);
	}
	
	/**
	 * Creates a link to arbitrary online content. 
	 * 
	 * @param int $iUserId Account object 
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder which contains the link. 
	 * @param string $sLink URL of the item to be linked. 
	 * @param string $sName Name of the link. 
	 * 
	 * @return bool
	 */
	public function createLink($iUserId, $iType, $sPath, $sLink, $sName)
	{
		return $this->oStorage->createLink($iUserId, $iType, $sPath, $sLink, $sName);
	}	
	
	/**
	 * Removes file or folder. 
	 * 
	 * @param int $iUserId Account object 
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder which contains the file, empty string means the file is in the root folder. 
	 * @param string $sName Filename. 
	 * 
	 * @return bool
	 */
	public function delete($iUserId, $iType, $sPath, $sName)
	{
		$bResult = $this->oStorage->delete($iUserId, $iType, $sPath, $sName);
		if ($bResult)
		{
			$this->getMinModuleDecorator()->DeleteMinByID(
					\Aurora\Modules\Min\Module::generateHashId([$iUserId, $iType, $sPath, $sName])
			);
		}
		
		return $bResult;
	}

	/**
	 * 
	 * @param int $iUserId
	 * @param int $sType
	 * @param string $sPath
	 * @param string $sName
	 * @param int $sSize
	 * 
	 * @return array
	 */
	private function generateMinArray($iUserId, $sType, $sPath, $sName, $sSize, $bIsFolder = false)
	{
		$aData = null;
		if ($iUserId)
		{
			$aData = array(
				'UserId' => $iUserId,
				'Type' => $sType, 
				'Path' => $sPath, 
				'Name' => $sName,
				'Size' => $sSize,
				'IsFolder' => $bIsFolder
			);
		}

		return $aData;
	}
	
	/**
	 * Renames file or folder. 
	 * 
	 * @param int $iUserId Account object 
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder which contains the file, empty string means the file is in the root folder. 
	 * @param string $sName Name of file or folder. 
	 * @param string $sNewName New name. 
	 * @param bool $bIsLink
	 * 
	 * @return bool
	 */
	public function rename($iUserId, $iType, $sPath, $sName, $sNewName, $bIsLink)
	{
		$bResult = $this->oStorage->rename($iUserId, $iType, $sPath, $sName, $sNewName);
		if ($bResult)
		{
			$sID = \Aurora\Modules\Min\Module::generateHashId([$iUserId, $iType, $sPath, $sName]);
			$sNewID = \Aurora\Modules\Min\Module::generateHashId([$iUserId, $iType, $sPath, $sNewName]);

			$mData = $this->getMinModuleDecorator()->GetMinByID($sID);
			
			if ($mData && $iUserId)
			{
				$aData = $this->generateMinArray($iUserId, $iType, $sPath, $sNewName, $mData['Size']);
				if ($aData)
				{
					$this->getMinModuleDecorator()->UpdateMinByID($sID, $aData, $sNewID);
				}
			}
		}
		return $bResult;
	}
	
	/**
	 * Move file or folder to a different location. In terms of Aurora, item can be moved to a different storage as well. 
	 * 
	 * @param int $iUserId Account object 
	 * @param int $iFromType Source storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param int $iToType Destination storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sFromPath Path to the folder which contains the item. 
	 * @param string $sToPath Destination path of the item. 
	 * @param string $sName Current name of file or folder. 
	 * @param string $sNewName New name of the item. 
	 * 
	 * @return bool
	 */
	public function move($iUserId, $iFromType, $iToType, $sFromPath, $sToPath, $sName, $sNewName)
	{
		$GLOBALS['__FILESTORAGE_MOVE_ACTION__'] = true;
		$bResult = $this->oStorage->copy($iUserId, $iFromType, $iToType, $sFromPath, $sToPath, $sName, $sNewName, true);
		$GLOBALS['__FILESTORAGE_MOVE_ACTION__'] = false;
		if ($bResult)
		{
			$sID = \Aurora\Modules\Min\Module::generateHashId([$iUserId, $iFromType, $sFromPath, $sName]);
			$sNewID = \Aurora\Modules\Min\Module::generateHashId([$iUserId, $iToType, $sToPath, $sNewName]);

			$mData = $this->getMinModuleDecorator()->GetMinByID($sID);
			if ($mData)
			{
				$aData = $this->generateMinArray($iUserId, $iToType, $sToPath, $sNewName, $mData['Size']);
				if ($aData)
				{
					$this->getMinModuleDecorator()->UpdateMinByID($sID, $aData, $sNewID);
				}
			}
		}
		return $bResult;
	}

	/**
	 * Copies file or folder, optionally renames it. 
	 * 
	 * @param int $iUserId Account object 
	 * @param int $iFromType Source storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param int $iToType Destination storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sFromPath Path to the folder which contains the item. 
	 * @param string $sToPath Destination path of the item.
	 * @param string $sName Current name of file or folder. 
	 * @param string $sNewName New name of the item. 
	 * 
	 * @return bool
	 */
	public function copy($iUserId, $iFromType, $iToType, $sFromPath, $sToPath, $sName, $sNewName = null, $bMove = false)
	{
		return $this->oStorage->copy($iUserId, $iFromType, $iToType, $sFromPath, $sToPath, $sName, $sNewName, $bMove);
	}

	/**
	 * Returns space used by the user in specified storages, in bytes.
	 * 
	 * @param int $iUserId User identifier.
	 * @param string $aTypes Storage type list. Accepted values in array: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**.
	 * 
	 * @return int;
	 */
	public function getUserSpaceUsed($iUserId, $aTypes = array(\Aurora\System\Enums\FileStorageType::Personal))
	{
		return $this->oStorage->getUserSpaceUsed($iUserId, $aTypes);
	}
	
	/**
	 * Allows for obtaining filename which doesn't exist in current directory. For example, if you need to store **data.txt** file but it already exists, this method will return **data_1.txt**, or **data_2.txt** if that one already exists, and so on. 
	 * 
	 * @param int $iUserId Account object 
	 * @param int $iType Storage type. Accepted values: **\Aurora\System\Enums\FileStorageType::Personal**, **\Aurora\System\Enums\FileStorageType::Corporate**, **\Aurora\System\Enums\FileStorageType::Shared**. 
	 * @param string $sPath Path to the folder which contains the file, empty string means the file is in the root folder. 
	 * @param string $sFileName Filename. 
	 * 
	 * @return string
	 */
	public function getNonExistentFileName($iUserId, $iType, $sPath, $sFileName)
	{
		return $this->oStorage->getNonExistentFileName($iUserId, $iType, $sPath, $sFileName);
	}	

	/**
	 * 
	 * @param string $sPublicId
	 */
	public function ClearFiles($sPublicId)
	{
		$this->oStorage->clearPrivateFiles($sPublicId);
	}
}
