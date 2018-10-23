pragma solidity ^0.4.19;

contract Lottery {

  address public owner;
  address[] public participants;
  mapping(address => uint) public deposits;
  bool public isOpen;
  address public winner;
  
  function Lottery() public {
    owner = msg.sender;
    isOpen = true;
  }

  function deposit() payable external {
    require(isOpen);
    require(msg.value > 0);
    if (deposits[msg.sender] == 0) {
      participants.push(msg.sender);
    }
    deposits[msg.sender] += msg.value;
  }

  function close() external {
    require(msg.sender == owner);
    require(this.balance > 0);
    require(isOpen);
    isOpen = false;
    uint[] memory aggregate = getAggregate();
    uint seed = pickSeed();
    winner = searchWinner(aggregate, seed);
  }

  function getPrize() external {
    require(!isOpen);
    require(msg.sender == winner);
    winner.transfer(this.balance);
  }

  function getAggregate() public view returns (uint[]) {
    uint[] memory aggregate = new uint[](participants.length);
    aggregate[0] = deposits[participants[0]];
    for (uint i=1; i<participants.length; i++) {
      aggregate[i] = aggregate[i-1] + deposits[participants[i]];
    }
    return aggregate;
  }

  function pickSeed() public view returns (uint) {
    uint blockNumber = block.number - 1;
    bytes32 blockHash = block.blockhash(blockNumber);
    uint random = uint(blockHash);
    uint seed = random % this.balance;
    return seed;
  }

  function searchWinner(uint[] aggregate, uint seed)
    public view returns (address) {
    uint min = 0;
    uint max = aggregate.length - 1;
    uint i = getMiddle(min, max);
    while (seed > aggregate[i] || (i > 0 && seed < aggregate[i-1])) {
      if (seed > aggregate[i]) {
	min = i;
	i += getMiddle(min, max);
      }
      else {
	max = i;
	i -= getMiddle(min, max);
      }
    }
    return participants[i];
  }

  function getMiddle(uint min, uint max) public pure returns (uint) {
    if (max - min == 1) {
      return 1;
    }
    else {
      return (max - min) / 2;
    }
  }

}
