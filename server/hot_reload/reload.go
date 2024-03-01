package hotreload

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"syscall"

	"github.com/fsnotify/fsnotify"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{} // use default option

func WsPing(ctx *gin.Context) {
	w, r := ctx.Writer, ctx.Request
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade:", err)
		return
	}
	defer c.Close()
	for {
		mt, _, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		if mt == websocket.TextMessage {
			c.WriteMessage(websocket.TextMessage, []byte{})
			if err != nil {
				log.Println("write:", err)
				break
			}
		}
	}
}
func restartSelf() error {
	// Get the executable path
	exe, err := os.Executable()
	if err != nil {
		return fmt.Errorf("getting executable path: %w", err)
	}
	// Use syscall.Exec on Unix-like systems
	if runtime.GOOS != "windows" {
		// Replace the current process with a new one
		err = syscall.Exec(exe, os.Args, os.Environ())
		if err != nil {
			return fmt.Errorf("executing new process: %w", err)
		}
	} else {
		// Start a new process on Windows
		cmd := exec.Command(exe, os.Args...)
		cmd.Env = os.Environ()
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		cmd.Stdin = os.Stdin
		err = cmd.Start()
		if err != nil {
			return fmt.Errorf("starting new process: %w", err)
		}
	}
	// Exit the current process
	os.Exit(0)
	return nil
}

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
				err := restartSelf()
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
