pragma solidity >0.4.17;

import "./Project.sol";

contract ProjectList {
	using SafeMath for uint;
	address[] public projects;
	
	function createProject(string memory _description, uint _minInvest, uint _maxInvest, uint _goal) public {
		address newProject = new Project(msg.sender, _description, _minInvest, _maxInvest, _goal);
		projects.push(newProject);
	}
	
	function getProjects() public view returns (address[]) {
		return projects;
	}
}
