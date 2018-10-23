var Purchase = artifacts.require("./Purchase.sol");

module.exports = function(deployer) {
    deployer.deploy(Purchase, web3.toWei(10), "bicicleta");
};
