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

	// Get server config
	port := 8080
	host := "127.0.0.1"
	if lensConfig.ServerConfig != nil {
		serverConfig := lensConfig.ServerConfig
		if serverConfig.Host != nil {
			host = *serverConfig.Host
		}
		if serverConfig.Port != nil {
			port = *serverConfig.Port
		}
	}
	addr := fmt.Sprintf("%s:%d", host, port)
	fmt.Printf("Server running at http://%v\n", addr)
	r.Run(addr)
}
