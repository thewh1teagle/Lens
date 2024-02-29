package main

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/thewh1teagle/lens/api"
	"github.com/thewh1teagle/lens/db"
	"github.com/thewh1teagle/lens/ui"
)

type Animal struct {
	db   *sql.DB
	name string
}

func main() {
	r := gin.Default()
	// Setup UI
	ui.ServeUI(r)

	// Setup API
	db, _ := db.New("app.db")
	db.Connect()
	api.Setup(r.Group("/api"), db)
	// Listen and Server in 0.0.0.0:8080
	r.Run(":8080")
}
