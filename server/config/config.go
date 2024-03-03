package config

import (
	"encoding/json"
	"fmt"
	"os"
)

type AxisConfig struct {
	Format struct {
		Type     string `json:"type"`
		From     string `json:"from,omitempty"`
		To       string `json:"to,omitempty"`
		Timezone string `json:"timezone,omitempty"`
	} `json:"format,omitempty"`
	Key    string `json:"key"`
	Stroke string `json:"stroke,omitempty"`
	Fill   string `json:"fill,omitempty"`
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
	Width           string      `json:"width,omitempty"`
	Height          string      `json:"height,omitempty"`
	Debug           bool        `json:"debug,omitempty"`
	RefreshInterval string      `json:"refresh_interval,omitempty"`
	DateRangeFormat string      `json:"date_range_format,omitempty"`
	DateRange       string      `json:"date_range,omitempty"`
	UserAgent       string      `json:"user_agent,omitempty"`
}

type Task struct {
	Every   string  `json:"every"`
	Command string  `json:"command"`
	Cwd     *string `json:"cwd,omitempty"`
	Verbose *bool   `json:"verbose,omitempty"`
}

type Alert struct {
	Source     interface{} `json:"source"`
	Condition  string      `json:"condition"`
	Url        string      `json:"url"`
	Message    string      `json:"message"`
	Enable     bool        `json:"enable"`
	CheckEvery string      `json:"check_every"`
	Cooldown   *string     `json:"cooldown,omitempty"`
}

type ServerConfig struct {
	Port *int    `json:"port,omitempty"`
	Host *string `json:"host,omitempty"`
}

type LensConfig struct {
	Title       string         `json:"title"`
	Widgets     []WidgetConfig `json:"widgets"`
	Tasks       *[]Task        `json:"tasks,omitempty"`
	Alerts      *[]Alert       `json:"alerts,omitempty"`
	Server      *ServerConfig  `json:"server,omitempty"`
	LensVersion string         `json:"lens_version,omitempty"`
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
