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
   // uint256 public totalAmountOfTokensLeftInThisRound;
    uint256 decimal;

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


    mapping(uint256 => round) rounds;
    mapping(address => uint256)  balancesETH;
    mapping(address => uint256)  balancesACDM;
    mapping(address => refer) refers;
    
    constructor(address _voteToken){
        token = ACDM(_voteToken);
        price = 0.00001 ether;
        numOfRound = 0;
        
        // totalSupplyACDM = balancesACDM[address(this)];
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

        token.burn(balancesACDM[address(this)]);
        balancesACDM[address(this)] -= balancesACDM[address(this)];
        changePrice();
        uint256 totalSupplyForMint = ((rounds[numOfRound].tradingVolumeETH * 10e6) / (price * 10e6));
        
        token.mint(address(this), totalSupplyForMint);
        token.approve(address(this), totalSupplyForMint);

        balancesACDM[address(this)] = totalSupplyForMint;
        
        
        numOfRound++;
        startRound(totalSupplyForMint);

    }

    /** @notice Start new round.
    * @param _totalSupply of tokens in new round.
    */
    function startRound(uint256 _totalSupply) private {
        rounds[numOfRound].finishTime = block.timestamp + roundTime;
        rounds[numOfRound].totalSupply = _totalSupply;
        rounds[numOfRound].tradingVolumeETH = 0;

        if (rounds[numOfRound - 1].saleOrTrade == true){
            rounds[numOfRound].saleOrTrade = false;
        } else if(rounds[numOfRound - 1].saleOrTrade == false){
            rounds[numOfRound].saleOrTrade = true;
        }

        emit RoundStarted(rounds[numOfRound].saleOrTrade, rounds[numOfRound].totalSupply, price);
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
        uint256 priceForAmountACDM = (_amountACDM * (price * 10e6)) / 10e6;
        require(rounds[numOfRound].saleOrTrade == false, "Not a sale round");
        require(balancesETH[msg.sender] >= priceForAmountACDM, "Insufficent funds");
        require(balancesACDM[address(this)] >= _amountACDM, "Insufficent tokens");
   
        balancesETH[address(this)] += priceForAmountACDM;
        balancesETH[msg.sender] -= priceForAmountACDM;
        rounds[numOfRound].tradingVolumeETH += priceForAmountACDM;

        balancesACDM[address(this)] -= _amountACDM * 10 ** decimal;
        balancesACDM[msg.sender] += _amountACDM * 10 ** decimal;

        transferFee(priceForAmountACDM, refers[msg.sender].firstRefer, 5);
        transferFee(priceForAmountACDM, refers[msg.sender].secondRefer, 3);
        
        token.transferFrom(address(this), msg.sender, _amountACDM* 10 ** decimal );
        
        emit ACDMBought(msg.sender, _amountACDM, priceForAmountACDM, balancesACDM[address(this)]); 
    }

    // /** @notice Calculate the total amount of ETH for ACDM.
    //     * @param _amountACDM Amount of tokens which the user wants to buy .
    //     * @return _priceETH Total price for ACDM in ETH
    // */
    // function priceForACDM(uint256 _amountACDM) private view returns(uint256){
    //     return (_amountACDM * (price * 10e6)) / 10e6;
    // } 
    
    /** @notice Calculate and transfer fee to refer in ETH.
        * @param _totalPrice Amount of tokens which the user wants to buy.
        * @param _to Address of refer.
        * @param _fee Percent of _totalPrice.
   
    */
    function transferFee(uint256 _totalPrice, address payable _to, uint256 _fee)private{
        uint256 feeOfRefer = (_totalPrice * _fee * 10e6) / 10e8;
        
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

    event UserIsRegistrated(address _user, address _firstRefer, address _secondRefer);

    event FeeTransfered(address _to, uint256 _amount);
    
    event ACDMBought(
        address buyer, 
        uint256 _amountACDM, 
        uint256 _PriceInETH, 
        uint256 ACDMLeft
    );

    event RoundStarted(bool _saleOrTrade, uint256 _totalSupply, uint256 _price);
    //event BalancesChanged(address _from, address _to, uint256 _amount);
   
    event PriceChanged(uint256 _newPrice);
}


 // function changeBalancesETH(address _from, address _to, uint256 _amount) private{
    //     balancesETH[_from] -= _amount;
    //     balancesETH[_to] += _amount;
    //     emit BalancesChanged(_from, _to, _amount);
    // }

  // function transferFromACDM(address _from, address _to, uint256 _amount) public returns(bool) {
    //     token.approve(address(this), _amount);
    //     balancesACDM[_from] -= _amount * 10 ** decimal;
    //     balancesACDM[_to] += _amount * 10 ** decimal;
        
        
    //     token.transferFrom(address(this), _to, _amount);
    //     return true;
    // }



// contract DAO{
//     Token private token;
//     uint256 private proposalId = 0;
//     address public chairPerson;
//     address public voteToken;
//     uint256 public minimumQuorum;
//     uint256 public debatingPeriod;
//     enum checkVote{
//         notVote,
//         voted,
//         delegated
//     }

