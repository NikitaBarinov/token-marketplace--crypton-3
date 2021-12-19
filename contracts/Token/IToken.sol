// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface ITokenInterface{
  /// @notice Transfer ownership from owner to choisen address
  /// @param newOwner The address of new owner of contract 
  /// @return answer that operation was successfully completed 
  function transferOwnership(address newOwner)  external returns(bool answer);

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
  returns (bool answer);

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
    returns (bool answer);

  /// @notice Approval selected quantity of tokens for address  
  /// @param _spender The address for approval
  /// @param _value The amount of approval tokens 
  /// @return answer that operation was successfully completed 
  function approve(
    address _spender,
    uint256 _value
  ) 
    external 
    returns (bool answer);

  /// @notice Have mint choisen quantity of tokens  
  /// @param _target Address of tokens owner 
  /// @param _mintedAmount The address of tokens spender
  function mint(
    address _target,
    uint256 _mintedAmount
  ) 
  external
  returns(bool);

  /// @notice Have burn choisen quantity of tokens  
  /// @param _target Address of tokens owner 
  /// @param _burnedAmount The address of tokens spender
  function burn(
    address _target,
    uint256 _burnedAmount
  ) 
  external
  returns(bool);

  /// @notice Return quantity of approval tokens  
  /// @param _owner Address of tokens owner 
  /// @param _spender The address of tokens spender
  /// @return allow type uint256
  function allowance (
    address _owner,
    address _spender
  ) 
    external
    view 
    returns(uint256 allow);

  /// @notice Return total supply of tokens  
  /// @return totSupply type uint256
  function totalSupply() external view returns (uint256 totSupply );

  /// @notice Return balance of address   
  /// @return balance type uint256
  function balanceOf(address _owner) external view returns(uint256 balance);

  /// An event for tracking a approval of tokens.
  event Approval(address indexed tokenOwner, address indexed spender,
    uint tokens);

  /// An event for tracking a transfer of tokens.
  event Transfer(address indexed _from, address indexed _to,
    uint256 _value);

  /// An event for tracking owner of contract.
  event OwnershipTransferred(address indexed previosOwner, address indexed newOwner);

  event CommissionChanged(uint256 newCommission);
}