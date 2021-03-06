// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./ACDM/ACDM.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
/**@title pyramid contract */

contract TradingFloor is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    //Time of the round 
    uint256 constant roundTime = 3 * 24 * 3600;
    ACDM private token;

    //Number of round whith is going now
    uint256 public numOfRound;

    //Price in sale round
    uint256 private price;
    
    //Max order id
    uint256 private idOrder = 0;
    
    //Amount of orders in round 
    uint256 totalOrdersRound;

    //Amount of orders in all time
    uint256 totalOrders;

    //Emitted when user registered refer
    event UserIsRegistrated(address indexed _user, address indexed _refer);
    
    //Emitted when contract send fee in ETH to refer
    event FeeTransfered(address indexed _to, uint256 _amount);
    
    //Emitted when buyer buy amount of ACDM token
    event ACDMBought(
        address indexed buyer, 
        uint256 _amountACDM, 
        uint256 _PriceInETH
    );
    
    //Emitted when started new round 
    event RoundStarted(bool _saleOrTrade, uint256 _totalSupply, uint256 _price);
    
    //Emitted when created new order
    event OrderCreated(address indexed _owner, uint256 _amountACDM, uint256 _totalPriceForACDM, uint256 indexed idOrder);
    
    //Emitted when buyer buy tokens in owner's order
    event OrderBought(address indexed _owner, address indexed _buyer,uint256 _amountACDM, uint256 _priceForAmountACDM); 
    
    //Emitted when price change
    event PriceChanged(uint256 _newPrice);
    
    //Emitted when owner withdraw ETH from account 
    event Withdraw(address indexed _to, uint256 _amount);
    
    //Emitted when order cancelled
    event OrderCancelled(uint256 _numOfRound, uint256 _id, address _owner );

    struct round{
        uint256 totalSupply;
        uint256 finishTime;
        uint256 tradingVolumeETH;
        bool saleOrTrade;//sale false trade true
    }

    struct order{
        address owner;
        uint256 numRound;
        uint256 balance;
        uint256 totalAmountACDM;
        uint256 totalPriceForACDM;
        bool open;
    }

    mapping(uint256 => round) rounds; //roundId => round
    mapping(address => address) refers; //referal => referer
    mapping(uint256 => order[]) orders; //roundId => orders[]
    
    constructor(address _voteToken){
        token = ACDM(_voteToken);
        price = 0.00001 ether;
        numOfRound = 0;
    }

    /** @notice Initialize contract and start first round.
    * @dev Available only to admin
    */
    function tradingFloorInit() external onlyOwner{
        token.mint(address(this), 100000);
        token.approve(address(this), 100000);

        rounds[numOfRound].finishTime = block.timestamp + roundTime;
        rounds[numOfRound].totalSupply = 100000;
        rounds[numOfRound].tradingVolumeETH = 0;
        rounds[numOfRound].saleOrTrade = false;
        totalOrdersRound = 0;
        totalOrders = 0;
    }
    
    /** @notice Unpausing functions of contract.
    * @dev Available only to admin
    * Allows calls to functions with `whenNotPaused` modifier.
    */
    function unpause() external onlyOwner {
    _unpause();
    }

    /** @notice Pausing some functions of contract.
    * @dev Available only to owner.
    * Prevents calls to functions with `whenNotPaused` modifier.
    */
    function pause() external onlyOwner {
        _pause();
    }

    /** @notice Register user in contract.
    * @param _refer Address of first refer.
    * Allows calls to functions with `whenNotPaused` modifier.
    */
    function registration (
        address _refer
    ) external 
    whenNotPaused
    returns(bool _success){
        require(_refer != msg.sender, "Can not be self-referer");
            
        refers[msg.sender] = _refer;
        
        emit UserIsRegistrated(msg.sender, refers[msg.sender]);
        return true;
    }

    /** @notice Withdraw token from token address.
    * @dev Available only to owner.
    * @param _amount Amount of withdrawing tokens.
    * Prevents calls to functions with `whenNotPaused` modifier.
    */
    function withdraw(address _to, uint256 _amount) external onlyOwner whenNotPaused{
        sendEther(_to, _amount);
    
        emit Withdraw(msg.sender, _amount);
    }

    /** @notice Finish round and start new, if time to finish end or all tokens saled.
    * Prevents calls to functions with `whenNotPaused` modifier.
    */
    function finishRound() external whenNotPaused {
        require(
            rounds[numOfRound].finishTime <= block.timestamp,
            "Round can not be closed");
    
        numOfRound++;
        startRound();
    }


    /** @notice Starts new round.
    * @dev If previous round was sale, starts trade round.
    * @dev If previous round was trade, starts sale round.
    */
    function startRound() private returns(bool) {
        rounds[numOfRound].finishTime = block.timestamp + roundTime;
        if (rounds[numOfRound - 1].saleOrTrade == true){  
            changePrice();
            closeOrders();
            rounds[numOfRound].saleOrTrade = false;
            token.burn(balanceOfACDM(address(this)));
             
            uint256 totalSupplyForMint = ((rounds[numOfRound - 1].tradingVolumeETH * 10e6) / (price * 10e6)); 
      
            token.mint(address(this), totalSupplyForMint);
            token.approve(address(this), totalSupplyForMint);

            rounds[numOfRound].totalSupply = totalSupplyForMint;
            
            emit RoundStarted(rounds[numOfRound].saleOrTrade, rounds[numOfRound].totalSupply, price);

            return true;

        } else if(rounds[numOfRound - 1].saleOrTrade == false){
            
            rounds[numOfRound].totalSupply = 0;
            rounds[numOfRound].saleOrTrade = true;
            rounds[numOfRound].tradingVolumeETH = 0;
            
            emit RoundStarted(rounds[numOfRound].saleOrTrade, rounds[numOfRound].totalSupply, price);
            return true;
        } 
        return false;       
    }

    /** @notice Add order for buy tokens for ETH in trade round.
        * @param _amountACDM Amount of tokens which the user wants to buy .
        * @param _totalPriceForACDM total price that sender want for all ACDM.
        * Prevents calls to functions with `whenNotPaused` modifier.
    */
    function addOrder(uint256 _totalPriceForACDM, uint256 _amountACDM) external whenNotPaused{
        require(rounds[numOfRound].saleOrTrade == true, "Not a trade round");
        require(balanceOfACDM(msg.sender) >= _amountACDM, "Insufficent tokens");
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), _amountACDM);
        
        order memory newOrder; 
        newOrder.owner = msg.sender;
        newOrder.totalAmountACDM = _amountACDM;
        newOrder.totalPriceForACDM = _totalPriceForACDM;
        newOrder.balance = _amountACDM;
        newOrder.numRound = numOfRound;
        newOrder.open = true;
        totalOrdersRound ++;
        orders[numOfRound].push(newOrder);
        
        emit OrderCreated(msg.sender, _amountACDM, _totalPriceForACDM, idOrder);
        idOrder++;
    }

    /** @notice Buy ACDM tokens for ETH in trade Round.
        * @param _amountACDM Amount of tokens which the user wants to buy .
        * @param _idOrder id of buyable order.
        * Prevents calls to functions with `whenNotPaused` modifier.
    */
    function buyOrder(
        uint256 _idOrder,
        uint256 _amountACDM
        ) external 
        payable 
        whenNotPaused
        nonReentrant
    {
        require(_idOrder <= idOrder, "Order does not exist");
        require(orders[numOfRound][_idOrder].open == true,"Order closed");
        require(orders[numOfRound][_idOrder].balance >= _amountACDM, "Insufficent tokens");
        
        uint256 _price = (orders[numOfRound][_idOrder].totalPriceForACDM * 10e6) / (orders[numOfRound][_idOrder].totalAmountACDM * 10e6);
        uint256 priceForAmountACDM = (_amountACDM * (_price * 10e6)) / 10e6;
        
        require(priceForAmountACDM <= msg.value,"Insufficens funds");
      
        sendEther(msg.sender, msg.value - priceForAmountACDM);
       
        rounds[numOfRound].tradingVolumeETH += priceForAmountACDM;
        orders[numOfRound][_idOrder].balance -= _amountACDM;

        transferFee(priceForAmountACDM, refers[orders[numOfRound][_idOrder].owner], 25);
        transferFee(priceForAmountACDM, refers[refers[orders[numOfRound][_idOrder].owner]], 25);
        
        IERC20(token).safeTransfer(msg.sender, _amountACDM);
        
        emit OrderBought(orders[numOfRound][_idOrder].owner, msg.sender, _amountACDM, priceForAmountACDM); 
    }

    /** @notice Calculate and set new price for next round.
    */
    function changePrice() private{
        price = ((price * 1030000) / 1000000) + 0.000004 ether; 
        
        emit PriceChanged(price);
    }

    // Sale round
    /** @notice Buy ACDM tokens for ETH in Sale Round.
        * @param _amountACDM Amount of tokens which the user wants to buy .
    */
    function buyACDMInSale(uint256 _amountACDM) external payable nonReentrant whenNotPaused {
        uint256 priceForAmountACDM = (_amountACDM * price * 10e5) / 10e5;
        require(rounds[numOfRound].saleOrTrade == false, "Not a sale round");
        require(msg.value >= priceForAmountACDM, "Insufficent funds");
         
        rounds[numOfRound].tradingVolumeETH += priceForAmountACDM;

        transferFee(priceForAmountACDM, refers[msg.sender], 50);
        transferFee(priceForAmountACDM, refers[refers[msg.sender]], 30);
        
        sendEther(msg.sender, msg.value - priceForAmountACDM);

        IERC20(token).safeTransferFrom(address(this), msg.sender, _amountACDM);
        
        emit ACDMBought(msg.sender, _amountACDM, priceForAmountACDM); 
    }
    
    /** @notice Calculate and transfer fee to refer in ETH.
        * @param _totalPrice Amount of tokens which the user wants to buy.
        * @param _to Address of refer.
        * @param _fee Percent of _totalPrice.
   
    */
    function transferFee(uint256 _totalPrice, address _to, uint256 _fee)private{
        address _send;
        _send = _to;
        if(_to != address(0)){
            uint256 feeOfRefer = (_totalPrice * _fee * 10e5) / 10e8;
            sendEther(_send, feeOfRefer);
            emit FeeTransfered(_to, feeOfRefer);
        } 
    }

    /** @notice Cancel choicen order by the order owner, opened in round.  
    */
    function cancelOrder(uint256 _id) external {
        order memory choisenOrder = orders[numOfRound][_id];
        require(choisenOrder.owner == msg.sender,"Not order owner");
        require(choisenOrder.open == true,"Order already closed");
        
        orders[numOfRound][_id].balance = 0;
        _cancelOrder(choisenOrder, _id);
    }

    /** @notice Cancel choicen order opened in round.  
    */
    function _cancelOrder(order memory _choisenOrder, uint256 _id) private{
        _choisenOrder.open = false;
        if (_choisenOrder.balance > 0) IERC20(token).safeTransfer(_choisenOrder.owner, _choisenOrder.balance);
        _choisenOrder.balance = 0;
        orders[numOfRound][_id] = _choisenOrder;

        emit OrderCancelled(numOfRound, _id, orders[numOfRound][_id].owner);
    }

    /** @notice Close all orders opened in round.  
    */ 
    function closeOrders()private{
        uint256 lenght = totalOrdersRound;
        uint256 idStartOrdersRound = totalOrders - totalOrdersRound;
        for(uint256 i=0;i < lenght; i++){
            _cancelOrder(orders[numOfRound][idStartOrdersRound + i],idStartOrdersRound + i);
        }
        totalOrdersRound = 0;
    }

    /** @notice Sends `amount` of ether to `account`.
    * @dev We use `call()` instead of `send()` & `transfer()` because 
    * they take a hard dependency on gas costs by forwarding a fixed 
    * amount of gas: 2300 which may not be enough
    * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/
    *
    * @param account The address to send ether to.
    * @param amount The amount of ether.
    */
    function sendEther(address account, uint256 amount) private {
        (bool sent,) = account.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    /// @notice Getter for price variable
    /// @return price type uint256
    function getPrice() external view returns(uint256){
        return price;
    }

    /// @notice Return balance of address in ACDM
    /// @return balance type uint256
    function balanceOfACDM(address _userAddress) public view returns(uint256){
      uint256 _balance = token.balanceOf(_userAddress);
      return _balance;
    }

    /// @notice Getter for refers of address
    /// @return refers type
    function getRefer(address _user) external view returns(address){
        return refers[_user];
    }

    /// @notice Getter for contract address
    /// @return address(this) type address
    function getTradingFloorAddress() external view returns(address){
        return address(this);
    }

    /** @notice Getter for mapping rounds
    /// @return rounds[id] type round
    */
    function getRound(uint256 _id)external view returns(round memory){
        return rounds[_id];
    }

    /** @notice Getter for orders array
    /// @return order by round number and idOrder 
    */
    function getOrder(uint256 _numOfRound,uint256 _idOrder) external view returns(order memory){
        return orders[_numOfRound][_idOrder];
    }

    /** @notice Getter for id orders array
    /// @return idOrder max id 
    */
    function getIdOrder() external view returns(uint256){
        return idOrder;
    }
}