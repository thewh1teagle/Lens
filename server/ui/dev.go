//go:build !release
// +build !release

package ui

import (
	"path/filepath"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func ServeUI(engine *gin.Engine) {
	uiPath, _ := filepath.Abs("./ui/public")
	engine.Use(static.Serve("/", static.LocalFile(uiPath, false)))
}
