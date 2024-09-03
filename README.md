# Weather Application

This is a Weather Application built with NestJS, TypeORM, and RabbitMQ. It provides APIs to fetch weather data, handle emails using RabbitMQ, and more.

## Prerequisites

- **Node.js**: Version v22 or higher. You can download it from [Node.js official website](https://nodejs.org/).
- **npm**: Comes with Node.js, but ensure it is updated.
- **Docker**: For containerizing services like RabbitMQ and PostgreSQL. Install it from [Docker official website](https://www.docker.com/).
- **Docker Compose**: Generally comes with Docker Desktop, or you can install it separately.
- **TypeScript**: To compile TypeScript files. It should be installed automatically through the npm dependencies.

## Getting Started

Follow these steps to get the application up and running:

### 1. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 2. Start Docker Services
To start the necessary Docker services (RabbitMQ, PostgreSQL, etc.), run:
```bash
docker-compose up -d
```
This will start the services in the background. You can check their status using:
```bash
docker-compose ps
```

### 3. Run Database Migrations
After setting up the Docker services, apply the database migrations to set up the database schema:
```bash
npm run db:migrate:up
```

### 4. Seed the Database (Optional)
If you want to seed the database with initial data, run the following command:
```bash
npm run db:seed
```

### 5. Start the Application
#### Development Mode
To start the application in development mode (with hot-reloading):
```bash
npm run start:dev
```

#### Production Mode
To build and run the application in production mode:
```bash
npm run build
npm run start:prod
```

### 6. Run Tests
To run the tests, use the following command:
```bash
npm run test:e2e
```

### Environment Variables
Make sure to set up the required environment variables in a .env file at the root of the project:
```bash
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name
JWT_SECRET=your_jwt_secret
USER_WEATHER_REQUEST_LIMIT=5
RABBITMQ_URL_CLIENT=amqp://client_user:guest@localhost
RABBITMQ_URL_MICROSERVICE=amqp://microservice_user:guest@localhost
RABBITMQ_QUEUE_NAME_EMAIL=emails_queue
RABBITMQ_DLX_NAME=emails_dead_letter_exchange
RABBITMQ_DLQ_ROUTING_KEY=emails_dead_letter
GMAIL_PASS=your_gmail_password
GMAIL_USER=your_gmail_email
```
