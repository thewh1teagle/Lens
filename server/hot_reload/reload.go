package hotreload

import (
	"log"
	"os"
	"syscall"

	"github.com/fsnotify/fsnotify"
)

func SetupWatcher(file string) (chan struct{}, error) {
	log.Printf("watching %q\n", file)
	w, err := fsnotify.NewWatcher()
	if err != nil {
		return nil, err
	}
	done := make(chan struct{})
	go func() {
		for {
			select {
			case e := <-w.Events:
				log.Printf("watcher received: %+v", e)
				executable, err := os.Executable()
				if err != nil {
					log.Fatal(err.Error())
				}
				err = syscall.Exec(executable, os.Args, os.Environ())
				if err != nil {
					log.Fatal(err)
				}
			case err := <-w.Errors:
				log.Printf("watcher error: %+v", err)
			case <-done:
				log.Print("watcher shutting down")
				return
			}
		}
	}()

	// Watch target file
	err = w.Add(file)
	if err != nil {
		return nil, err
	}
	return done, nil
}
