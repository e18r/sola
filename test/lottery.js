var Lottery = artifacts.require("./Lottery.sol");
var BigNumber = require("bignumber.js");

contract('Lottery', async (accounts) => {
    it("should have a rightful owner", async () => {
	let instance = await Lottery.deployed();
	let owner = await instance.owner();
	assert.equal(owner, accounts[0]);
    });
    it("should be open", async () => {
	let instance = await Lottery.deployed();
	let isOpen = await instance.isOpen();
	assert(isOpen);
    });
    it("should allow making a deposit", async () => {
	let instance = await Lottery.deployed();
	let balance0 = web3.eth.getBalance(instance.address);
	await instance.deposit({value: web3.toWei(1)});
	let balance1 = web3.eth.getBalance(instance.address);
	assert.equal(balance1 - balance0, web3.toWei(1));
    });
    it("should record the sender's address", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	let participant = await instance.participants(0);
	assert.equal(participant, accounts[0]);
    });
});

contract('Lottery', async (accounts) => {
    it("should not allow a 0 wei deposit", async () => {
	let instance = await Lottery.deployed();
	try {
	    await instance.deposit();
	    throw {
		name: 'ZeroDepositError',
		description: 'The contract allowed a zero wei deposit'
	    };
	}
	catch(error) {
	    if(error.name == 'ZeroDepositError') {
		throw error;
	    }
	    else {
		assert.ok(true);
	    }
	}
    });
});

contract('Lottery', async (accounts) => {
    it("should record the sender's deposited amount", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	let deposit = await instance.deposits(accounts[0]);
	assert.equal(deposit.toNumber(), web3.toWei(1));
    });
    it("should record each sender only once", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	await instance.deposit({value: web3.toWei(2)});
	try {
	    await instance.participants(1);
	    throw {
		name: 'duplicateError',
		message: 'The same sender was recorded twice'
	    };
	}
	catch(error) {
	    if(error.name == 'duplicateError') {
		throw error;
	    }
	    else {
		assert.ok(true);
	    }
	}
    });
});

contract("Lottery", async (accounts) => {
    it("should record multiple deposits by the same participant", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(2)});
	await instance.deposit({value: web3.toWei(5)});
	let balance = await instance.deposits(accounts[0]);
	assert.equal(balance.toNumber(), web3.toWei(7));
    });
});

contract("Lottery", async (accounts) => {
    it("should return an aggregate of deposits", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1.5), from: accounts[0]});
	await instance.deposit({value: web3.toWei(4), from: accounts[1]});
	await instance.deposit({value: web3.toWei(0.25), from: accounts[2]});
	let actual = await instance.getAggregate();
	let expected = [
	    BigNumber(web3.toWei(1.5)),
	    BigNumber(web3.toWei(1.5 + 4)),
	    BigNumber(web3.toWei(1.5 + 4 + 0.25))
	];
	assert.equal(typeof expected, typeof actual);
	assert.equal(expected.length, actual.length);
	for(var i=0; i<expected.length; i++) {
	    assert.equal(typeof expected[i], typeof actual[i]);
	    assert(expected[i].isEqualTo(actual[i]));
	}
    });
});

contract("Lottery", async (accounts) => {
    it("should pick a seed within its balance", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	let seed = await instance.pickSeed();
	let balance = web3.eth.getBalance(instance.address);
	assert.ok(seed.toNumber() <= balance.toNumber());
	assert.ok(seed.toNumber() >= 0);
    });
});

contract("Lottery", async (accounts) => {
    it("should pick a different seed each time", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	let seed1 = await instance.pickSeed();
	let seed2 = await instance.pickSeed();
	let seed3 = await instance.pickSeed();
	assert.notEqual(seed1, seed2);
	assert.notEqual(seed1, seed3);
	assert.notEqual(seed2, seed3);
    });
});

contract("Lottery", async (accounts) => {
    it("should pick winner 1", async () => {
    	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1.5), from: accounts[0]});
	await instance.deposit({value: web3.toWei(4), from: accounts[1]});
	await instance.deposit({value: web3.toWei(0.25), from: accounts[2]});
	let aggregate = await instance.getAggregate();
	let randomPick = web3.toWei(3);
    	let winner = await instance.searchWinner(aggregate, randomPick);
	assert.equal(winner, accounts[1]);
    });
    it("should pick winner 0", async () => {
    	let instance = await Lottery.deployed();
	let aggregate = await instance.getAggregate();
	let randomPick = web3.toWei(1);
    	let winner = await instance.searchWinner(aggregate, randomPick);
	assert.equal(winner, accounts[0]);
    });
    it("should pick winner 2", async () => {
    	let instance = await Lottery.deployed();
	let aggregate = await instance.getAggregate();
	let randomPick = web3.toWei(5.6);
    	let winner = await instance.searchWinner(aggregate, randomPick);
	assert.equal(winner, accounts[2]);
    });
});

contract("Lottery", async (accounts) => {
    it("should pick account 3", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(0.5), from: accounts[0]});
	await instance.deposit({value: web3.toWei(1), from: accounts[1]});
	await instance.deposit({value: web3.toWei(1), from: accounts[2]});
	await instance.deposit({value: web3.toWei(1), from: accounts[3]});
	await instance.deposit({value: web3.toWei(1), from: accounts[4]});
	await instance.deposit({value: web3.toWei(1), from: accounts[5]});
	await instance.deposit({value: web3.toWei(1), from: accounts[6]});
	await instance.deposit({value: web3.toWei(1), from: accounts[7]});
	await instance.deposit({value: web3.toWei(1), from: accounts[8]});
	await instance.deposit({value: web3.toWei(1), from: accounts[9]});
	let aggregate = await instance.getAggregate();
	let randomPick = web3.toWei(3);
	let winner = await instance.searchWinner(aggregate, randomPick);
	assert.equal(winner, accounts[3]);
    });
});

