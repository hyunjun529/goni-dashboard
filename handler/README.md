# Handler

데이터를 받아서 RabbitMQ에 삽입하는 Handler입니다.

## Requirements

### Go

Go 1.6버전에서 테스트되었습니다.

### RabbitMQ

`rabbitmq.go` 파일의

    conn, err := amqp.Dial("amqp://id:pw@host:port/")

에서 `id`, `pw`, `host`, `port`를 변경해주세요.

### Port

Handler에서 사용하는 포트는 다음과 같습니다.

* Goni
    * 9000/TCP (Inbound/Outbound)
* Goni+
    * 9900/TCP (Inbound/Outbound)

## Quick Start

각각의 Handler 폴더로 이동 후,

    go build

를 통해 빌드된 Binary를 `nohup`으로 백그라운드에서 실행시켜주시면 됩니다.
