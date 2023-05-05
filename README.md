# Carbon Usage Tracker

The Carbon Usage Tracker is a web application designed to store and manage carbon usage data for customers. The application features a NestJS backend and uses a PostgreSQL database for storing data. It has three main entities: User, Usage, and Usage_Type.

## Table of Contents

- [Features](#features)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Technical Details](#technical-details)

## Features

- Secure user authentication with JWT (JSON Web Tokens)
- Refresh token ability for longer user authentication duration
- CRUD operations for managing ```user```, ```usage```, and ```usage_type``` entities
- Swagger OpenAPI documentation for easy API usage

## API Documentation

The API documentation is available through Swagger OpenAPI. You can access it at the following links:

- Swagger UI: http://localhost:3000/api
- JSON: http://localhost:3000/api-json

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/huberzeljko/coding-challenge.git
   ```

2. Change to the project directory:

   ```
   cd coding-challenge
   ```

3. Set up environment variables:

   Create a `.env` file in the project root directory and add the necessary variables (see `.env.example`)


4. Starting application using [Docker](https://www.docker.com/)

   ```
   docker compose up
   ```

The application will now be running at http://localhost:3000.

## Testing

There are few unit test and E2E tests in application. E2E tests database is created using docker so there's no need to handle this manually.

1. Run tests:

   ```
   yarn test
   ```
   
2. Run E2E tests

   ```
   yarn test:e2e
   ```
## Technical Details

The development of the Carbon Usage Tracker application took approximately two and a half working days (20h). Application structure is similar to clean architecture which consists of `api`, `application`, `domain`, `persistence` and `shared` layers. ORM used for database access is [TypeORM](https://typeorm.io). 

Authentication is implemented using JWT Bearer authentication, while the app also supports longer refresh tokens which enable users to generate new access tokens. Main reason for this is improved security so that if short-lived access token gets stolen, they can be used only for a limited time, while longer lived refresh token are only sent over the network once when getting new access token and are stores more securely. This also gives us ability to revoke user sessions if needed (e.g. when password is changed, system logs out all active sessions by clearing all refresh tokens from database).

Possible improvements:
1. If the application starts getting bigger and bigger, it'd be nice to migrate to microservices infrastructure. [NestJS](https://docs.nestjs.com/microservices/basics) has a nice migration guide and setup for microservice architecture
2. Improve code coverage to 100%
3. Add CI/CD pipepline for deployments
