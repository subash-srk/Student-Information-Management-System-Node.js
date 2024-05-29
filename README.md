# Student Information Management System.
> Graphical interface for maintaining student information

[![Tech](https://skillicons.dev/icons?i=nodejs,express,postgres,js,html,css)](https://skillicons.dev)

This project “Student Information Management System” provides us a graphical interface for maintenance of student information. It can be used by educational institutes or colleges to maintain the records of students easily. 

## Installing / Getting started

A quick introduction of the minimal setup you need to get a hello world up &
running.

```shell
npm install # installing the dependencies
```

You have to create a database on pgAdmin. Queries are given in db.sql file.

Then create an .env file that have all the enviroment variables. Specify the values correctly.

```shell
PG_USER=""
PG_HOST=""
PG_DATABASE=""
PG_PASSWORD=""
PG_PORT=""
SESSION_SECRET=""
PORT=""
```
Then you can run this project by the following command.

```shell
node index.js
```