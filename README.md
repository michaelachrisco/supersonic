# supersonic
A micro javascript framework built on React and Relay

** A work in progress, almost ready for alpha! **

## Installation

Easy:
```bash
$ npm install -g supersonic
```

## Usage

### Create a new Supersonic app

```bash
$ ss new ss-demo
```

Supersonic will create a new project for you in a folder with the same name
as your chosen project name.

### Start the server

Go into your newly created project folder and run:
```bash
$ ss server
```

### Setup

Currently we only support a PostgreSQL database, but support for more will be
coming. You'll have to set your database settings in the `config/db.json` file.

```js
{
  "development": {
    "adapter": "postgres",
    "host": "localhost",
    "port": "5432",
    "user": "myusername",
    "password": "mypassword",
    "database": "ss-demo_development"
  },
  "test": {
    "adapter": "postgres",
    "host": "localhost",
    "port": "5432",
    "user": "",
    "password": "",
    "database": "ss-demo_test"
  },
  "production": {
    "adapter": "postgres",
    "host": "localhost",
    "port": "5432",
    "user": "",
    "password": "",
    "database": "ss-demo_production"
  }
}
```

## CLI

### Creating models

You can use the CLI to create a model:

```bash
$ ss generate model User email:string password_digest:string
```

This will generate a model called `User` and a migration file in the
`db/migrate` folder. If the standard migration is good enough for you,
just run:

```bash
$ ss db:migrate
```

and the table will be created. You will automaticall get an id column that
is a UUID, and `created_at` and `updated_at` timestamp fields.

## Querying

Queries return a promise, so you can do something like:

```js
User.where({ email: "foo@bar.com" }).execute().then(results => console.log(results))
```

The results that is returned in the promise will always be an array of
(in this case) `User` model instances.


## Server

Visit `localhost:3000` and there's your app! If all went well you should just
see "Hello World"

Hack away!!!
