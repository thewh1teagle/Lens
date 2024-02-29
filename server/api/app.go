package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Setup(api *gin.RouterGroup) {
	api.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"hello": "world2!"})
	})
}
