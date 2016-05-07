/**
 * Created by ilove on 2016/5/3.
 */
var mysql = require('mysql');
//var connection = mysql.createConnection({
//    host: '123.206.75.54',
//    user: 'mynote',
//    password: '123456',
//    database: 'mynote'
//});
//
//connection.connect(function (err) {
//    if (err) throw err;
//    //connection.query('SELECT * FROM user', function (err, ret) {
//    //    if (err) throw err;
//    //    console.log(ret);
//    //    connection.end();
//    //});
//    var value = 'yc';
//    var query =  connection.query('SELECT * FROM user where name=?',value, function (err, ret) {
//        if (err) throw err;
//
//        console.log(ret);
//        connection.end();
//    });
//
//    //var value = 'zhang" OR "1"="1';
//    //var query =  connection.query('SELECT * FROM user where name=?',value, function (err, ret) {
//    //    if (err) throw err;
//    //
//    //    console.log(ret);
//    //    connection.end();
//    //});
//
//    console.log(query.sql);
//});

var pool = mysql.createPool({
    connectionLimit: 3,
    host: '123.206.75.54',
    user: 'mynote',
    password: '123456',
    database: 'mynote'
});

//pool.getConnection(function (err, connection) {
//    if (err) throw err;
//
//    var value = 'jrt';
//    var query = connection.query('SELECT * FROM user WHERE name=?', value, function (err, ret) {
//        if (err) throw err;
//
//        console.log(ret);
//        connection.release();
//    });
//    console.log(query.sql);
//});

function startQuery(){
    pool.getConnection(function (err, connection) {
        if (err) throw err;

        var value = 'lhq';
        var query = connection.query('SELECT * FROM user WHERE name=?', value, function (err, ret) {
            if (err) throw err;

            console.log(ret);
            setTimeout(function () {
                connection.release();
            }, 1000);
        });
        console.log(query.sql);
    });
}

for (var i = 0; i < 10; i++) {
    startQuery();
}