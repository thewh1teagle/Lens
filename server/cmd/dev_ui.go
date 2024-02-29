//go:build !release
// +build !release

package main

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func ServeUI(engine *gin.Engine) {
	engine.Use(static.Serve("/", static.LocalFile("./public", false)))
}
