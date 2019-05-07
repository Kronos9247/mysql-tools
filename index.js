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
    // let connection = await new Promise((resolve, reject) => {
    //     pool.getConnection(function(err, con){
    //         if (err) reject(err);
    
    //         resolve(con);
    //     });
    // });

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