//go:build release
// +build release

package main

import (
	"embed"

	"github.com/gin-contrib/static"
)

//go:embed public/*
var f embed.FS

func ServeUI() {
	r.Use(static.Serve("/", static.EmbedFolder(f, "public")))
}
