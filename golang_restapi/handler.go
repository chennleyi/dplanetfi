package main

type DatabaseHandler interface {
	GetAllData(string) ([]map[string]interface{}, error)
    Write(...interface{})
}



