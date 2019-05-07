/**
 *  Copyright 2019 Rafael Orman
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


const mysql = require("mysql");
var util = require("util");

function mysql_createpool(hostname, username, password, database=undefined, port=undefined, poolSize=100) {
    return mysql.createPool({
        host: hostname,
        user: username,
        database: database,
        password: password,
        port: port,

        connectionLimit: poolSize
    });
}
module.exports.createPool = mysql_createpool;

async function mysql_getconnection(pool) {
    var getConnection = pool.getConnection;
    let connection = await util.promisify(getConnection.bind(pool))();

    return connection;
}
function mysql_getconnection_autoclose(pool, callback, next=undefined) {
    let promise = mysql_getconnection(pool).then((con) => {
        new Promise(function(resolve) {
            callback(con);

            resolve();
        }).then(() => con.release()).catch(function(err) {
            con.release();

            if(typeof next === "function") next(err);
            else throw err;
        });
    });


    if(typeof next === "function") {
        promise.catch(next);
    }
    else promise.catch((err) => { throw err });
}
module.exports.getConnection = mysql_getconnection_autoclose;
