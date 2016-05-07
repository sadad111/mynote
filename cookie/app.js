var express = require('express');
var parseurl = require('parseurl');
var session = require("express-session");
var mysession_store = require("./my_session_store")(session);

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store:new mysession_store()
}));

app.use(function(req,res,next){
    var views = req.session.views;
    if (!views) {
        views = req.session.views = {};
    }
    //get the url pathname
    var pathname = parseurl(req).pathname;
    //count the views
    views[pathname] = (views[pathname] || 0)+1;
    next();
});

app.get("/",function (req,res,next) {
    res.write("you viewd this page "+ req.session.views['/']+'times');
    //res.json(req.cookies);
    res.end();
})

app.get("/read",function (req,res,next) {
    res.json(req.session);
})

app.get("/write",function (req,res,next) {
    req.session.yc={name:'my_cookie',hello:'hello'};
    res.json(req.session);
})

app.get("/delete",function (req,res,next){
    req.session.destroy();
    res.write('Deleted');
    res.end();
})
app.listen(3000);
console.log("Server running at port : 3000");