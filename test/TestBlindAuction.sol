pragma solidity ^0.4.19;

import "truffle/Assert.sol";

contract TestBlindAuction {
  event Log(bytes32 state);
  function testKeccak256() public {
    uint value = 10 ether;
    bool fake = false;
    bytes32 secret = "caca";
    bytes32 ciphertext = keccak256(value, fake, secret);
    Log(ciphertext);
    //Assert.equal(ciphertext, "", "");
  }
}
