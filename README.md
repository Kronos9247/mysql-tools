# mysql-tools

## Table of Contents
* [Install](#Install)
* [Introduction](#Introduction)

### Install
This is a [Node.js](https://nodejs.org/) module and available through npm.

Befor installing you must first download and install the latest version of [Node.js](https://nodejs.org/)

```
$ npm install Kronos9247/mysql-tools
```

### Introduction
Mysql-Tools manages multiple connection to the same mysql-database in a data-pool and handles the release of connections and error dispatching inside of the callback function.

It is meant to be used with [express.js](http://expressjs.com/), but can also be used with other identically structed web frameworks

```javascript
const app = require("express")();

const mysql = require("mysql-tools");
let pool = mysql.createPool("localhost", "root", '', "database-name");

app.get('/rest', function(req, res, next) {
  // the connection is automatically closed after the call of the callback function
  mysql.getConnection(pool, function(con) {
    con.query("SELECT * FROM table;", function(err, result) {
      // errors get auto-dispached by mysql-tools and get forwared to express or any other web framework
      if (err) throw err;
      
      res.json(result);
    });

  }, next);
});

module.exports = app;
```
