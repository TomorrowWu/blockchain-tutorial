pragma solidity >0.4.17;

/**
* @title SafeMath
* @dev Math operations with safety checks that throw on error
*/
library SafeMath {
	function mul(uint a, uint b) internal pure returns (uint) {
		uint c = a * b;
		assert(a == 0 || c / a == b);
		return c;
	}
	
	function div(uint a, uint b) internal pure returns (uint) {
		// assert(b > 0); // Solidity automatically throws when dividing by 0
		uint c = a / b;
		// assert(a == b * c + a % b); // There is no case in which this doesn't hold
		return c;
	}
	
	function sub(uint a, uint b) internal pure returns (uint) {
		assert(b <= a);
		return a - b;
	}
	
	function add(uint a, uint b) internal pure returns (uint) {
		//溢出后c会比a小
		uint c = a + b;
		assert(c >= a);
		return c;
	}
}


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

contract Project {
	using SafeMath for uint;
	struct Payment {
		string description; //资金用途
		uint amount; //支出金额
		address receiver; //收款方
		bool completed; //状态，标明该笔支出是否已经完成
		//		address[] voters; //投票记录
		mapping(address => bool) voters; //投票记录(数组中查需要遍历，map为O(1))
		uint voterCount;
	}
	
	address public owner; //所有者，即发起项目的人
	string public description; //项目名称
	uint public minInvest; //最小投资金额
	uint public maxInvest; //最大投资金额
	uint public goal; //融资上限，即设定项目的融资目标
	//	address[] public investors; //投资人列表
	mapping(address => uint) public investors;
	uint public investorCount;
	
	Payment[] public payments; //资金支出列表
	
	//函数修饰器，只有符合条件的用户才能调用函数
	modifier ownerOnly(){
		require(msg.sender == owner, "Message sender must be owner.");
		//占位符
		_;
	}
	
	constructor(address _owner, string memory _description, uint _minInvest, uint _maxInvest, uint _goal) public {
		//		owner = msg.sender;
		owner = _owner;
		description = _description;
		minInvest = _minInvest;
		maxInvest = _maxInvest;
		goal = _goal;
	}
	
	//投资人参与众筹
	function contribute() public payable {
		require(msg.value >= minInvest);
		//避免单个投资人投入金额过大
		require(msg.value <= maxInvest);
		//累计金额达到这个目标，就不再接受新的投资
		//require(address(this).balance + msg.value <= goal);
		uint newBalance = 0;
		newBalance = address(this).balance.add(msg.value);
		require(newBalance <= goal, "Total amount should not exceed goal.");
		//		investors.push(msg.sender);
		investors[msg.sender] = msg.value;
		investorCount += 1;
	}
	
	//发起资金支出请求
	function createPayment(string _description, uint _amount, address _receiver) public ownerOnly {
		Payment memory newPayment = Payment({
			description : _description,
			amount : _amount,
			receiver : _receiver,
			completed : false,
			//			voters : new address[](0)
			voterCount : 0
			});
		payments.push(newPayment);
	}
	
	//投票赞成某个资金支出请求
	function approvePayment(uint index) public {
		Payment storage payment = payments[index];
		
		// must be investor to vote
		//		bool isInvestor = false;
		//		for (uint i = 0; i < investors.length; i++) {
		//			isInvestor = (investors[i] == msg.sender);
		//			if (isInvestor) {
		//				break;
		//			}
		//		}
		//		require(isInvestor);
		require(investors[msg.sender] > 0);
		
		// can not vote twice
		//		bool hasVoted = false;
		//		for (uint j = 0; j < payment.voters.length; j++) {
		//			hasVoted = (payment.voters[j] == msg.sender);
		//			if (hasVoted) {
		//				break;
		//			}
		//		}
		//		require(!hasVoted);
		require(!payment.voters[msg.sender]);
		
		//		payment.voters.push(msg.sender);
		payment.voters[msg.sender] = true;
		payment.voterCount += 1;
	}
	
	//完成资金支出
	function doPayment(uint index) public ownerOnly {
		Payment storage payment = payments[index];
		require(!payment.completed);
		//检查账户余额
		require(address(this).balance >= payment.amount);
		//		require(payment.voters.length > (investors.length / 2));
		require(payment.voterCount > investorCount / 2);
		payment.receiver.transfer(payment.amount);
		payment.completed = true;
	}
	
}
