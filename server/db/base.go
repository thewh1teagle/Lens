package db

// DB interface
type DB interface {
	Query(query string) ([]byte, error)
	Connect() error
	Disconnect() error
}

// BaseDB struct that implements DB interface
type Driver struct{}
