// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./ACDM/ACDM.sol";

/**@title pyramid contract */

contract TradingFloor{
    uint256 constant roundTime = 0;
    ACDM private token;
    uint256 public numOfRound;
    uint256 private price;
    uint256 public totalSupplyACDM;
    uint256 decimal;
    uint256 private idOrder = 0;
    uint256 totalOrdersRound;
    uint256 totalOrders;

    struct refer{
        address payable firstRefer;
        address payable secondRefer;
    }

    struct round{
        uint256 totalSupply;
        uint256 finishTime;
        uint256 tradingVolumeETH;
        bool saleOrTrade;//sale false trade true
        
    }

    struct order{
        address _owner;
        uint256 _numRound;
        uint256 _balance;
        uint256 _totalAmountACDM;
        uint256 _totalPriceForACDM;
        bool _open;
    }

    order[] orders;
    mapping(uint256 => round) rounds;
    mapping(address => uint256) unlockBalance;
    mapping(address => uint256)  balancesETH;
    mapping(address => uint256)  balancesACDM;
    mapping(address => refer) refers;
    
    constructor(address _voteToken){
        token = ACDM(_voteToken);
        price = 0.00001 ether;
        numOfRound = 0;
    }


    modifier userRegistered(address _user){
        require(refers[_user].firstRefer != address(0) || _user == address(0), "User not registered");
        _;
    }

    modifier userNotRegistered(address _user){
        require(refers[_user].firstRefer == address(0), "User is already registered");
        _;
    }

    function tradingFloorInit() external {
        decimal = token.decimals();
        token.mint(address(this), 100000 * 10 ** decimal);
        token.approve(address(this), 100000 * 10 ** decimal);
        balancesACDM[address(this)] = 100000 * 10 ** decimal;
        rounds[numOfRound].finishTime = block.timestamp + roundTime;
        rounds[numOfRound].totalSupply = 100000 * 10 ** decimal;
        rounds[numOfRound].tradingVolumeETH = 0;
        rounds[numOfRound].saleOrTrade = false;
        totalOrdersRound = 0;
        totalOrders = 0;
    }
    
    /** @notice Register user in contract.
        * @param _firstRefer Address of first refer.
        * @param _secondRefer Address of second refer.
    */
    function registration(
        address payable _firstRefer,
        address payable _secondRefer
    ) external
    payable 
    userNotRegistered(msg.sender)
    userRegistered(_firstRefer)
    userRegistered(_secondRefer)
    returns(bool _success){
        balancesETH[msg.sender] = msg.value;
        balancesACDM[msg.sender] = 0;
            
        refers[msg.sender].firstRefer = choiceRefers(_firstRefer);
        refers[msg.sender].secondRefer = choiceRefers(_secondRefer);
        
        emit UserIsRegistrated(msg.sender, refers[msg.sender].firstRefer, refers[msg.sender].secondRefer);
    return true;
    }

    /** @notice Withdraw token to token address.
    * @param _amount Amount of withdrawing tokens.
    */
    function withdraw(uint256 _amount) external {
        require(unlockBalance[msg.sender] + _amount < balancesACDM[msg.sender],"Balcance locked" );
        balancesETH[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit Withdraw(msg.sender, _amount);
    }
    
    
    /** @notice If refer address(0) return address of contract if not return refer.
      * @param _refer Address of refer.
      * @return address of new refer or contract address.
    */
    function choiceRefers(address payable _refer)private view returns(address payable){
        if(_refer != address(0)){
            return _refer;
        } else if(_refer == address(0)){
            return payable(address(this));
        } 
    }

    /** @notice Finish round and start new, if time to finish end or all tokens saled.
    */
    function finishRound() public {
        require(
            balancesACDM[address(this)] == 0 || 
            rounds[numOfRound].finishTime <= block.timestamp,
            "Round can not be closed");
        closeOrders();
        numOfRound++;
        startRound();
    }


    /** @notice Start new round.
    */
    function startRound() private returns(bool) {
        rounds[numOfRound].finishTime = block.timestamp + roundTime;
        
        rounds[numOfRound].tradingVolumeETH = 0;

        if (rounds[numOfRound - 1].saleOrTrade == true){
            changePrice();
            rounds[numOfRound].saleOrTrade = false;
            token.burn(balancesACDM[address(this)]);
             
            uint256 totalSupplyForMint = ((rounds[numOfRound].tradingVolumeETH * 10e6) / (price * 10e6)); 
         
            token.mint(address(this), totalSupplyForMint);
            token.approve(address(this), totalSupplyForMint);

            balancesACDM[address(this)] = totalSupplyForMint;
            rounds[numOfRound].totalSupply = totalSupplyForMint;

            emit RoundStarted(rounds[numOfRound].saleOrTrade, rounds[numOfRound].totalSupply, price);
  
            return true;
        } else if(rounds[numOfRound - 1].saleOrTrade == false){
            rounds[numOfRound].totalSupply = 0;
            rounds[numOfRound].saleOrTrade = true;
            
            emit RoundStarted(rounds[numOfRound].saleOrTrade, rounds[numOfRound].totalSupply, price);
            
            return true;
        }        
    }

    //Trade round
    /** @notice Add order for buy tokens for ETH in trade round.
        * @param _amountACDM Amount of tokens which the user wants to buy .
        * @param _totalPriceForACDM total price that sender want for all ACDM.
  
    */
    function addOrder(uint256 _totalPriceForACDM, uint256 _amountACDM) public{
        require(rounds[numOfRound].saleOrTrade == true, "Not a trade round");
        require(balancesACDM[msg.sender] >= _amountACDM, "Insufficent tokens");
        
        order memory newOrder; 
        newOrder._owner = msg.sender;
        newOrder._totalAmountACDM = _amountACDM;
        newOrder._totalPriceForACDM = _totalPriceForACDM;
        newOrder._balance = _amountACDM;
        newOrder._numRound = numOfRound;
        newOrder._open = true;
        totalOrdersRound ++;
        orders.push(newOrder);

        emit OrderCreated(msg.sender, _amountACDM, _totalPriceForACDM, idOrder);
        idOrder++;
    }
    
    function closeOrders()private{
        for(uint256 i=0;i < totalOrdersRound; i++){
            orders[(totalOrders - totalOrdersRound) + i]._open = false;
            unlockBalance[orders[(totalOrders - totalOrdersRound) + i]._owner] = 0;
        }
        totalOrdersRound = 0;
    }

    /** @notice Buy ACDM tokens for ETH in trade Round.
        * @param _amountACDM Amount of tokens which the user wants to buy .
        * @param _idOrder id of buyable order.
  
    */
    function buyOrder(uint256 _idOrder, uint256 _amountACDM) external payable{
        require(_idOrder <= idOrder, "Order does not exist");
        require(orders[_idOrder]._balance >= _amountACDM, "Insufficent tokens");
        uint256 _price = (orders[_idOrder]._totalPriceForACDM * 10e6) / (orders[_idOrder]._totalAmountACDM * 10e6);
        uint256 priceForAmountACDM = (_amountACDM * (_price * 10e6)) / 10e6;
        require(priceForAmountACDM <= msg.value,"Insufficens funds");
        require(orders[idOrder]._open == true,"Order closed");

        balancesETH[orders[_idOrder]._owner] += priceForAmountACDM;
        payable(msg.sender).transfer(msg.value - priceForAmountACDM);
        
        rounds[numOfRound].tradingVolumeETH += priceForAmountACDM;
          
        balancesACDM[orders[_idOrder]._owner] -= _amountACDM * 10 ** decimal;
        balancesACDM[msg.sender] += _amountACDM * 10 ** decimal;
        
        orders[_idOrder]._balance -= _amountACDM;

        transferFee(priceForAmountACDM, refers[orders[_idOrder]._owner].firstRefer, 25);
        transferFee(priceForAmountACDM, refers[orders[_idOrder]._owner].secondRefer, 25);
        
        token.transferFrom(orders[_idOrder]._owner, msg.sender, _amountACDM* 10 ** decimal );
        
        emit OrderBought(orders[_idOrder]._owner, msg.sender, _amountACDM, priceForAmountACDM); 
    }

    /** @notice Calculate and set new price for next round.
    */
    function changePrice() private{
        price = ((price * 103) / 100) + 0.000004 ether; 
        emit PriceChanged(price);
    }

    // Sale round
    /** @notice Buy ACDM tokens for ETH in Sale Round.
        * @param _amountACDM Amount of tokens which the user wants to buy .
    */
    function buyACDMInSale(uint256 _amountACDM) external {
        uint256 priceForAmountACDM = (_amountACDM * price * 10e5) / 10e5;
        require(balancesACDM[address(this)] >= _amountACDM, "Insufficent tokens");
        require(rounds[numOfRound].saleOrTrade == false, "Not a sale round");
        require(balancesETH[msg.sender] >= priceForAmountACDM, "Insufficent funds");
          
        balancesETH[address(this)] += priceForAmountACDM;
        balancesETH[msg.sender] -= priceForAmountACDM;
        rounds[numOfRound].tradingVolumeETH += priceForAmountACDM;

        balancesACDM[address(this)] -= _amountACDM * 10 ** decimal;
        balancesACDM[msg.sender] += _amountACDM * 10 ** decimal;
        
        transferFee(priceForAmountACDM, refers[msg.sender].firstRefer, 50);
        transferFee(priceForAmountACDM, refers[msg.sender].secondRefer, 30);
        
        token.transferFrom(address(this), msg.sender, _amountACDM* 10 ** decimal );
        
        emit ACDMBought(msg.sender, _amountACDM, priceForAmountACDM, balancesACDM[address(this)]); 
    }
    
    /** @notice Calculate and transfer fee to refer in ETH.
        * @param _totalPrice Amount of tokens which the user wants to buy.
        * @param _to Address of refer.
        * @param _fee Percent of _totalPrice.
   
    */
    function transferFee(uint256 _totalPrice, address payable _to, uint256 _fee)private{
        uint256 feeOfRefer = (_totalPrice * _fee * 10e5) / 10e8;
        
        balancesETH[address(this)] -= feeOfRefer;
        balancesETH[_to] += feeOfRefer;

        emit FeeTransfered(_to, feeOfRefer);
    }

    /// @notice Getter for price variable
    /// @return price type uint256
    function getPrice() external view returns(uint256){
        return price;
    }

    /// @notice Return block.timestamp
    /// @return block.timestamp type uint256
    function getBlockTimeStamp() external view returns(uint256){
        return block.timestamp;
    }

    /// @notice Return balance of address in ETH
    /// @return balance type uint256
    function balanceOfETH(address _userAddress) external view returns(uint256 balance){
      return balancesETH[_userAddress];
    }
    
    /// @notice Return balance of address in ACDM
    /// @return balance type uint256
    function balanceOfACDM(address _userAddress) external view returns(uint256 balance){
      return balancesACDM[_userAddress];
    }


    /// @notice Getter for refers of address
    /// @return refers type
    function getRefer(address _user) external view returns(refer memory){
        return refers[_user];
    }

    /// @notice Getter for contract address
    /// @return address(this) type address
    function getTradingFloorAddress()external view returns(address){
        return address(this);
    }

    /** @notice Getter for mapping rounds
    */
    function getRound(uint256 _id)external view returns(round memory){
        return rounds[_id];
    }

    /** @notice Getter for orders array
    */
        function getOrder(uint256 _idOrder) external view returns(order memory){
        return orders[_idOrder];
    }

    /** @notice Getter for id orders array
    */
    function getIdOrder() external view returns(uint256){
        return idOrder;
    }

    event UserIsRegistrated(address indexed _user, address indexed _firstRefer, address indexed _secondRefer);
    event FeeTransfered(address indexed _to, uint256 _amount);
    event ACDMBought(
        address indexed buyer, 
        uint256 _amountACDM, 
        uint256 _PriceInETH, 
        uint256 ACDMLeft
    );
    event RoundStarted(bool _saleOrTrade, uint256 _totalSupply, uint256 _price);
    event OrderCreated(address indexed _owner, uint256 _amountACDM, uint256 _totalPriceForACDM, uint256 indexed idOrder);
    event OrderBought(address indexed _owner, address indexed _buyer,uint256 _amountACDM, uint256 _priceForAmountACDM); 
    event PriceChanged(uint256 _newPrice);
    event Withdraw(address indexed _to, uint256 _amount);
}
