const axios = require('axios');    // 用于发送post请求的库
const dotenv = require("dotenv")
dotenv.config('./env')
const tronWeb = require("./tronwebinit.js").tronWeb;
const sleep = require("./sleep.js").sleep;

let blockID = 1;                // 本地block高度
let x = [];                     // 保存需要发送的js对象
const contractsSet = new Set(); // 保存已经有余额但还未allocate的合约地址


/** 发送post请求  */
function postReqeust(link, postData){
	axios.post(link, postData)
	  .then((response) => {
	    console.log(response.data);
	  })
	  .catch((error) => {
	    console.error(error);
	  });
}


/** 得到当前区块的区块高度 */
function getBlockHeight(){
	return tronWeb.trx.getCurrentBlock().then(
			result => {				
				return result.block_header.raw_data.number;
			}
	);	
}


/** 从golang restapi获取所有创建的contracts */
function getData(){
	return axios.get("http://47.89.245.207/data").
		then(response => {
			return response.data;
		});
}


/** 监听创建合约事件和合约分配事件  */
async function Listener(start, end) {
  if (start <= end) { 
	// 得到当前区块高度
    const result = await getBlockHeight();
	if(result > blockID){
		// 更新本地区块高度
		if(result - blockID == 1 || result -blockID > 1000000){
			blockID = result;	
			console.log(blockID);
		}else{
			blockID++;
			console.log("delay: "+blockID);
		}

		// 根据区块高度得到响应的区块信息
		tronWeb.trx.getBlockByNumber(blockID).then(
			result => {
				// 从区块信息中获取交易列表
				if("transactions" in result){
					for(let i = 0; i < result.transactions.length; i++){
						// 从交易列表获得交易哈希
						// console.log(result.transactions[i].txID);
						////////// 这里之所以等待120s，是因为交易哈希虽然得到了，但是交易有可能还没得到验证，就有可能得不到事件信息
						setTimeout(()=>{							
							tronWeb.getEventByTransactionID(result.transactions[i].txID).then(
								result => {
									
									for(let i = 0; i < result.length; i++){
										if(Object.values(result[i].result).includes('DPLANET')){
											// 监听到分配事件
											if("from" in result[i].result){
												res = {};
												res["projectId"] = result[i].result["projectID"];
												res["amount"] = result[i].result["value"];
												res["address"] = result[i].result["to"];
												res["txHash"] = result[i].transaction;
												res["createTime"]= result[i].timestamp;
												res["TokenName"] = "trx";
	
												x.push(res);
												
											}else{
												// 监听到创建合约事件
												res = {};
												res["projectId"] = result[i].result["projectID"];
												res["contract"] = result[i].contract;
												x.push(res);
											}
										}
									}
									if(x.length >= 1){
										console.log(x);
										// request;
										if("txHash" in x[0]){
											axios.post("http://47.89.245.207/transactions", x);
										}else{
											axios.post("http://47.89.245.207/creations", x);
										}
										x = [];
									}
								}
							)							
						}, 120000);
					}
				}
			}
		);
	}
    await Listener(start + 1, end); 
  }
}


/** 监听转账事件，每2s监听一次 */
async function TransferListener(start, end){
	if(start <= end){
		const res = await getData();
		creationsList = res.creations;
		for(let i = 0; i < creationsList.length; i++){
			tronWeb.trx.getBalance(creationsList[i]["contract"])
				.then(result => {
					if(result > 5000000){
						if(!contractsSet.has(creationsList[i]["contract"])){
							contractsSet.add(creationsList[i]["contract"]);
							// 到账通知
							console.log(creationsList[i]["contract"], " --> 到账通知");						
						}
					}
				})
		}
		sleep(2000);
	}
	await TransferListener(start+1, end);
}


// 开启多线程
const { Worker, isMainThread } = require('worker_threads');
if (isMainThread) {
	/** 监听合约创建和调用事件 */
	Listener(1, +Infinity);
  	// 创建子线程
	const worker = new Worker(__filename);
} else {
	/** 监听转账事件 */
	TransferListener(1, +Infinity);
}