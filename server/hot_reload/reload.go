package hotreload

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"syscall"

	"github.com/fsnotify/fsnotify"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{} // use default option

func WsPing(ctx *gin.Context) {
	fmt.Println("got ws req")
	w, r := ctx.Writer, ctx.Request
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade:", err)
		return
	}
	defer c.Close()
	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		log.Printf("recv:%s", message)
		if mt == websocket.TextMessage {
			c.WriteMessage(websocket.TextMessage, []byte{})
			if err != nil {
				log.Println("write:", err)
				break
			}
		}
	}
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
