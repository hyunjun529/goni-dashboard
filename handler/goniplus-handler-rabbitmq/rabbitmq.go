package main

import (
	"github.com/streadway/amqp"
	"log"
	"time"
)

// exchangeName is the name of exchange
const exchangeName = "goniplus"

// dbQueueName is the name of queue for data insert
const dbQueueName = "goniplus_queue_db"

// pushQueueName is the name of queue for send push message(s) to user(s)
const pushQueueName = "goniplus_queue_push"

type rabbitConnection struct {
	conn *amqp.Connection
	ch   *amqp.Channel
	err  chan *amqp.Error
}

var rabbit *rabbitConnection

func createChannel() (*amqp.Channel, error) {
	ch, err := rabbit.conn.Channel()
	if err != nil {
		return nil, err
	}
	// Declare exchange for multiple works
	err = ch.ExchangeDeclare(
		exchangeName, // name
		"fanout",     // type
		true,         // durable
		false,        // auto-deleted
		false,        // internal
		false,        // no-wait
		nil,          // arguments
	)
	// Declare & bind queue for push notification to user
	push, err := ch.QueueDeclare(
		pushQueueName, // name
		true,          // durable
		false,         // delete when unused
		false,         // exclusive
		false,         // no-wait
		nil,           // arguments
	)
	if err != nil {
		return nil, err
	}
	err = ch.QueueBind(
		push.Name,
		"",           // routing key
		exchangeName, // exchange
		false,
		nil,
	)
	if err != nil {
		return nil, err
	}
	// Declare & bind queue for insert metrics to database
	db, err := ch.QueueDeclare(
		dbQueueName, // name
		true,        // durable
		false,       // delete when unused
		false,       // exclusive
		false,       // no-wait
		nil,         // arguments
	)
	if err != nil {
		return nil, err
	}
	err = ch.QueueBind(
		db.Name,
		"",           // routing key
		exchangeName, // exchange
		false,
		nil,
	)
	if err != nil {
		return nil, err
	}
	return ch, nil
}

func createConnection() {
	for {
		conn, err := amqp.Dial("amqp://id:pw@host:port/")
		if err == nil {
			rabbit.conn = conn
			rabbit.err = make(chan *amqp.Error)
			rabbit.conn.NotifyClose(rabbit.err)
			ch, err := createChannel()
			if err != nil {
				log.Println(err)
				continue
			}
			rabbit.ch = ch
			return
		}
		log.Println(err)
		time.Sleep(1 * time.Second)
	}
}

func connectQueue() {
	var rabbitErr *amqp.Error
	for {
		rabbitErr = <-rabbit.err
		if rabbitErr != nil {
			createConnection()
		}
	}
}

func enqueue(data *[]byte) (bool, error) {
	log.Println(string(*data))
	err := rabbit.ch.Publish(exchangeName, "", false, false, amqp.Publishing{
		ContentType: "application/json",
		Body:        *data,
	})
	if err != nil {
		return false, err
	}
	return true, nil
}

func initQueue() {
	rabbit = &rabbitConnection{}
	rabbit.err = make(chan *amqp.Error)
	go connectQueue()
	rabbit.err <- amqp.ErrClosed
}