//     struct proposal{
//         address recipient;
//         bytes transactionByteCode;
//         string description;
//         uint256 endTime;
//         uint256 totalVotes;
//         uint256 totalVotesFor;
//         bool open;
//     } 

//     mapping(address => uint256)  balances;
//     mapping(uint256 => proposal) public proposals;
//     mapping(address => uint256) public unlockBalance;
//     mapping(address => mapping(uint256 => address[])) public delegates;
//     mapping(uint256 => mapping(address => checkVote)) public checkVoting;
    

//     /** @notice Create Dao.
//       * @param _chairPerson The perrson who will administrate dao.
//       * @param _voteToken address of voting token.
//       * @param _minimumQuorum minimum quantiti of tokens for successful proposal.
//       * @param _debatingPeriod Period for voting.
//     */
//     constructor(
//         address _chairPerson,
//         address _voteToken,
//         uint256 _minimumQuorum,
//         uint256 _debatingPeriod
//     ){
//         chairPerson = _chairPerson;
//         voteToken = _voteToken;
//         minimumQuorum = _minimumQuorum;
//         debatingPeriod = _debatingPeriod;
//         token = Token(_voteToken);
//     }

//     modifier onliChairPerson {
//         require(msg.sender == chairPerson,"You are not chair person");
//         _;
//     }

//     modifier proposalNotClosed(uint256 _proposalId) {
//         require(proposals[_proposalId].open == true, "Proposal already closed");
//         _;
//     }

//     modifier proposalExist(uint256 _proposalId){
//         require(proposalId > _proposalId,"Proposal does not exist");
//         _;
//     }

//     modifier onlyTokenHolder(address _sender){
//         require(balances[_sender] > 0,"Insufficens funds");
//         _;
//     }

//     /** @notice Deposit token from token address.
//       * @param _amount Amount of deposit tokens.
//     */
//     function deposit(uint256 _amount) public payable{
//         token.transferFrom(msg.sender, address(this), _amount);
//         balances[msg.sender] += _amount;
//         emit Deposit(msg.sender, _amount);
//     }

//     function delegate(uint256 _proposalId, address _delegat) 
//     external
//     proposalExist(_proposalId)
//     proposalNotClosed(_proposalId)
//     onlyTokenHolder(msg.sender)
//     {
//         delegates[_delegat][_proposalId].push(msg.sender);
//         checkVoting[_proposalId][msg.sender] = checkVote.delegated;
//         emit Delegate(msg.sender, _delegat, _proposalId); 
//     }

//     /** @notice Withdraw token to token address.
//       * @param _amount Amount of withdrawing tokens.
//     */
//     function withdraw(uint256 _amount) external {
//         require(unlockBalance[msg.sender] <= block.timestamp,"Balance still lock");
//         balances[msg.sender] -= _amount;
//         token.transfer(msg.sender, _amount);

//         emit Withdraw(msg.sender, _amount);
//     }

//     /** @notice Add proposal and start voting.
//       * @param _recipient Address of token there send transactionbytecode.
//       * @param _description Description of proposal.
//       * @param _transactionByteCode Bytecode of sending transaction.
//     */
//     function addProposal(
//         address _recipient,
//         string memory _description,
//         bytes memory _transactionByteCode
//     ) external 
//     onlyTokenHolder(msg.sender)
//     {
//         proposal memory _proposal;
//         _proposal.recipient = _recipient;
//         _proposal.transactionByteCode = _transactionByteCode;
//         _proposal.description = _description;
//         _proposal.totalVotes = 0;
//         _proposal.totalVotesFor = 0;
//         _proposal.endTime = block.timestamp + debatingPeriod;
//         _proposal.open = true;

//         proposals[proposalId] = _proposal;
//         proposalId++;
        
//         emit ProposalCreated(_recipient, _transactionByteCode, _description, _proposal.endTime);
//     }

//     /** @notice Change voting rules.
//       * @param _minimumQuorum Minimum quantiti of tokens for successful proposal.
//       * @param _debatingPeriodDuration Period of time for voting.
//     */  
//     function changeVotingRules(
//         uint256 _minimumQuorum,
//         uint256 _debatingPeriodDuration
//     ) external 
//     onliChairPerson
//     {
//         minimumQuorum = _minimumQuorum;
//         debatingPeriod = _debatingPeriodDuration;

//         emit VotingRulesChanged(minimumQuorum, debatingPeriod);
//     }

//     /** @notice Takes vote from address and lock balance of address.
//       * @param _proposalId Id of the calling proposal.
//       * @param supportAgainst Vote for or against.
//     */  
//     function vote(
//         uint256 _proposalId,
//         bool supportAgainst
//     ) external 
//     proposalExist(_proposalId)
//     proposalNotClosed(_proposalId)
//     onlyTokenHolder(msg.sender)
//     {
//         require(checkVoting[_proposalId][msg.sender] == checkVote.notVote, "You are already voted");
    
