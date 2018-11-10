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
		uint totalBids;
		ProductStatus status;
		ProductCondition condition;
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
}
