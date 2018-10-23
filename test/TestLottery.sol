pragma solidity ^0.4.19;

import "truffle/Assert.sol";

contract TestLottery {
  event Log(bytes32 state);
  event Log(uint state);
  function testConversion() public {
    bytes32 blockHash = block.blockhash(1);
    Log(blockHash);
    Log(uint(blockHash));
    Log(uint(blockHash) % 14);
    //Assert.equal(blockHash, "", "");
  }
}
