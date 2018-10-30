pragma solidity >0.4.22;

contract Voting {
    mapping(bytes32=>uint8) public votesReceived;
    bytes32[] public candidateList;

    constructor(bytes32[] memory candidateListNames)public{
        candidateList = candidateListNames;
    }

    function validateCandidate(bytes32 candidateName) internal view returns(bool){
        for( uint8 i = 0;i<candidateList.length;i++){
            if (candidateName==candidateList[i])
                return true;
        }
        return false;
    }

    function vote(bytes32 candidateName) public {
        require(validateCandidate(candidateName));
        votesReceived[candidateName] += 1;
    }

    function totalVotesFor(bytes32 candidateName) public view returns(uint8){
        require(validateCandidate(candidateName));
        return votesReceived[candidateName];
    }
}
