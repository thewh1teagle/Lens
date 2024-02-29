package db

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"reflect"

	_ "github.com/mattn/go-sqlite3"
)

type SqliteDB struct {
	path string
	db   *sql.DB
}

func New(path string) (*SqliteDB, error) {
	conn := &SqliteDB{
		path: path,
	}
	return conn, nil
}

func (s *SqliteDB) Connect() error {
	// Open the SQLite database connection
	db, err := sql.Open("sqlite3", s.path)
	if err != nil {
		panic(err)
	}
	s.db = db
	return nil
}

func (s *SqliteDB) Disconnect() error {
	// Close the SQLite database connection
	if s.db != nil {
		err := s.db.Close()
		if err != nil {
			return err
		}
		s.db = nil
	}
	return nil
}

func (s *SqliteDB) Query(query string) ([]byte, error) {
	fmt.Printf("running %v\n", query)
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	// Create a slice of empty interface to store the query results.
	var results []interface{}

	// Create a slice of empty interface to scan the query results into.
	values := make([]interface{}, len(columns))
	for i := range columns {
		values[i] = new(interface{})
	}

	for rows.Next() {
		// Scan the query results into the slice of empty interfaces.
		if err := rows.Scan(values...); err != nil {
			return nil, err
		}

		// Create a map to store the column name and corresponding value.
		rowData := make(map[string]interface{})
		for i, column := range columns {
			rowData[column] = reflect.Indirect(reflect.ValueOf(values[i])).Interface()
		}

		// Append the map to the slice of query results.
		results = append(results, rowData)
	}

	// Marshal the slice of query results into JSON.
	return json.Marshal(results)
}
