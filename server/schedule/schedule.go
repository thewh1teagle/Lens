package schedule

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"
)

// Task represents a task to be executed
type Task struct {
	Every    string  `json:"every"`
	Command  string  `json:"command"`
	CWD      *string `json:"cwd,omitempty""`
	Verbose  *bool   `json:"verbose,omitempty""`
	LastTime time.Time
}

func Run(configPath string) {
	// Open the JSON file

	file, err := os.Open(configPath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	// Decode the JSON configuration
	var config struct {
		Tasks []Task `json:"tasks"`
	}
	if err := json.NewDecoder(file).Decode(&config); err != nil {
		fmt.Println("Error decoding JSON:", err)
		return
	}

	// Initialize a map to keep track of the last run time of each task
	lastRunTimes := make(map[int]time.Time)

	// Create a channel to receive signals from the ticker
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
	for range ticker.C {
		for i, task := range config.Tasks {
			// Check if it's time to run the task
			if time.Since(lastRunTimes[i]).Minutes() > parseDuration(task.Every).Minutes() {
				// Execute the command
				commands := strings.Fields(task.Command)
				command := commands[0]
				args := commands[1:]
				cmd := exec.Command(command, args...)
				if task.CWD != nil {
					cmd.Dir = *task.CWD
				}

				if task.Verbose != nil && *task.Verbose {
					cmd.Stderr = os.Stderr
					cmd.Stdout = os.Stdout
				}

				err := cmd.Run()
				if err != nil {
					fmt.Printf("Error running task %d: %v\n", i+1, err)
				}
				// Update the last run time
				lastRunTimes[i] = time.Now()
			}
		}
	}
}

func parseDuration(str string) time.Duration {
	duration, err := time.ParseDuration(str)
	if err != nil {
		panic(err)
	}
	return duration
}
