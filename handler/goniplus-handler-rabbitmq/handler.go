package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net"
)

func handleData(conn net.Conn) {
	defer conn.Close()
	defer func() {
		if r := recover(); r != nil {
			log.Println("recovered at handleData: ", r)
		}
	}()
	b, err := ioutil.ReadAll(conn)
	if err != nil {
		return
	}
	var data map[string]interface{}
	if err = json.Unmarshal(b, &data); err == nil {
		enqueue(&b) // Send to queue
	} else {
		log.Println(err)
	}
}

func main() {
	ln, err := net.Listen("tcp", ":9900")
	if err != nil {
		log.Fatalln(err)
		return
	}
	err = connectMQ()
	if err != nil {
		log.Fatalln(err)
		return
	}
	defer ln.Close()
	for {
		conn, err := ln.Accept()
		if err != nil {
			continue
		}
		go handleData(conn)
	}
}