contract("Lottery", async (accounts) => {
    it("should pick account 7", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(0.5), from: accounts[0]});
	await instance.deposit({value: web3.toWei(1), from: accounts[1]});
	await instance.deposit({value: web3.toWei(1), from: accounts[2]});
	await instance.deposit({value: web3.toWei(1), from: accounts[3]});
	await instance.deposit({value: web3.toWei(1), from: accounts[4]});
	await instance.deposit({value: web3.toWei(1), from: accounts[5]});
	await instance.deposit({value: web3.toWei(1), from: accounts[6]});
	await instance.deposit({value: web3.toWei(1), from: accounts[7]});
	await instance.deposit({value: web3.toWei(1), from: accounts[8]});
	await instance.deposit({value: web3.toWei(1), from: accounts[9]});
	let aggregate = await instance.getAggregate();
	let randomPick = web3.toWei(7);
	let winner = await instance.searchWinner(aggregate, randomPick);
	assert.equal(winner, accounts[7]);
    });
});

contract("Lottery", async (accounts) => {
    it("shouldn't let anyone close it without a balance", async () => {
	let instance = await Lottery.deployed();
	try {
	    await instance.close();
	    throw {
		name: 'balancelessClose',
		description: 'the contract was closed without a balance'
	    };
	}
	catch (error) {
	    if(error.name == 'balancelessClose') {
		throw error;
	    }
	    else {
		assert.ok(true);
	    }
	}
    });
});

contract("Lottery", async (accounts) => {
    it("should let the owner close it", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	await instance.close();
	assert.equal(await instance.isOpen(), false);
    });
});

contract("Lottery", async (accounts) => {
    it("shouldn't let anyone else close it", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	try {
	    await instance.close({from: accounts[1]});
	    throw {
		name: 'securityError',
		message: 'A non-owner was allowed to close the contract'
	    };
	}
	catch (error) {
	    if(error.name == 'securityError') {
		throw error;
	    }
	    else {
		assert.ok(true);
	    }
	}
    });
});

contract("Lottery", async (accounts) => {
    it("shouldn't get closed twice", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	await instance.close();
	try {
	    await instance.close();
	    throw {
		name: 'closedTwice',
		description: 'The contract was closed twice'
	    };
	}
	catch(error) {
	    if(error.name == 'closedTwice') {
		throw error;
	    }
	    else {
		assert.ok(true);
	    }
	}
    });
});

contract("Lottery", async (accounts) => {
    it("shouldn't allow deposits after closure", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	await instance.close();
	try {
	    await instance.deposit({value: web3.toWei(1)});
	    throw {
		name: 'badDeposit',
		description: 'A deposit was made after the contract was closed'
	    };
	}
	catch (error) {
	    if(error.name == 'badDeposit') {
		throw error;
	    }
	    else {
		assert.ok(true);
	    }
	}
    });
});

contract("Lottery", async (accounts) => {
    it("assigns a winner", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	await instance.close();
	let winner = await instance.winner();
	assert.equal(winner, accounts[0]);
    });
});

contract("Lottery", async (accounts) => {
    it("disallows calls to getPrize() while the contract is open", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1)});
	try {
	    await instance.getPrize();
	    throw {
		name: 'securityError',
		description: 'getPrize() was called while the contract was open'
	    };
	}
	catch(error) {
	    if(error.name == 'securityError') {
		throw error;
	    }
	    else {
		assert.ok(true);
	    }
	}
    });
});

contract("Lottery", async (accounts) => {
    it("should not allow a non-winner to withdraw the prize", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(1), from: accounts[1]});
	await instance.close();
	try {
	    await instance.getPrize({from: accounts[2]});
	    throw {
		name: 'securityError',
		description: 'a non-winner was allowed to withdraw the prize'
	    };
	}
	catch (error) {
	    if(error.name == 'securityError') {
		throw error;
	    }
	    else {
		assert.ok(true);
	    }
	}
    });
});

contract("Lottery", async (accounts) => {
    it("should let the winner withdraw the prize", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(10), from: accounts[5]});
	await instance.close();
	let balance0 = await web3.eth.getBalance(accounts[5]);
	let gasPrice = 5000000000;
	let receipt = await instance.getPrize({
	    from: accounts[5], gasPrice: gasPrice
	});
	let balance1 = await web3.eth.getBalance(accounts[5]);
	let txCost = receipt.receipt.gasUsed * gasPrice;
	assert.ok(balance1 - balance0  == web3.toWei(10) - txCost);
    });
});

contract("Lottery", async (accounts) => {
    it("should transfer the winner all its balance", async () => {
	let instance = await Lottery.deployed();
	await instance.deposit({value: web3.toWei(10), from: accounts[1]});
	await instance.deposit({value: web3.toWei(10), from: accounts[2]});
	await instance.close();
	try {
	    await instance.getPrize({from: accounts[1]});

	}
	catch (error) {}
	try {
	    await instance.getPrize({from: accounts[2]});
	}
	catch (error) {}
	let balance = web3.eth.getBalance(instance.address);
	assert.equal(balance, 0);
    });
});
