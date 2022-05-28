pragma solidity ^0.8.0;

contract BallotWithModifier {

    struct Voter {
        uint weight;
        bool voted;
        uint8 vote;
        address delegate;
    }
    struct Proposal {
        uint voteCount;
    }
    enum Stage {Init,Reg, Vote, Done}
    Stage public stage = Stage.Init;
    
    address chairperson;
    mapping(address => Voter) voters;
    // Proposal[] proposals;
    uint[] proposals;

    event votingCompleted();
    
    uint startTime;
    //modifiers
   modifier validStage(Stage reqStage)
    { require(stage == reqStage);
      _;
    }


    /// Create a new ballot with $(_numProposals) different proposals.
    function ballot(uint8 _numProposals) public  {
        chairperson = msg.sender;
        voters[chairperson].weight = 2; // weight is 2 for testing purposes
        proposals.push(_numProposals);
        stage = Stage.Reg;
        startTime = block.timestamp;
    }

    /// Give $(toVoter) the right to vote on this ballot.
    /// May only be called by $(chairperson).
    function register(address toVoter) public validStage(Stage.Reg) {
        //if (stage != Stage.Reg) {return;}
        if (msg.sender != chairperson || voters[toVoter].voted) return;
        voters[toVoter].weight = 1;
        voters[toVoter].voted = false;
        if (block.timestamp > (startTime+ 30 seconds)) {stage = Stage.Vote; }        
    }

    /// Give a single vote to proposal $(toProposal).
    function vote(uint8 toProposal) public validStage(Stage.Vote)  {
       // if (stage != Stage.Vote) {return;}
        Voter storage sender = voters[msg.sender];
        if (sender.voted || toProposal >= proposals.length) return;
        sender.voted = true;
        sender.vote = toProposal;   
        proposals[toProposal] += sender.weight;
        if (block.timestamp > (startTime+ 30 seconds)) {stage = Stage.Done;}        
        
    }

    function winningProposal() public view validStage(Stage.Done) returns (uint8 _winningProposal) {
       //if(stage != Stage.Done) {return;}
        uint256 winningVoteCount = 0;
        // TODO: check if this is correct
        for (uint8 prop = 0; prop < proposals.length; prop++)
            if (proposals[prop] > winningVoteCount) {
                winningVoteCount = proposals[prop];
                _winningProposal = prop;
            }
       assert (winningVoteCount > 0);

    }
}



