// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

/// @title The ERC20 Token
/// @author Barinov N.N.
/// @notice You can use this contract for studing
/// @dev All function calls are currently implemented without side effects
contract Token{
    address public owner;
    string public name;
    string public symbol;
    uint256 private totalSupply_;
    uint8 public decimals;
    
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowed;

    constructor() public {
        owner = msg.sender;
        name = "Sezam";
        symbol = "SZM";
        decimals = 18;
        totalSupply_ = 1000;
        balances[owner] = totalSupply_;
    }

    function transferOwnership(address newOwner) public returns(bool answer) {
      require(owner == msg.sender,"Ownable: caller is not owner");
      require(newOwner != address(0),"Ownable: new owner is the zero address");
     
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
    public
    returns (bool answer)
    {
        require(balances[msg.sender] >= _value,"Insufficient funds");
            address _from = msg.sender;
            
            balances[_from] = balances[_from] - _value;
            balances[_to] = balances[_to] + _value;
            
            emit Transfer(_from, _to, _value);
          
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
      public
      returns (bool answer)
    {
            require(_value <= balances[_from],"Insufficient funds");
            require(_value <= allowed[_from][msg.sender],"Insufficient Confirmed Funds");
            
            balances[_from] = balances[_from] - _value;
            allowed[_from][msg.sender] = allowed[_from][msg.sender] - _value;
            balances[_to] = balances[_to] + _value;
            
            emit Transfer(_from, _to, _value);
          
            return true;
    }

    /// @notice Approval selected quantity of tokens for address  
    /// @param _spender The address for approval
    /// @param _value The amount of approval tokens 
    /// @return answer that operation was successfully completed 
    function approve(
      address _spender,
      uint256 _value
    ) 
      public 
      returns (bool answer)
    {
        allowed[msg.sender][_spender] += _value;
        emit Approval(msg.sender, _spender, _value);
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
      public
      view 
      returns(uint256 allow)
    {
        return allowed[_owner][_spender];
    }

    /// @notice Return total supply of tokens  
    /// @return totSupply type uint256
    function totalSupply() public view returns (uint256 totSupply ){
        return totalSupply_;
    }

    /// @notice Return balance of address   
    /// @return balance type uint256
    function balanceOf(address _owner) public view returns(uint256 balance){
        return balances[_owner];
    }

    /// An event for tracking a approval of tokens.
    event Approval(address indexed tokenOwner, address indexed spender,
     uint tokens);

    /// An event for tracking a transfer of tokens.
    event Transfer(address indexed _from, address indexed _to,
     uint256 _value);

    /// An event for tracking owner of contract.
    event OwnershipTransferred(address indexed previosOwner, address indexed newOwner);
}