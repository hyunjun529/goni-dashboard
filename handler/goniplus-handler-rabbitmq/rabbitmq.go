package main

import (
	"github.com/streadway/amqp"
	"log"
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
}

var rabbit rabbitConnection

func connectMQ() error {
	// Get connection
	conn, err := amqp.Dial("amqp://id:pw@host:port/")
	if err != nil {
		return err
	}
	// Create channel from connection
	ch, err := conn.Channel()
	if err != nil {
		return err
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
		return err
	}
	err = ch.QueueBind(
		push.Name,
		"",           // routing key
		exchangeName, // exchange
		false,
		nil,
	)
	if err != nil {
		return err
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
		return err
	}
	err = ch.QueueBind(
		db.Name,
		"",           // routing key
		exchangeName, // exchange
		false,
		nil,
	)
	if err != nil {
		return err
	}
	rabbit = rabbitConnection{
		conn,
		ch,
	}
	return nil
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
