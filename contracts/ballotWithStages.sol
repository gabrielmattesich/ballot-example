pragma solidity ^0.8.0;

contract BallotWithStages {

    struct Voter {
        uint weight;
        bool voted;
        uint8 vote;
    }
    // struct Proposal {
    //     uint  voteCount;
    // }
    enum Stage {Init,Reg, Vote, Done}
    Stage public stage = Stage.Init;
    
    address chairperson;
    mapping(address => Voter) voters;
    // Proposal[] proposals;
    uint[] proposals;

    
    uint startTime;   

    /// Create a new ballot with $(_numProposals) different proposals.
    function ballot(uint8 _numProposals) public {
        chairperson = msg.sender;
        voters[chairperson].weight = 2; // weight is 2 for testing purposes
        proposals.push(_numProposals);
        stage = Stage.Reg;
        startTime = block.timestamp;
    }

    /// Give $(toVoter) the right to vote on this ballot.
    /// May only be called by $(chairperson).
    function register(address toVoter) public {
        if (stage != Stage.Reg) {return;}
        if (msg.sender != chairperson || voters[toVoter].voted) return;
        voters[toVoter].weight = 1;
        voters[toVoter].voted = false;
        if (block.timestamp > (startTime+ 10 seconds)) {stage = Stage.Vote; startTime = block.timestamp;}        
    }

    /// Give a single vote to proposal $(toProposal).
    function vote(uint8 toProposal) public  {
        if (stage != Stage.Vote) {return;}
        Voter storage sender = voters[msg.sender];
        if (sender.voted || toProposal >= proposals.length) return;
        sender.voted = true;
        sender.vote = toProposal;   
        // TODO: check if this is correct
        // proposals[toProposal].voteCount += sender.weight;
        proposals[toProposal] += sender.weight;
        if (block.timestamp > (startTime+ 10 seconds)) {stage = Stage.Done;}        
        
    }

    function winningProposal() public view returns (uint8 _winningProposal) {
       if(stage != Stage.Done) {return 1;}
        uint256 winningVoteCount = 0;
        for (uint8 prop = 0; prop < proposals.length; prop++)
            if (proposals[prop] > winningVoteCount) {
                winningVoteCount = proposals[prop];
                _winningProposal = prop;
            }
       
    }
}
