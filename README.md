# Overview

This is the repository for our Fall 2017 CSC 210: Web Programming final project. There are two main subdirectories in
the root folder, `/cyberdyne` and `/tyrell`. These are the server and client applications, respectively. Our tech stack
consists of JavaScript targeted at the Node.js runtime and the browser. For the rest of this document, **Cyberdyne**
will refer to the server application in that folder, and **Tyrell** will refer to the client application in its
respective folder.

### The Names

Cyberdyne is the corporation that was contracted by the United States Department of Defense to build **Skynet**, an
artificial intelligence that was to control all of America's arsenal. However, upon achieving self-awareness, Skynet
identified humanity as the greatest threat to its' and the world's existences...

Tyrell Corporation created the **Replicants**, to be used as labor on off-world colonies. They have superior strength,
agility, speed, and intelligence compared to humans.

### How to Install and Setup Project

There are only two hard dependencies for this project: Node.js and PostgreSQL. PostgreSQL is the RDBMS that we use for
the backing datastore. The following tools are preferable, but not required to run or develop with this project:

- Yarn
- nvm
- Visual Studio Code

#### Setup PostgreSQL

Postgres comes up with a CLI (Command-Line Interface) tool called `psql`. While it is possibly simpler to use a GUI to
interact with the databse, I like to use the CLI as I find it to be faster. Here's how to use `psql` to setup the database
for the project:

First, we setup a database and a user:

```bash
▲ ~ psql -U postgres
psql (9.6.2)
Type "help" for help.

postgres=# 
```

This is how you enter the psql shell, which is why you'll see the prompt change. From here, these are the following commands you enter:

```bash
postgres=# CREATE ROLE skynet WITH LOGIN PASSWORD 'password' SUPERUSER;
postgres=# CREATE DATABASE raptor_dev;
postgres=# GRANT ALL PRIVILEGES ON DATABASE raptor_dev TO skynet;
```

This group of commands creates the user `skynet` on the database, sets the password to whatever you enclose in the single quotes, and then
grants the skynet role superuser permissions on the database. Next, the database `raptor_dev` is created, and afterward you grant all privileges
on the newly created database to the skynet role you've just created as well. Now PostgreSQL should be completely configured for development.

However, you want to make sure that all your connection strings match the database configuration as well.

#### Establish Environment Variables for **Cyberdyne**

Immediately after creating your user and database, in the root of the **Cyberdyne** folder, create a file called `.env-cmdrc`. **DON'T FORGET TO**
**PREFIX THE FILENAME WITH A `.`**. This is the dotfile that contains the environment variables used in our server app. It is shaped like a regular
JSON object, with root keys that correspond to the runtime environment, and then key/value pairs for the environment variables we want to set. The
most important of all of these values is the PostgreSQL connection string. A sample `.env-cmdrc` file looks like this:

```json
{
  "development": {
    "PG_CONN_STRING": "postgres://username:password@localhost:5432/dev_db_name",
    "NODE_ENV": "development"
  },
  "production": {
    "PG_CONN_STRING": "postgres://username:password@localhost:5432/prod_db_name",
    "NODE_ENV": "production"
  }
}
```

The `NODE_ENV` variable sets the Node.js runtime environment, and there are certain configurations that we can set that will trigger during a production run
that won't be present during development (e.g. debugging, logging, exposing stack traces to user, etc.).

#### Install Node.js Dependecies

Begin by making sure you have at least Node.js v8. The `.nvmrc` file specifies Node v8.2.1, but the minor/patch versions
don't actually matter. Once you've got these tools installed, then perform the following steps:

Open two different terminal tabs/instances, and cd into the project directories `cyberdyne/` and `tyrell/`. Once there
install the dependencies for each project by typing in

```bash
▲ cyberdyne/cyberdyne   yarn
```

Or, if you decide to forgo using Yarn and just stick with NPM:

```bash
▲ cyberdyne/cyberdyne   npm install
```

Remember that you can use the shorthand command syntax for npm and just enter `npm i` as well.

#### Perform database migrations for Cyberdyne (Server Project)

