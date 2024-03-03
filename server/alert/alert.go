package alert

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/thewh1teagle/lens/config"
	"github.com/thewh1teagle/lens/db"
)

// Task represents a task to be executed
type Alert struct {
	Source     interface{} `json:"source"`
	Condition  string      `json:"condition"`
	Url        string      `json:"url"`
	Message    string      `json:"message"`
	Enable     bool        `json:"enable"`
	CheckEvery string      `json:"check_every"`
	Cooldown   *string     `json:"cooldown"`
	LastTime   time.Time
}

func action(alert config.Alert, rows []map[string]interface{}) {
	var message string

	if strings.Contains(alert.Message, "$") {
		message = alert.Message

		// Replace variables (strings which starts with $) with corresponding values
		for key, value := range rows[0] {
			message = strings.ReplaceAll(message, "$"+key, fmt.Sprintf("%v", value))
		}
	} else {
		message = alert.Message
	}

	// Send a POST request with the message to the specified URL
	resp, err := http.Post(alert.Url, "application/json", strings.NewReader(message))
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	// Print the response status code
	// fmt.Println("Response status code:", resp.StatusCode)

	// Close the response body
	resp.Body.Close()
}

func Run(config config.LensConfig, dbConnections map[string]db.DB) {
	// Initialize a map to keep track of the last run time of each task
	lastRunTimes := make(map[int]time.Time)

	// Create a channel to receive signals from the ticker
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	// Initialize a map to keep track of the cooldown times
	cooldownTimes := make(map[int]time.Time)

	for range ticker.C {
		for i, alert := range *config.Alerts {
			// Check if the alert is enabled
			if !alert.Enable {
				continue
			}

			// Check if it's time to run the alert
			if time.Since(lastRunTimes[i]).Minutes() > parseDuration(alert.CheckEvery).Minutes() {
				// Check if the cooldown period has elapsed
				if alert.Cooldown == nil || time.Since(cooldownTimes[i]).Minutes() > parseDuration(*alert.Cooldown).Minutes() {
					// Execute the alert

					source, _ := alert.Source.(map[string]interface{})
					query, _ := source["query"].(string)
					path, _ := source["path"].(string)
					dbConn := dbConnections[path]

					result, _ := dbConn.Query(query)
					var rows []map[string]interface{}
					err := json.Unmarshal(result, &rows)
					if err != nil {
						fmt.Println("Error:", err)
						return
					}
					conditionResult, err := parseCondition(alert, rows)
					if err != nil {
						fmt.Printf("Error running alert %d: %v\n", i+1, err)
					}

					if conditionResult {
						// Execute the alert action
						action(alert, rows)
						// Update the cooldown time
						if alert.Cooldown != nil {
							cooldownTimes[i] = time.Now()
						}
					}

					// Update the last run time
					lastRunTimes[i] = time.Now()
				}
			}
		}
	}
}

// parseCondition takes an Alert and an array of key-value pairs (keyValResults) and evaluates the condition for each pair.
func parseCondition(alert config.Alert, keyValResults []map[string]interface{}) (bool, error) {
	parts := strings.Split(alert.Condition, " ")

	// Check if the condition string is in the correct format (contains 3 parts separated by spaces)
	if len(parts) != 3 {
		return false, fmt.Errorf("invalid condition format: %s", alert.Condition)
	}

	// Extract the operator and value from the condition string
	operator := parts[1]

	// Replace the "$" sign with the corresponding value from keyValResult for both sides
	for i, part := range parts[:2] {
		if strings.HasPrefix(part, "$") {
			key := strings.TrimPrefix(part, "$")
			for _, keyValResult := range keyValResults {
				if val, ok := keyValResult[key]; ok {
					parts[i] = fmt.Sprintf("%v", val)
					break
				}
			}
		}
	}

	// Convert the operands to float64
	left, err := strconv.ParseFloat(parts[0], 64)
	if err != nil {
		return false, fmt.Errorf("invalid left operand: %s", parts[0])
	}

	right, err := strconv.ParseFloat(parts[2], 64)
	if err != nil {
		return false, fmt.Errorf("invalid right operand: %s", parts[2])
	}
	// fmt.Printf("condition is %v %v %v\n", left, operator, right)
	// Evaluate the condition
	switch operator {
	case ">":
		return left > right, nil
	case "<":
		return left < right, nil
	case "==":
		return left == right, nil
	default:
		return false, fmt.Errorf("invalid operator in condition: %s", operator)
	}
}

func parseDuration(str string) time.Duration {
	duration, err := time.ParseDuration(str)
	if err != nil {
		panic(err)
	}
	return duration
}
