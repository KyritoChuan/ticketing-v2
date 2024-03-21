# ticketing-v2

Este portfolio se trata de un sistema de venta de tickets. 
Consta de una serie de servicios, los cuales se comunican a través de eventos con RabbitMQ.
Estos servicios a su vez, se consumen a través de una api-gateway (Comunicación por TCP).

Cada servicio tiene su correspondiente base de datos (Postgres).

Los proyectos están Dockerizados y con un cluster de kubernetes para tener un ambiente (desplegando el ambiente en cluster local con skaffold).

Las tecnologías ocupadas en este proyecto fueron:
* NestJS
* Postgres
* Typescript
* RabbitMQ
* Redis
* Docker
* Kubernetes
