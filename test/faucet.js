var Faucet = artifacts.require("./Faucet.sol");

contract('Faucet', function(accounts) {
    it("should receive ether", function() {
	return Faucet.deployed().then(function(instance) {
	    web3.eth.sendTransaction({from:accounts[0], to:instance.address, value:web3.toWei(1)});
	    var balance = web3.eth.getBalance(instance.address);
	    assert.equal(balance, web3.toWei(1), "the contract did not receive 1 ether");
	});
    });
    it("should give ether", function() {
	return Faucet.deployed().then(function(instance) {
	    var beforeBalance = web3.eth.getBalance(accounts[0]);
	    return instance.withdraw(web3.toWei(0.1), {from:accounts[0], gasPrice:1}).then(function(receipt) {
		var afterBalance = web3.eth.getBalance(accounts[0]);
		assert.equal(beforeBalance.plus(web3.toWei(0.1)).valueOf(), afterBalance.plus(receipt.receipt.gasUsed).valueOf(), "the sender did not receive the withdrawal");
	    });
	});
    });
    /*it("should not give more than 0.1 ether", function() {
	return Faucet.deployed().then(function(instance) {
	    instance.withdraw(web3.toWei(0.15));
	});
    });*/
});
