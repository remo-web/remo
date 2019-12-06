<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\StandardAuth\Managers\Accounts;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2019, Afterlogic Corp.
 */
class Manager extends \Aurora\System\Managers\AbstractManager
{
	/**
	 * @var \Aurora\System\Managers\Eav
	 */
	public $oEavManager = null;
	
	public function __construct(\Aurora\System\Module\AbstractModule $oModule = null)
	{
		parent::__construct($oModule);
		
		$this->oEavManager = \Aurora\System\Managers\Eav::getInstance();
	}

	/**
	 * 
	 * @param int $iAccountId
	 * @return boolean
	 * @throws \Aurora\System\Exceptions\BaseException
	 */
	public function getAccountById($iAccountId)
	{
		$oAccount = null;
		try
		{
			if (is_numeric($iAccountId))
			{
				$iAccountId = (int) $iAccountId;
				
				$oAccount = $this->oEavManager->getEntity($iAccountId, '\Aurora\Modules\StandardAuth\Classes\Account');
			}
			else
			{
				throw new \Aurora\System\Exceptions\BaseException(Errs::Validation_InvalidParameters);
			}
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$oAccount = false;
			$this->setLastException($oException);
		}
		return $oAccount;
	}
	
	/**
	 * Retrieves information on particular WebMail Pro user. 
	 * 
	 * @todo not used
	 * 
	 * @param int $iUserId User identifier.
	 * 
	 * @return User | false
	 */
	public function getAccountByCredentials($sLogin, $sPassword)
	{
		$oAccount = null;
		try
		{
			$aResults = $this->oEavManager->getEntities(
				\Aurora\Modules\StandardAuth\Classes\Account::class,
				array(
					'IsDisabled', 'Password', 'IdUser'
				),
				0,
				0,
				array(
					'Password' => $sLogin . $sPassword,
					'IsDisabled' => false
				)
			);
			
			if (is_array($aResults) && count($aResults) === 1)
			{
				$oAccount = $aResults[0];
			}
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$oAccount = false;
			$this->setLastException($oException);
		}
		return $oAccount;
	}

	/**
	 * Obtains list of information about accounts.
	 * @param int $iPage List page.
	 * @param int $iUsersPerPage Number of users on a single page.
	 * @param string $sOrderBy = 'email'. Field by which to sort.
	 * @param int $iOrderType = \Aurora\System\Enums\SortOrder::ASC. If **\Aurora\System\Enums\SortOrder::ASC** the sort order type is ascending.
	 * @param string $sSearchDesc = ''. If specified, the search goes on by substring in the name and email of default account.
	 * @return array | false
	 */
	public function getAccountList($iPage, $iUsersPerPage, $sOrderBy = 'Login', $iOrderType = \Aurora\System\Enums\SortOrder::ASC, $sSearchDesc = '')
	{
		$aResult = false;
		try
		{
			$aFilters =  array();
			
			if ($sSearchDesc !== '')
			{
				$aFilters['Login'] = '%'.$sSearchDesc.'%';
			}
				
			$aResults = $this->oEavManager->getEntities(
				\Aurora\Modules\StandardAuth\Classes\Account::class,
				array(
					'IsDisabled', 'Login', 'Password', 'IdUser'
				),
				$iPage,
				$iUsersPerPage,
				$aFilters,
				$sOrderBy,
				$iOrderType
			);

			if (is_array($aResults))
			{
				foreach($aResults as $oItem)
				{
					$aResult[$oItem->EntityId] = array(
						$oItem->Login,
						$oItem->Password,
						$oItem->IdUser,
						$oItem->IsDisabled
					);
				}
			}
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$aResult = false;
			$this->setLastException($oException);
		}
		return $aResult;
	}

	/**
	 * @param \Aurora\Modules\StandardAuth\Classes\Account $oAccount
	 *
	 * @return bool
	 */
	public function isExists(\Aurora\Modules\StandardAuth\Classes\Account $oAccount)
	{
		$bResult = false;
		try
		{
			$aResults = $this->oEavManager->getEntities(
				\Aurora\Modules\StandardAuth\Classes\Account::class,
				array('Login'),
				0,
				0,
				array('Login' => $oAccount->Login)
			);

			if (is_array($aResults) && count($aResults) > 0)
			{
				$bResult = true;
			}
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$this->setLastException($oException);
		}
		return $bResult;
	}
	
	/**
	 * @param \Aurora\Modules\StandardAuth\Classes\Account $oAccount
	 *
	 * @return bool
	 */
	public function createAccount (\Aurora\Modules\StandardAuth\Classes\Account &$oAccount)
	{
		$bResult = false;
		try
		{
			if ($oAccount->validate())
			{
				if (!$this->isExists($oAccount))
				{
					if (!$this->oEavManager->saveEntity($oAccount))
					{
						throw new \Aurora\System\Exceptions\ManagerException(Errs::UsersManager_UserCreateFailed);
					}
				}
				else
				{
					throw new \Aurora\System\Exceptions\ManagerException(Errs::UsersManager_UserAlreadyExists);
				}
			}

			$bResult = true;
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}

		return $bResult;
	}
	
	/**
	 * @param \Aurora\Modules\StandardAuth\Classes\Account $oAccount
	 *
	 * @return bool
	 */
	public function updateAccount (\Aurora\Modules\StandardAuth\Classes\Account &$oAccount)
	{
		$bResult = false;
		try
		{
			if ($oAccount->validate())
			{
//				if ($this->isExists($oAccount))
//				{
					if (!$this->oEavManager->saveEntity($oAccount))
					{
						throw new \Aurora\System\Exceptions\ManagerException(Errs::UsersManager_UserCreateFailed);
					}
//				}
//				else
//				{
//					throw new \Aurora\System\Exceptions\ManagerException(Errs::UsersManager_UserAlreadyExists);
//				}
			}

			$bResult = true;
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}

		return $bResult;
	}
	
	/**
	 * 
	 * @param \Aurora\Modules\StandardAuth\Classes\Account $oAccount
	 * @return bool
	 */
	public function deleteAccount(\Aurora\Modules\StandardAuth\Classes\Account $oAccount)
	{
		$bResult = false;
		try
		{
			$bResult = $this->oEavManager->deleteEntity($oAccount->EntityId);
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$this->setLastException($oException);
		}

		return $bResult;
	}
	
	/**
	 * Obtains basic accounts for specified user.
	 * 
	 * @param int $iUserId
	 * 
	 * @return array|boolean
	 */
	public function getUserAccounts($iUserId, $bWithPassword = false)
	{
		$mResult = false;
		try
		{
			$aFields = array(
				'Login'
			);
			if ($bWithPassword)
			{
				$aFields[] = 'Password';
			}
			$mResult = $this->oEavManager->getEntities(
				\Aurora\Modules\StandardAuth\Classes\Account::class,
				$aFields,
				0,
				0,
				array('IdUser' => $iUserId, 'IsDisabled' => false)
			);
		}
		catch (\Aurora\System\Exceptions\BaseException $oException)
		{
			$this->setLastException($oException);
		}
		return $mResult;
	}
}
