var BlindAuction = artifacts.require("./BlindAuction.sol");

module.exports = function(deployer) {
    deployer.deploy(BlindAuction, 60, 60, '0xd2142e73376f4f48734f1389d3d58bfa1fff6444');
};
