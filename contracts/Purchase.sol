pragma solidity ^0.4.11;

contract Purchase {

  uint public value;
  string public article;
  address public seller;
  address public buyer;
  uint public sellerAmount;
  uint public buyerAmount;
  uint state;
  event Funded();
  event Accepted();
  event Delivered();
  event Refunded();

  modifier onlyAt(uint _state) { require(_state == state); _; }
  modifier onlyBy(bytes32 _role) {
    if (_role == "seller") {
      require(msg.sender == seller);
      _;
    }
    else if (_role == "buyer") {
      require(msg.sender == buyer);
      _;
    }
  }

  function getState() public constant returns (string) {
    if (state == 0) return "0. Created";
    if (state == 1) return "1. Funded";
    if (state == 2) return "2. Accepted";
    if (state == 3) return "3. Delivered";
    if (state == 4) return "4. Refunded";
  }

  function Purchase(uint _value, string _article) public {
    value = _value;
    article = _article;
    seller = msg.sender;
  }

  function fund() public payable onlyAt(0) onlyBy("seller") {
    require(msg.value == value * 2);
    sellerAmount = msg.value;
    Funded();
    state = 1;
  }

  function accept() public payable onlyAt(1) {
    require(msg.value == value * 2);
    buyer = msg.sender;
    buyerAmount = msg.value;
    Accepted();
    state = 2;
  }

  function delivered() public onlyAt(2) onlyBy("buyer") {
    Delivered();
    state = 3;
    buyer.transfer(value);
  }

  function refund() public onlyAt(3) onlyBy("seller") {
    Refunded();
    state = 4;
    seller.transfer(value * 3);
  }
}
