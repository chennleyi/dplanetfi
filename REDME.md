## 说明

## Golang

go版本：1.20

功能：负责将合约创建细节，分配钱财细节写入数据库，从从数据库中读取合约细节整张表

## nodeJS

index.js: 负责轮询tron链得到合约创建事件，合约分配事件，转账细节

deployment.js: 通过发送远程json调用来部署合约

## Solidity

可以在tronode.io中进行编译部署交互

## 运行此项目

在golang_server中

```
go run *.go
```

在javascript中

```
node deployment.js
node index.js
```

发送如下json调用给node服务器创建合约
{
	"projectId": "Jason Borne",
	"addressList": ["TXRj7wVbxy2wAGHRbo6pML17mcqZJ5uq6p", "TRmVXvNzUj66WEowTMFsbF8a7h7B91GYjD",
"TFPKP9yzvqeKmYG7pvgfgyriDp9cidktCx"],
 	"percentage": [50, 25, 25] 

}
大概等40个区块确认，2min
终端显示合约创建成功后，转账

等待大概20个区块确认，1min
终端显示收到转账， 调用allocate

又大概等待40个区块确认，2min
终端显示分发成功，完结