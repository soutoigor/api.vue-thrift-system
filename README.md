# API Vue Thrift System

The Backend for the Vue Thrift System.

## Setup

- Create a `.env` file like the `.env.example`.  

- Run a Postgres container with Docker:
```bash
docker run -d -p 5432:5432 --name market -e POSTGRES_PASSWORD=123123 postgres
```
It will run a container with Postgres running in port `5432`, named "market", and set the database password as "123123".
If you change some value, remember to change in the `.env` too. ;)

- Run `npm install`.

- Run migrations:
```bash
node ace migration:run
```

- Run the server:
```bash
npm start
```
