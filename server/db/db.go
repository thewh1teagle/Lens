package db

import (
	"errors"

	"github.com/thewh1teagle/lens/config"
)

func CreateConnections(config config.LensConfig) (dbConnections map[string]DB, err error) {
	dbConnections = make(map[string]DB) // assuming db.New() returns a *sql.DB
	for _, widget := range config.Widgets {
		source, ok := widget.Source.(map[string]interface{})
		if ok {
			sourceType, ok := source["type"].(string)
			if ok && sourceType == "sqlite" {
				path, ok := source["path"].(string)
				if !ok {
					return nil, errors.New("missing path for SQLite database")
				}

				db, err := New(path)
				if err != nil {
					return nil, err
				}

				err = db.Connect()
				if err != nil {
					return nil, err
				}

				dbConnections[path] = db
			}
		}
	}
	return dbConnections, nil
}
