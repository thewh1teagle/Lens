package main

import (
	"github.com/gin-gonic/gin"
	"github.com/thewh1teagle/lens/api"
	"github.com/thewh1teagle/lens/ui"
)

func main() {
	r := gin.Default()
	// Setup UI
	ui.ServeUI(r)

	// Setup API
	api.Setup(r.Group("/api"))
	// Listen and Server in 0.0.0.0:8080
	r.Run(":8080")
}
