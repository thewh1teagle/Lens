package main

import (
	"fmt"

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
	port       = kingpin.Arg("port", "Port for the server").Default("8080").String()
	host       = kingpin.Arg("host", "Host for the server").Default("127.0.0.1").String()
)

func main() {
	kingpin.Parse()
	gin.SetMode(gin.ReleaseMode) // hide default debug messages
	r := gin.Default()

	// Setup UI
	ui.ServeUI(r)

	// Setup API
	db, _ := db.New(*dbPath)
	db.Connect()
	api.Setup(r.Group("/api"), db, *configPath)
	// Run scheduler in background
	go schedule.Run(*configPath)
	// Listen and Server in 0.0.0.0:8080
	addr := fmt.Sprintf("%s:%s", *host, *port)
	r.Run(addr)
}
