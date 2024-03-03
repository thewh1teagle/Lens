package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/thewh1teagle/lens/config"
	"github.com/thewh1teagle/lens/db"
	hotreload "github.com/thewh1teagle/lens/hot_reload"
)

func Run(api *gin.RouterGroup, lensConfig config.LensConfig, dbConnections map[string]db.DB) {

	widgetMap := config.WidgetsMap(&lensConfig)

	api.GET("/config", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, lensConfig)
	})

	api.GET("/query", func(ctx *gin.Context) {
		widgetID := ctx.Query("id")
		widget := widgetMap[widgetID]
		query := ctx.Query("q")
		source, _ := widget.Source.(map[string]interface{})
		path, _ := source["path"].(string)
		dbConn, ok := dbConnections[path]
		if !ok {
			// The widget ID does not have a corresponding database connection
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("no database connection found for widget with ID %s", widgetID)})
		}
		rows, err := dbConn.Query(query)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Data(http.StatusOK, "application/json", rows)
	})

	api.GET("/ws", hotreload.WsPing)

	api.GET("/fetch", func(ctx *gin.Context) {
		url := ctx.Query("url")
		startDate := ctx.Query("start_date")
		endDate := ctx.Query("end_date")

		fmt.Printf("url is %v\n", url)
		userAgent := ctx.DefaultQuery("user_agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
		client := &http.Client{}
		req, err := http.NewRequest(http.MethodGet, url, nil)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		req.Header.Set("User-Agent", userAgent)

		// If start_date and end_date are not empty, add them to the query parameters of the URL
		if startDate != "" && endDate != "" {
			query := req.URL.Query()
			query.Add("start_date", startDate)
			query.Add("end_date", endDate)
			req.URL.RawQuery = query.Encode()
		}

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
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": responseJson})
			return
		}

		// Return response JSON
		ctx.JSON(http.StatusOK, responseJson)
	})
}
