package main

import (
	"fmt"

	"github.com/alecthomas/kingpin"
	"github.com/gin-gonic/gin"
	"github.com/thewh1teagle/lens/api"
	"github.com/thewh1teagle/lens/config"
	hotreload "github.com/thewh1teagle/lens/hot_reload"
	"github.com/thewh1teagle/lens/schedule"
	"github.com/thewh1teagle/lens/ui"
)

var (
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
	lensConfig, err := config.ReadConfig(*configPath)

	if err != nil {
		panic(err.Error())
	}
	api.Setup(r.Group("/api"), *lensConfig)
	// Run scheduler in background
	go schedule.Run(*lensConfig)
	// Run hot reloader
	go hotreload.SetupWatcher(*configPath)
	// Listen and Server in 0.0.0.0:8080
	addr := fmt.Sprintf("%s:%s", *host, *port)
	r.Run(addr)
}
