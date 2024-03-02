package config

import (
	"encoding/json"
	"fmt"
	"os"
)

type AxisConfig struct {
	Format struct {
		Type     string  `json:"type"`
		From     string  `json:"from"`
		To       string  `json:"to"`
		Timezone *string `json:"timezone"`
	} `json:"format"`
	Key    string `json:"key"`
	Stroke string `json:"stroke"`
	Fill   string `json:"fill"`
}

type SqliteSource struct {
	Type  string `json:"type"`
	Path  string `json:"path"`
	Query string `json:"query"`
}

type URLSource struct {
	Type string `json:"type"`
	URL  string `json:"url"`
}

type FSSource struct {
	Type string `json:"type"`
	Path string `json:"path"`
}

type WidgetConfig struct {
	ID              string      `json:"id"`
	Title           string      `json:"title"`
	ChartType       string      `json:"chart_type"`
	Source          interface{} `json:"source"`
	X               AxisConfig  `json:"x"`
	Y               AxisConfig  `json:"y"`
	Width           string      `json:"width"`
	Height          string      `json:"height"`
	Debug           bool        `json:"debug"`
	RefreshInterval string      `json:"refresh_interval"`
	DateRangeFormat string      `json:"date_range_format"`
	DateRange       string      `json:"date_range"`
	UserAgent       string      `json:"user_agent"`
}

type Task struct {
	Every   string  `json:"every"`
	Command string  `json:"command"`
	Cwd     *string `json:"cwd"`
	Verbose *bool   `json:"verbose"`
}

type ServerConfig struct {
	Port *int    `json:"port"`
	Host *string `json:"host"`
}

type LensConfig struct {
	Title        string         `json:"title"`
	Widgets      []WidgetConfig `json:"widgets"`
	Tasks        []Task         `json:"tasks"`
	ServerConfig *ServerConfig  `json:"server"`
}

func ReadConfig(path string) (*LensConfig, error) {
	// Read the contents of the file
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %v", err)
	}

	// Initialize an empty MyConfig struct
	config := &LensConfig{}

	// Unmarshal the JSON data into the struct
	if err := json.Unmarshal(data, config); err != nil {
		return nil, fmt.Errorf("failed to unmarshal JSON: %v", err)
	}

	return config, nil
}

func WidgetsMap(config *LensConfig) map[string]WidgetConfig {
	// Assuming that 'LensConfig' has a field called 'Widgets' which is a slice of Widget structs
	// and that each Widget struct has a field called 'id' which is a string.

	// Create an empty map to hold the mapping of widget IDs to WidgetConfig structs
	widgetMap := make(map[string]WidgetConfig)

	// Loop through each widget in the 'Widgets' slice of the 'config'
	for _, widget := range config.Widgets {
		// Add the widget ID and the corresponding WidgetConfig to the map
		widgetMap[widget.ID] = widget
	}

	// Return the map containing the widget IDs and their corresponding WidgetConfigs
	return widgetMap
}
