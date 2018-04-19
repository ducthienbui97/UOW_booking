# UOW Booking system

This is the system my group developed as group project assestment for CSIT214 at University of Wollongong. The system is meant to be an event booking system that can handle booking and manage events (paid or free) in a typical university.

## Group member

- Andre Knell
- Xinya Lei
- Julia Aoqi Zhang
- Thien Bui

## System requirement

The system require using ``Node.js 8.1.1`` and ``Yarn 1.5.1`` to run. Compatible Node.js can be found [here](https://nodejs.org/dist/v8.11.1/).  Lastest Yarn can be found [here](https://yarnpkg.com/en/). The system also require a PostgreSQL database. The lastest version of PostgreSQL can be found [here](https://www.postgresql.org/).

## Getting started

After installing ``Node.js`` and ``Yarn``, make sure the environment have following variables:

- DEV_DATABASE_URL: URL of the database for development/test environment (optional for production environment)
- DATABASE_URL: URL of the database for production environment (optional for development or test environment)
- IMGUR: Imgur client token to access upload feature of imgur.com
- PUBLIC_KEY: Stripe public key
- PRIVATE_KEY: Stripe private key

To ensure enviroment variables setup, it's recommended to use a ```.env``` file. To setup ```.env``` file, use command ```yarn setup:env```

After having all the environment variables, the next step is to install all dependences and migrate the database. First, run command ```yarn install``` to install all of the system dependences. Then use command ```yarn setup:migrate``` to migrate the database. If there's any problem, or database need to be reset, command ```yarn setup:demigrate``` can be run to demigrate the database.

When all libraries are installed and the database is migrated, the website can be start with command ```yarn start```

## Credit

The system is ran using:

- [```Node.js```](https://nodejs.org/en/) for environment.
- [```Express.js```](https://expressjs.com/) for backend.
- [```EJS```](http://ejs.co/) for frontend view engine.
- [```Yarn```](https://yarnpkg.com/en/) for backend package management.
- [```Bower```](https://bower.io/) for frontend package management.
- [```PosgreSQL```](https://www.postgresql.org/) for database.
- [```Sequelize```](http://docs.sequelizejs.com/) for object relational mapping.
- [```Passport```](http://www.passportjs.org/) for user authentication.
- [```Stripe```](https://stripe.com/au) for payment processing.
- [```Imgur```](http://imgur.com/) for image hosting.
- [```Heroku```](http://heroku.com/) for demo website and database hosting.
- [```ElephantSQL```](https://www.elephantsql.com/) for development database hosting.

Full list of libraries can be found in:

- ```package.json``` for backend library
- ```bower.json``` for frontend library

Some files in the project is automatically generated using [```express-generator```](https://expressjs.com/en/starter/generator.html) and [```sequelize-cli```](http://docs.sequelizejs.com/manual/tutorial/migrations.html) or modified version of following tutorials: [Using Passport With Sequelize and MySQL](https://code.tutsplus.com/tutorials/using-passport-with-sequelize-and-mysql--cms-27537) and [Getting Started with Node, Express and Postgres Using Sequelize](https://scotch.io/tutorials/getting-started-with-node-express-and-postgres-using-sequelize)
