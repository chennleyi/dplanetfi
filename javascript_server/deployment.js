const express = require("express");
const app = express();
const dotenv = require("dotenv")
app.use(express.json());
dotenv.config('./env')

const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
	fullHost: process.env.HOST,
	headers: { 'TRON-PRO-API-KEY': process.env.API_KEY },
	privateKey: process.env.PRIVATE_KEY
});

const bytecode = process.env.BYTECODE;
const abi = process.env.ABI;

async function main(res,req) {
	// 部署合约
	const para = req.body;
	let contract_instance = await tronWeb.contract().new({
		abi: abi,
		bytecode: bytecode,
		feeLimit: 1000000000,
		callValue: 0,
		userFeePercentage: 1,
		originEnergyLimit: 10000000,
		parameters:[para['projectId'], para['addressList'], para['percentage']]
	});
	let addr = contract_instance.address;
	console.log("the sc address is "+addr);
	res.status(201).json({projectId: 'User created successfully', contractaddr: addr});
}


app.post("/allocation", (req, res) => {
	const request = req.body;
	main(res,req);
})



const port = 8080;
app.listen(port, () => {
	console.log("server is running");
})







