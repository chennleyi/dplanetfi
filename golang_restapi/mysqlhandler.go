package main

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
    "log"
)

type MySQLHandler struct {
	db *sql.DB
}

func NewMySQLHandler(username, password, database string) (*MySQLHandler, error) {
	connectionString := username + ":" + password + "@tcp(localhost:3306)/" + database

	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		return nil, err
	}

	handler := &MySQLHandler{
		db: db,
	}

	return handler, nil
}


func (h *MySQLHandler) GetAllData(tableName string) ([]map[string]interface{}, error) {
	query := "SELECT * FROM " + tableName

	rows, err := h.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns, _ := rows.Columns()
	count := len(columns)
	values := make([]interface{}, count)
	valuePtrs := make([]interface{}, count)

	resultSet := []map[string]interface{}{}

	for rows.Next() {
		for i := 0; i < count; i++ {
			valuePtrs[i] = &values[i]
		}

		err = rows.Scan(valuePtrs...)
		if err != nil {
			return nil, err
		}

        rowMap := map[string]interface{}{}
        for i, colName := range columns {
            val := values[i]

            // 将结果转换为适当的类型，添加到行映射中。
            switch v:= val.(type) {
                case []byte:
                    rowMap[colName] = string(v)
                default:
                    rowMap[colName] = v
            }
        }

        resultSet = append(resultSet, rowMap)
    }
    return resultSet, nil
}


func(this *MySQLHandler) Write(args ...interface{}){
	stmt, err := this.db.Prepare(args[0].(string))
	if err != nil {
	    log.Fatal(err)
	    return
    }
	defer stmt.Close()
	_, err = stmt.Exec(args[1:]...)
	if err != nil{
		log.Println(err)
		return
   }
}