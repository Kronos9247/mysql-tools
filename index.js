const mysql = require("mysql");

function mysql_createpool(hostname, username, password, database=undefined, port=undefined, poolSize=100) {
    return mysql.createPool({
        host: hostname,
        user: username,
        database: database,
        password: password,
        port: port,

        connectionLimit: poolSize
    })
}
module.exports.createPool = mysql_createpool;

async function mysql_getconnection(con) {
    let connection = await new Promise((resolve, reject) => {
        con.getConnection(function(err, con){
            if (err) reject(err);
    
            resolve(con);
        });
    });

    return connection;
}
function mysql_getconnection_autoclose(pool, callback, next=undefined) {
    mysql_getconnection(pool).then((con) => {
        callback(con);

        con.release();
    }).catch((err) => {
        if (next) next(err);
        else throw err;
    });
}
module.exports.getConnection = mysql_getconnection_autoclose;