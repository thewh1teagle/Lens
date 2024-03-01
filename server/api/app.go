package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/thewh1teagle/lens/config"
	"github.com/thewh1teagle/lens/db"
)

func Setup(api *gin.RouterGroup, lensConfig config.LensConfig) {

	widgetMap := config.WidgetsMap(&lensConfig)

	// create connections map
	dbConnections := make(map[string]*db.SqliteDB) // assuming db.New() returns a *sql.DB
	for id, widget := range widgetMap {
		source, ok := widget.Source.(map[string]interface{})
		if !ok {
			// Source is not of the expected type. Handle this error condition as needed.
			log.Printf("widget.Source for widget with ID %s is not of expected type. Skipping.", id)
			continue
		}

		sourceType, ok := source["type"].(string)
		if !ok {
			// "type" field is not a string. Handle this error condition as needed.
			log.Printf("widget.Source for widget with ID %s does not have a string \"type\" field. Skipping.", id)
			continue
		}

		if sourceType == "sqlite" {
			path, ok := source["path"].(string)
			if !ok {
				// "path" field is not a string. Handle this error condition as needed.
				log.Printf("widget.Source for widget with ID %s does not have a string \"path\" field. Skipping.", id)
				continue
			}

			db, err := db.New(path)
			if err != nil {
				log.Fatalf("error connecting to database: %v", err)
			}
			err = db.Connect()
			if err != nil {
				panic(err)
			}
			dbConnections[id] = db
		}
	}

	api.GET("/config", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, lensConfig)
	})

	api.GET("/query", func(ctx *gin.Context) {
		widgetID := ctx.Query("id")
		query := ctx.Query("q")

		dbConn, ok := dbConnections[widgetID]
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
