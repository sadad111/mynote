/**
 * Created by ilove on 2016/5/5.
 */
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/mynote';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    console.log("Connected correctly to server");
    //
    //db.collection('user').save({name:'wang',passwd:'12'},function(err,ret){
    //    if(err) throw err;
    //    console.log(ret);
    //});

    //db.collection('user').find().toArray(function(err,list){
    //    if(err) throw err;
    //    console.log(list);
    //});

    db.collection('user').find({"name":"zhang"}).toArray(function(err,list){
        if(err) throw err;
        console.log(list);
    });
});