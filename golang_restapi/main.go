package main
import(
    "fmt"
    "log"
)

func main() {
    fmt.Println("success")
	db, err:= NewMySQLHandler("root", "Cly0601w", "blockchain")
	if err!=nil{
	    log.Fatal(err)
	    return 
    }
    server := InitServer(db)
    server.R.POST("/creations", server.Create)
    server.R.POST("/transactions",server.Transact)
    server.R.GET("/data",server.Query)
    server.R.Run(":80")
}