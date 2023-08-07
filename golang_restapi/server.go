package main

import(
	"github.com/gin-gonic/gin"
	"net/http"
)


type Server struct{
	R *gin.Engine
	db DatabaseHandler
}


func InitServer(database DatabaseHandler) *Server{
	return &Server{
		R: gin.Default(),
		db: database,
	}
}




func(this Server) Create(c *gin.Context){
	var creations []Creation
	if err := c.ShouldBindJSON(&creations); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
	for _, t := range creations{
       this.db.Write("INSERT INTO creations (project_id, contract_addr) VALUES (?, ?)", t.ProjectID, t.ContractAddr)
    }
	c.Status(http.StatusOK)
}




// 接受post请求并将allocations写入数据库
func (this Server) Transact(c *gin.Context) {
	var transactions []Transaction
	if err := c.ShouldBindJSON(&transactions); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
	for _, t := range transactions{
       this.db.Write("INSERT INTO transactions (project_id, amount, address, tx_hash, create_time, token_name) VALUES (?, ?, ?, ?, ?, ?)", t.ProjectID, t.Amount,t.Address,t.TxHash,t.CreateTime,t.TokenName)
    }
	c.Status(http.StatusOK)
}


func (this Server) Query(c *gin.Context){
    data ,_:= this.db.GetAllData("creations")
	var creations []Creation
	for _, item := range data{
		creation := Creation{ProjectID: item["project_id"].(string), ContractAddr: item["contract_addr"].(string)}
		creations = append(creations, creation)
	}
	c.JSON(http.StatusOK, gin.H{"creations": creations})
}



