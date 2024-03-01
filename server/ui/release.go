//go:build release
// +build release

package ui

import (
	"embed"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

//go:embed public/*
var f embed.FS

func ServeUI(r *gin.Engine) {
	r.Use(static.Serve("/", static.EmbedFolder(f, "public")))
}
