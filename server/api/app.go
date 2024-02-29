package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/thewh1teagle/lens/db"
)

func Setup(api *gin.RouterGroup, db db.DB) {
	api.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"hello": "world2!"})
	})

	api.GET("/query", func(ctx *gin.Context) {
		query := ctx.Query("q")

		rows, _ := db.Query(query)
		ctx.Data(http.StatusOK, "application/json", rows)
	})
}
