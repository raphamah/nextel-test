# Nextel App
This repo is dedicated to use Node, express, mongo, mongoose, redis, mocha, Istanbul, PubSub, Joi, Express validation, Docker, Docker Compose, ESLint, and more things...

## Install with Docker

1- Install Docker in your Machine

2- To run tests, run this command: 

```
docker-compose -f docker-compose-test.yml up --build
```

3- To run the code, run this command: 

```
docker-compose -f docker-compose.yml up --build
```

## Normal Installation

1- Install Mongo and Redis in your machine

2- Change the config file: app/config/config.js

3- Install dependecies, use:

```
yarn --ignore-engines
```

4- To run tests, use:
```
npm run test
```

5- To run tests coverage with istanbul, use:
```
npm run test:coverage
```

OBS: Reports will be located at directory coverage


6- To run the code, use: 
```
npm start
```

7- To run lint, use: 
```
npm run lint
```