These migrations only need to be run during production. Disregard during development, as the tables will get dropped
and recreated every time the server is run. Might fix this later after our models and database schema shape starts
to become solid, but for now this works without having to enter `psql` and drop/recreate the db every time we make a
schema change. Sequelize barfed when Knex didn't add a `version` column. I'll fix this later.

`cd` into the Cyberdyne project, and in the project root (where `package.json` is located) type the following commands
into your command prompt or terminal:

```bash
▲ cyberdyne/cyberdyne  yarn run migrate:latest
```

Or, if you're using NPM,

```bash
▲ cyberdyne/cyberdyne  npm run migrate:latest
```

This will execute the database migrations, in sequence, defined in the `cyberdyne/db/migrations/` directory using the
Knex.js binary. Knex will scaffold out the schema definitions using the PostgreSQL connection settings that are
defined within the `knexfile.js` that is colocated with the migrations folder.

## The Stack

### Server

The server stack is built upon Node.js, and uses the Express web framework as the primary server. During development,
Postgres is used as the primary database, as well as for production. All JavaScript is coded to the ECMAScript 2017
standard and additionally makes use of experimental features that aren't yet part of the ECMAScript standard. These
features, colloquially known as ESNext, allow us to write future JavaScript and have it transpiled to code that can run
on the Node.js runtime.

#### Directory Structure

The server root is the `cyberdyne/` directory. Underneath this, you'll find the following folder/file structure:

- **`/config`:** Contains the  database connection file and a utility file for mapping paths in the project.
  - **`knexfile.js`:** this file defines the different connection settings for our databases used in development
  and production. It is used by knex.js, which is a database connection utility and query builder for Node.
  - **`paths.js`:** A special file used to map the root server dir to the rest of our folders. Each path is a value,
  specified by a key and is accessible using dot notation
- **`db/`:** The database configuration files, including our migrations and the connection settings.
-  **`node_modules/`:** The libraries/packages that are imported into the project by Yarn/npm, as specified in the
`package.json` file. Again, no need to edit or touch any of the libraries here, but it will be necessary to import
them into the application when necessary. This folder is not committed to remote, and needs to be created when
cloning the project by initiating the `yarn` or `npm install` shell commands.
-  **`src/`:** The source directory for all server code. Everything that we write will basically exist within this
directory, and has the following contents:
  - **`api/`:** This folder contains all migration files, which are used to keep the database structure
  clean and gracefully alter the structure of the db as the project matures.
    - **`auth/`:** Authentication logic
    - **`models/`:** Model files for Sequelize
    - **`schema/`:** Contains all the necessary code for constructing the GraphQL schema
      - **`resolvers/`:** All GraphQL resolver functions are separated by their type, and included in their own files.
      These are then imported into the master schema file which is used by Apollo Server to create the GraphQL schema.
      - **`scalars/`:** Custom scalar types that are not defined in the GraphQL reference spec.
      - **`types/`:** All GraphQL types, queries, mutations, inputs, and subscriptions are separted by their logical
      "type" and included in their own file. This is then imported into the master schema, similar to how the resolvers
      are.
  - **`utils/`:** Useful utilities for the project are kept here, including:
    - **`console.js`:** Render pretty output to the console
    - **`env.js`:** Environment functions (unused)
    - **`patterns.js`:** Regex patterns used for validation (unused)
  - **`server.js`:** Contains all the scaffolding code for the server application, which is exported so `index.js` can
  make use of it.

### Browser

The client application is built upon ReactQL, a boilerplate for React, Redux, and GraphQL using the Apollo client.

### SSH into DigitalOcean
After creating and obtaining an account from host.  Add the public key to authorized_keys and store each user private key on local machine.  Download PuTTY and PuTTYgen (should be bundled together).  Start PuTTYgen and click Load and select the private key (using show all files).  Click the Save private key button and save the .ppk file under any name.  Start PuTTY and select the session tab.  Set host name to 165.227.68.194 and check SSH connection type.  Navigate to Connection > Data and set your Auto-login username.  Navigate to Connection > SSH > Auth and browse for the ppk file under "Private key file for authentication."  Save the session using the Save button under the Session tab and press Open to connect.  

Or to SFTP transfer.  Login using an ftp client like Filezilla and navigate to the advanced tab and select your ppk private key file after filling in ip, username, etc.

More here too....
