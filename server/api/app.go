package api

import (
	"encoding/json"
	"fmt"
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

	api.GET("/fetch", func(ctx *gin.Context) {
		url := ctx.Query("url")
		fmt.Printf("url is %v\n", url)
		userAgent := ctx.DefaultQuery("user_agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
		client := &http.Client{}
		req, err := http.NewRequest(http.MethodGet, url, nil)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		req.Header.Set("User-Agent", userAgent)
		res, err := client.Do(req)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer res.Body.Close()
		status := res.StatusCode
		// Read response body
		var responseJson interface{}
		err = json.NewDecoder(res.Body).Decode(&responseJson)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if status != 200 {
			ctx.JSON(http.StatusInternalServerError, responseJson)
			return
		}

		// Return response JSON
		ctx.JSON(http.StatusOK, responseJson)
	})
}
