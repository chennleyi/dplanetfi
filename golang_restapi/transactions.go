package main

type Transaction struct {
	ProjectID   string `json:"projectId"`
	Amount      string `json:"amount"`
	Address     string `json:"address"`
	TxHash      string `json:"txHash"`
	CreateTime  int64  `json:"createTime"`
	TokenName   string `json:"TokenName"`
}