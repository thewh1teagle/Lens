//go:build !release
// +build !release

package ui

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func ServeUI(engine *gin.Engine) {
	print("Serving UI with local fs")
	engine.Use(static.Serve("/", static.LocalFile("./public", false)))
}
