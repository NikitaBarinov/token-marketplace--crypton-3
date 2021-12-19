// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Token/Token.sol";

contract DAO{
    Token private token;
    uint256 private proposalId = 0;
    address public chairPerson;
    address public voteToken;
    uint256 public minimumQuorum;
    uint256 public debatingPeriod;

    struct proposal{
        address recipient;
        bytes transactionByteCode;
        string description;
        uint256 endTime;
        uint256 totalVotes;
        uint256 totalVotesFor;
        bool open;
    } 

    mapping(address => mapping(uint256 => bool)) votes;
    mapping(address => uint256)  balances;
    mapping(uint256 => proposal) public proposals;
    mapping(address => uint256) public unlockBalance;
    
    constructor(
        address _chairPerson,
        address _voteToken,
        uint256 _minimumQuorum,
        uint256 _debatingPeriod
    ){
        chairPerson = _chairPerson;
        voteToken = _voteToken;
        minimumQuorum = _minimumQuorum;
        debatingPeriod = _debatingPeriod;
        token = Token(_voteToken);
    }

    modifier onliChairPerson {
        require(msg.sender == chairPerson,"You are not chair person");
        _;
    }

    modifier proposalNotClosed(uint256 _proposalId) {
        require(proposals[_proposalId].open == true, "Proposal already closed");
        _;
    }

    modifier proposalExist(uint256 _proposalId){
        require(proposalId > _proposalId,"Proposal does not exist");
        _;
    }

    modifier onlyTokenHolder(address _sender){
        require(balances[_sender] > 0,"Insufficens funds");
        _;
    }

    function deposit(uint256 _amount) public payable{
        token.transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender] += _amount;
        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external {
        require(unlockBalance[msg.sender] <= block.timestamp,"Balance still lock");
        balances[msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);

        emit Withdraw(msg.sender, _amount);
    }

    function addProposal(
        address _recipient,
        string memory _description,
        bytes memory _transactionByteCode
    ) external 
    onlyTokenHolder(msg.sender)
    {
        proposal memory _proposal;
        _proposal.recipient = _recipient;
        _proposal.transactionByteCode = _transactionByteCode;
        _proposal.description = _description;
        _proposal.totalVotes = 0;
        _proposal.totalVotesFor = 0;
        _proposal.endTime = block.timestamp + debatingPeriod;
        _proposal.open = true;

        proposals[proposalId] = _proposal;
        proposalId++;
        
        emit ProposalCreated(_recipient, _transactionByteCode, _description, _proposal.endTime);
    }

    function changeVotingRules(
        uint256 _minimumQuorum,
        uint256 _debatingPeriodDuration
    ) external 
    onliChairPerson
    {
        minimumQuorum = _minimumQuorum;
        debatingPeriod = _debatingPeriodDuration;

        emit VotingRulesChanged(minimumQuorum, debatingPeriod);
    }

    function vote(
        uint256 _proposalId,
        bool supportAgainst
    ) external 
    proposalExist(_proposalId)
    proposalNotClosed(_proposalId)
    onlyTokenHolder(msg.sender)
    {
        require(votes[msg.sender][_proposalId] != true, "You are already voted");
       
        votes[msg.sender][_proposalId] = true;
        
        if(supportAgainst == true){
            proposals[_proposalId].totalVotesFor += balances[msg.sender];
        }

        proposals[_proposalId].totalVotes += balances[msg.sender];
        unlockBalance[msg.sender] = block.timestamp + debatingPeriod;

        emit VoteCreated(msg.sender, _proposalId, balances[msg.sender], supportAgainst);
    }
    
    function finishVote(
        uint256 _proposalId
    ) external 
    proposalExist(_proposalId)
    proposalNotClosed(_proposalId) 
    returns(bool _success)
    {
        //require(proposals[proposalId].endTime >= block.timestamp,"Time for voting is not over");
        
        if(proposalPoll(_proposalId)){
            executeProposal(_proposalId);
            _success = true;           
        } else if(!proposalPoll(_proposalId)){
             
            _success = false;     
        }
        
        _closeProposal(_proposalId);

        emit ProposalFinished(
            _proposalId,
            proposals[_proposalId].transactionByteCode,
            proposals[_proposalId].description,
            _success   
        );

        return _success;
    }

    function proposalPoll(uint256 _proposalId) private view returns(bool _success){
        if(
            proposals[_proposalId].totalVotes >= minimumQuorum &&
            proposals[_proposalId].totalVotesFor > (minimumQuorum / 2) 
        ){
            return true;
        }

        return false;
    }

    function executeProposal(uint256 _proposalId) private returns(bool){
        (bool success, ) = proposals[_proposalId].recipient.call(proposals[_proposalId].transactionByteCode);
        return success;
    }

    function _closeProposal(uint256 _proposalId) private returns(bool){
        proposals[_proposalId].open = false;
        emit ProposalClosed(proposalId);
        return true;
    }

    function getVote(address _voter, uint256 _proposalId) external view returns(bool){
        return votes[_voter][_proposalId];
    }

    function balanceOf(address _owner) external view returns(uint256 balance){
      return balances[_owner];
    }
    
    function getProposal(uint256 _proposalId) external view returns(proposal memory){
        return proposals[_proposalId];
    }

    function getUnlockBalance(address _owner) external view returns(uint256){
        return unlockBalance[_owner];
    }

    function getBlockTimeStamp() external view returns(uint256){
        return block.timestamp;
    }

    event ProposalCreated(address proposer,
        bytes sygnHash,
        string description,
        uint256 votingTimer
    );

    event ProposalFinished(
            uint256 _proposalId,
            bytes _transactionByteCode,
            string _description,
            bool _success   
    );

    event ProposalClosed(uint256 proposalId);

    event VotingRulesChanged(uint256 _minimumQuorum, uint256 _debatingPeriod);

    event Deposit(address sender, uint256 _amount);

    event Withdraw(address sender, uint256 _amount);

    event VoteCreated(address _voter, uint256 proposalId, uint256 _amount, bool _forAgainst);
}