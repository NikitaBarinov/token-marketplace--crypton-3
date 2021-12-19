// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IToken.sol";

/// @title The ERC20 Token
/// @author Barinov N.N.
/// @notice You can use this contract for studing
/// @dev All function calls are currently implemented without side effects
contract Token is ITokenInterface{
  address public owner;
  address private daoAddress;
  string public constant name = "Sezam";
  string public constant symbol = "SZM";
  uint256 private totalSupply_;
  uint8 public constant decimals = 18;

  uint256 private commission;
  address private commissionRecipient; 

  mapping(address => uint256) private balances;
  mapping(address => mapping(address => uint256)) private allowed;

  constructor() public {
      owner = msg.sender;
      totalSupply_ = 1000;
      balances[owner] = totalSupply_;
      allowed[owner][owner] = totalSupply_;
      commission = 5;
      commissionRecipient = msg.sender;
  }

  modifier costs(address addrOf,uint256 value){
    require((balances[addrOf] + commission) >= value,"Insufficient funds");
    _;
  }

  modifier onlyOwner(){
    require(owner == msg.sender || msg.sender == daoAddress,"Ownable: caller is not owner"); 
    _;
  }

  function setDaoAddress(address _dao)external onlyOwner{
    daoAddress = _dao;
  }

  function getDaoAddress()external view returns(address){
    return daoAddress;
  }

  function setCommission(uint256 newCommission) external onlyOwner{
    commission = newCommission;
    emit CommissionChanged(commission);
  }
  /// @notice Transfer ownership from owner to choisen address
  /// @param newOwner The address of new owner of contract 
  /// @return answer that operation was successfully completed 
  function transferOwnership(address newOwner) 
  external
  override 
  onlyOwner 
  returns(bool answer) 
  {
    address oldOwner = owner;
    owner = newOwner;
  
    emit OwnershipTransferred(oldOwner,newOwner);  
    return true;
  }

  /// @notice Transfer selected quantity of tokens
  /// @notice  from msg.sender to selected address
  /// @dev Return an array of one number type bool 
  /// @param _to The address where we sending the token 
  /// @param _value The amount of sending tokens 
  /// @return answer that operation was successfully completed 
  function transfer(
    address _to,
    uint256 _value
  ) 
  external
  override
  costs(msg.sender,_value)
  returns (bool answer)
  {
    _beforeTokenTransfer(msg.sender);
    changeBalance(msg.sender, _to, _value);
    return true;
  }

  /// @notice Transfer selected quantity of tokens between two addresses  
  /// @dev Return an array of one number type bool
  /// @dev msg.sender can transfer only allowed quantity of tokens 
  /// @param _from The address from where we move tokens  
  /// @param _to The address there do we move tokens 
  /// @param _value The amount of sending tokens 
  /// @return answer that operation was successfully completed 
  function transferFrom(
    address _from,
    address _to,
    uint _value
  ) 
    external
    override
    costs(_from, _value + commission)
    returns (bool answer)
  {
    //require(_value <= allowed[_from][msg.sender],"Insufficient Confirmed Funds");
    //allowed[_from][msg.sender] -= _value;
    _beforeTokenTransfer(_from);
    changeBalance(_from, _to, _value);
    return true;
}

  /// @notice changes balances on two accounts to value 
  /// @param _from The address of giving account 
  /// @param _to The address of receiving account  
  /// @param _value Transfered amount  
  function changeBalance(address _from, address _to, uint256 _value) private{
    balances[_from] = balances[_from] - _value;
    balances[_to] = balances[_to] + _value;
    emit Transfer(_from, _to, _value);
  }

  function _beforeTokenTransfer(
    address from
  ) private {
    changeBalance(from, commissionRecipient, commission);
  }

  /// @notice Approval selected quantity of tokens for address  
  /// @param _spender The address for approval
  /// @param _value The amount of approval tokens 
  /// @return answer that operation was successfully completed 
  function approve(
    address _spender,
    uint256 _value
  ) 
    external 
    override
    returns (bool answer)
  {
      allowed[msg.sender][_spender] += _value;
      emit Approval(msg.sender, _spender, _value);
      return true;
  }

  /// @notice Have mint choisen quantity of tokens  
  /// @param _target Address of tokens owner 
  /// @param _mintedAmount The address of tokens spender
  function mint(
    address _target,
    uint256 _mintedAmount
  ) 
  external 
  override
  onlyOwner
  returns(bool)
  {
    balances[_target] += _mintedAmount;
    totalSupply_ += _mintedAmount;
    emit Transfer(address(0), _target, _mintedAmount);
    return true;
  }

  /// @notice Have burn choisen quantity of tokens  
  /// @param _target Address of tokens owner 
  /// @param _burnedAmount The address of tokens spender
  function burn(
    address _target,
    uint256 _burnedAmount
  ) 
  external 
  override
  costs(
    _target,
    _burnedAmount
  ) 
  onlyOwner
  returns(bool)
  {
    balances[_target] -= _burnedAmount;
    totalSupply_ -= _burnedAmount;
    emit Transfer(_target, address(0), _burnedAmount);
    return true;
  }

  /// @notice Return quantity of approval tokens  
  /// @param _owner Address of tokens owner 
  /// @param _spender The address of tokens spender
  /// @return allow type uint256
  function allowance (
    address _owner,
    address _spender
  ) 
    external
    override
    view 
    returns(uint256 allow)
  {
    return allowed[_owner][_spender];
  }

  /// @notice Return total supply of tokens  
  /// @return totSupply type uint256
  function totalSupply() external view override returns (uint256 totSupply ){
      return totalSupply_;
  }

  function getCommission() external view returns(uint256){
    return commission;
  }

  /// @notice Return balance of address   
  /// @return balance type uint256
  function balanceOf(address _owner) external view override returns(uint256 balance){
      return balances[_owner];
  }
}