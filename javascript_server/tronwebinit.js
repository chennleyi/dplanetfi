const TronWeb = require('tronweb'); // 与tron链交互的库
/** 初始化tronweb */
const tronWeb = new TronWeb({
	fullHost: process.env.HOST,
	headers: { 'TRON-PRO-API-KEY': process.env.API_KEY},
	privateKey: process.env.PRIVATE_KEY
});

module.exports ={tronWeb};