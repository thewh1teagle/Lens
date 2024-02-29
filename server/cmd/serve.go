package main

import (
	"github.com/alecthomas/kingpin"
	"github.com/gin-gonic/gin"
	"github.com/thewh1teagle/lens/api"
	"github.com/thewh1teagle/lens/db"
	"github.com/thewh1teagle/lens/schedule"
	"github.com/thewh1teagle/lens/ui"
)

var (
	dbPath     = kingpin.Arg("db", "Path to db.").Required().String()
	configPath = kingpin.Arg("config", "Path to config dashboard JSON.").Required().String()
)

func main() {
	kingpin.Parse()
	r := gin.Default()
	// Setup UI
	ui.ServeUI(r)

	// Setup API
	db, _ := db.New(*dbPath)
	db.Connect()
	api.Setup(r.Group("/api"), db, *configPath)
	go schedule.Run(*configPath) // run scheduler in background
	// Listen and Server in 0.0.0.0:8080
	r.Run(":8080")
}
