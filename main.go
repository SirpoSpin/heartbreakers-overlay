package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var latestState []byte
var clients = make(map[*websocket.Conn]bool)

func main() {
	fmt.Println("Server starting on http://localhost:8080")

	// Serve static public folder
	http.Handle("/", http.FileServer(http.Dir("./public")))

	// Serve control panel (no router needed)
	http.Handle("/control/", http.StripPrefix("/control/", http.FileServer(http.Dir("./web/control-panel/dist"))))

	// Serve overlay with React Router support
	http.HandleFunc("/overlay/", overlayHandler)

	// WebSocket endpoint
	http.HandleFunc("/ws", handleWebSocket)

	// Broadcast endpoint
	http.HandleFunc("/broadcast", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		msg := r.URL.Query().Get("msg")
		if msg == "" {
			return
		}

		latestState = []byte(msg)
		broadcast(msg)
	})

	// Overlay requests the most recent state on load
	http.HandleFunc("/getLatest", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		if latestState == nil {
			w.Write([]byte("{}"))
			return
		}

		w.Write(latestState)
	})

	http.ListenAndServe(":8080", nil)
}

func overlayHandler(w http.ResponseWriter, r *http.Request) {
	// Path inside /overlay/
	path := r.URL.Path[len("/overlay/"):]
	if path == "" {
		path = "index.html"
	}

	fs := http.Dir("./web/overlay/dist")
	file, err := fs.Open(path)

	if err != nil {
		// File does not exist → serve index.html for React Router
		http.ServeFile(w, r, "./web/overlay/dist/index.html")
		return
	}
	defer file.Close()

	stat, _ := file.Stat()
	http.ServeContent(w, r, path, stat.ModTime(), file)
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}

	clients[conn] = true
	log.Println("Client connected")

	go func() {
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				log.Println("Client disconnected")
				delete(clients, conn)
				conn.Close()
				break
			}
		}
	}()
}

func broadcast(msg string) {
	for conn := range clients {
		err := conn.WriteMessage(websocket.TextMessage, []byte(msg))
		if err != nil {
			log.Println("Broadcast error:", err)
			conn.Close()
			delete(clients, conn)
		}
	}
}