//         if(supportAgainst == true){
//             proposals[_proposalId].totalVotesFor += sumOfBalances(msg.sender, _proposalId);
//         }

//         checkVoting[_proposalId][msg.sender] = checkVote.voted;
//         proposals[_proposalId].totalVotes += sumOfBalances(msg.sender, _proposalId);
//         unlockBalance[msg.sender] = block.timestamp + debatingPeriod;

//         emit VoteCreated(msg.sender, _proposalId, balances[msg.sender], supportAgainst);
//     }

//      function sumOfBalances(address _sender, uint256 _proposalId) private view returns(uint256){
//         uint256 _sum = balances[_sender];
//         for(uint256 i = 0; i < delegates[msg.sender][_proposalId].length; i++){
//             _sum += balances[delegates[_sender][_proposalId][i]];
//         }
//         return _sum;
//     }

//     /** @notice Finish proposal and close it.
//       * @param _proposalId Id of the calling proposal.
//       * @return _success true if proposal successfull execute, false if not.
//     */  
//     function finishVote(
//         uint256 _proposalId
//     ) external 
//     proposalExist(_proposalId)
//     proposalNotClosed(_proposalId) 
//     returns(bool _success)
//     {
//         require(proposals[proposalId].endTime < block.timestamp,"Time for voting is not over");
        
//         if(proposalPoll(_proposalId)){
//             executeProposal(_proposalId);
//             _success = true;           
//         } else if(!proposalPoll(_proposalId)){
             
//             _success = false;     
//         }
        
//         _closeProposal(_proposalId);

//         emit ProposalFinished(
//             _proposalId,
//             proposals[_proposalId].transactionByteCode,
//             proposals[_proposalId].description,
//             _success   
//         );

//         return _success;
//     }

//     /** @notice Decides on proposal.
//       * @param _proposalId Id of the calling proposal.
//       * @return _success true if proposal successfull< false if not.
//     */
//     function proposalPoll(uint256 _proposalId) private view returns(bool _success){
//         if(
//             proposals[_proposalId].totalVotes >= minimumQuorum &&
//             proposals[_proposalId].totalVotesFor > (minimumQuorum / 2) 
//         ){
//             return true;
//         }
//         return false;
//     }

//     /** @notice Execute successful proposal.
//       * @param _proposalId Id of the calling proposal.
//       * @return success Status of executing proposal.
//     */
//     function executeProposal(uint256 _proposalId) private returns(bool){
//         (bool success, ) = proposals[_proposalId].recipient.call(proposals[_proposalId].transactionByteCode);
//         return success;
//     }

//     /** @notice Close proposal.
//       * @param _proposalId Id of the closing proposal.
//       * @return true Status of closing proposal.
//     */
//     function _closeProposal(uint256 _proposalId) private returns(bool){
//         proposals[_proposalId].open = false;
//         emit ProposalClosed(proposalId);
//         return true;
//     }

//     /// @notice Return which option is the vote 
//     /// @return checkVoting[_proposalId][_voter] type uint
//     function getVote(address _voter, uint256 _proposalId) external view returns(uint256){
//         return uint(checkVoting[_proposalId][_voter]);
//     }

//     /// @notice Return addresses who delegate tokens to msg.sender 
//     /// @return delegates[_voter][_proposalId] type address
//     function getDelegate(address _voter, uint256 _proposalId) external view returns(address[] memory){
//         return delegates[_voter][_proposalId];
//     }

//     /// @notice Return balance of address
//     /// @return balance type uint256
//     function balanceOf(address _owner) external view returns(uint256 balance){
//       return balances[_owner];
//     }
    
//     /// @notice Return struct proposal
//     /// @return proposals[_proposalId] type proposal
//     function getProposal(uint256 _proposalId) external view returns(proposal memory){
//         return proposals[_proposalId];
//     }

//     /// @notice Return time then balance will be unlicked
//     /// @return unlockBalance[_owner] type uint256
//     function getUnlockBalance(address _owner) external view returns(uint256){
//         return unlockBalance[_owner];
//     }

//     /// @notice Return block.timestamp
//     /// @return block.timestamp type uint256
//     function getBlockTimeStamp() external view returns(uint256){
//         return block.timestamp;
//     }

//     event ProposalCreated(address proposer,
//         bytes sygnHash,
//         string description,
//         uint256 votingTimer
//     );

//     event ProposalFinished(
//             uint256 _proposalId,
//             bytes _transactionByteCode,
//             string _description,
//             bool _success   
//     );

//     event ProposalClosed(uint256 proposalId);

//     event VotingRulesChanged(uint256 _minimumQuorum, uint256 _debatingPeriod);

//     event Deposit(address sender, uint256 _amount);

//     event Withdraw(address sender, uint256 _amount);
    
//     event Delegate(address _from, address _to, uint256 _proposalId);

//     event VoteCreated(address _voter, uint256 proposalId, uint256 _amount, bool _forAgainst);
// }