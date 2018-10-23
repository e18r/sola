compile
migrate --reset
BlindAuction.deployed();
ba = BlindAuction.at();
var balance0 = web3.fromWei(web3.eth.getBalance(web3.eth.coinbase).toNumber());
ba.bid(ciphertext, {value:value});
var balance1 = web3.fromWei(web3.eth.getBalance(web3.eth.coinbase).toNumber());
balance1 - balance0;
// ...
var reveal = ba.reveal([value], [fake], [secret]);
var balance2 = web3.fromWei(web3.eth.getBalance(web3.eth.coinbase).toNumber());
balance2 - balance1;
// ...
var bala0 = web3.fromWei(web3.eth.getBalance('0xd2142e73376f4f48734f1389d3d58bfa1fff6444').toNumber());
ba.auctionEnd();
var bala1 = web3.fromWei(web3.eth.getBalance('0xd2142e73376f4f48734f1389d3d58bfa1fff6444').toNumber());
bala1 - bala0;
