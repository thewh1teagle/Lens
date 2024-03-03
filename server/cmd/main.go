package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/alecthomas/kingpin"
	"github.com/gin-gonic/gin"
	"github.com/thewh1teagle/lens/alert"
	"github.com/thewh1teagle/lens/api"
	"github.com/thewh1teagle/lens/config"
	"github.com/thewh1teagle/lens/db"
	hotreload "github.com/thewh1teagle/lens/hot_reload"
	"github.com/thewh1teagle/lens/schedule"
	"github.com/thewh1teagle/lens/ui"
)

var (
	version   = "0.0.9"
	configArg = kingpin.Arg("config", "Path to config dashboard JSON.").Required().String()
)

func main() {
	kingpin.Version(version)
	kingpin.Parse()
	gin.SetMode(gin.ReleaseMode) // hide default debug messages
	r := gin.Default()

	// Setup UI
	ui.ServeUI(r)

	// Setup API
	lensConfig, err := config.ReadConfig(*configArg)
	lensConfig.LensVersion = version // insert current version

	if err != nil {
		panic(err.Error())
	}
	dbConnections, _ := db.CreateConnections(*lensConfig)
	api.Run(r.Group("/api"), *lensConfig, dbConnections)
	// Run alerts
	if lensConfig.Alerts != nil && len(*lensConfig.Alerts) > 0 {
		go alert.Run(*lensConfig, dbConnections)
	}
	// Run scheduler in background
	if lensConfig.Tasks != nil && len(*lensConfig.Tasks) > 0 {
		go schedule.Run(*lensConfig)
	}

	// Run hot reloader
	go hotreload.SetupWatcher(*configArg)
	// Listen and Server in 0.0.0.0:8080

	// Get server config
	port := 8080
	host := "127.0.0.1"
	if lensConfig.Server != nil {
		serverConfig := lensConfig.Server
		if serverConfig.Host != nil {
			host = *serverConfig.Host
		}
		if serverConfig.Port != nil {
			port = *serverConfig.Port
		}
	}

	// Read values from environment variables if they're set
	if envPortStr, exists := os.LookupEnv("LENS_PORT"); exists {
		envPort, err := strconv.Atoi(envPortStr)
		if err == nil {
			port = envPort
		} else {
			fmt.Println("Error parsing LENS_PORT:", err)
		}
	}
	if envHost, exists := os.LookupEnv("LENS_HOST"); exists {
		host = envHost
	}
	addr := fmt.Sprintf("%s:%d", host, port)
	fmt.Printf("Server running at http://%v\n", addr)
	r.Run(addr)
}
