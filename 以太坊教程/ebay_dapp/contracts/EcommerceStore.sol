pragma solidity ^0.4.13;

contract EcommerceStore {
	//商品状态
	enum ProductStatus {Open, Sold, Unsold}
	//商品条件
	enum ProductCondition {New, Used}
	
	//计数器，记录商品id
	uint public productIndex;
	//商家账户地址 => {商品id => 商品}
	mapping(address => mapping(uint => Product)) stores;
	//商品id => 商家账户地址
	mapping(uint => address) productIdInStore;
	
	struct Product {
		uint id;
		string name;
		string category;
		string imageLink;
		string descLink;
		uint auctionStartTime;  //以秒存储开始和结束时间
		uint auctionEndTime;
		uint startPrice; //单位为 wei
		address highestBidder;
		uint highestBid;
		uint secondHighestBid;
		uint totalBids; //总出价次数
		ProductStatus status;
		ProductCondition condition;
		//出价者地址 => {出价字符串 => 出价对象}
		mapping(address => mapping(bytes32 => Bid)) bids;
	}
	
	struct Bid {
		address bidder; //出价者
		uint productId;
		uint value; //转账以太金额
		bool revealed; //是否揭示
	}
	
	constructor() public {
		productIndex = 0;
	}
	
	//添加商品
	function addProductToStore(string _name, string _category, string _imageLink, string _descLink, uint _auctionStartTime,
		uint _auctionEndTime, uint _startPrice, uint _productCondition) public {
		require(_auctionStartTime < _auctionEndTime);
		productIndex += 1;
		Product memory product = Product(productIndex, _name, _category, _imageLink, _descLink, _auctionStartTime, _auctionEndTime,
			_startPrice, 0, 0, 0, 0, ProductStatus.Open, ProductCondition(_productCondition));
		stores[msg.sender][productIndex] = product;
		productIdInStore[productIndex] = msg.sender;
	}
	
	//查询商品
	function getProduct(uint _productId) view public returns (uint, string, string, string, string, uint, uint, uint, ProductStatus, ProductCondition) {
		Product memory product = stores[productIdInStore[_productId]][_productId];
		return (product.id, product.name, product.category, product.imageLink, product.descLink, product.auctionStartTime,
		product.auctionEndTime, product.startPrice, product.status, product.condition);
	}
	
	//出价
	function bid(uint _productId, bytes32 _bid) payable public returns (bool) {
		//_bid 为出价加密字符串，除非用户揭示价格，否则无人知道出价
		Product storage product = stores[productIdInStore[_productId]][_productId];
		require(now >= product.auctionStartTime);
		require(now <= product.auctionEndTime);
		require(msg.value > product.startPrice);
		//本人对该商品未出过此价
		require(product.bids[msg.sender][_bid].bidder == 0);
		// 记录出价数据
		product.bids[msg.sender][_bid] = Bid(msg.sender, _productId, msg.value, false);
		product.totalBids += 1;
		return true;
	}
	
	//揭示出价
	function revealBid(uint _productId, string _amount, string _secret) public {
		Product storage product = stores[productIdInStore[_productId]][_productId];
		require(now > product.auctionEndTime);
		//出价的加密字符串
		bytes32 sealedBid = sha3(_amount, _secret);
		
		Bid memory bidInfo = product.bids[msg.sender][sealedBid];
		require(bidInfo.bidder > 0);
		require(bidInfo.revealed == false);
		
		uint refund;
		
		uint amount = stringToUint(_amount);
		
		if (bidInfo.value < amount) {
			//无效出价
			// They didn't send enough amount, they lost
			refund = bidInfo.value;
		} else {
			// If first to reveal set as highest bidder
			if (address(product.highestBidder) == 0) {
				product.highestBidder = msg.sender;
				product.highestBid = amount;
				product.secondHighestBid = product.startPrice;
				refund = bidInfo.value - amount;
			} else {
				if (amount > product.highestBid) {
					//为最高出价
					product.secondHighestBid = product.highestBid;
					product.highestBidder.transfer(product.highestBid);
					//给第二高出价者退款
					product.highestBidder = msg.sender;
					product.highestBid = amount;
					refund = bidInfo.value - amount;
				} else if (amount > product.secondHighestBid) {
					//为第二高出价
					product.secondHighestBid = amount;
					refund = bidInfo.value;
				} else {
					refund = bidInfo.value;
				}
			}
		}
		product.bids[msg.sender][sealedBid].revealed = true;
		
		if (refund > 0) {
			msg.sender.transfer(refund);
		}
	}
	
	function highestBidderInfo(uint _productId) view public returns (address, uint, uint) {
		Product memory product = stores[productIdInStore[_productId]][_productId];
		return (product.highestBidder, product.highestBid, product.secondHighestBid);
	}
	
	function totalBids(uint _productId) view public returns (uint) {
		Product memory product = stores[productIdInStore[_productId]][_productId];
		return product.totalBids;
	}
	
	function stringToUint(string s) pure private returns (uint) {
		bytes memory b = bytes(s);
		uint result = 0;
		for (uint i = 0; i < b.length; i++) {
			if (b[i] >= 48 && b[i] <= 57) {
				result = result * 10 + (uint(b[i]) - 48);
			}
		}
		return result;
	}
}
