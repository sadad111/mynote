/**
 * Created by ilove on 2016/5/7.
 */
var Waterline = require('waterline');
var mysqlAdapter = require('sails-mysql');
var mongoAdapter = require('sails-mongo');


var User = require('../models/models').User;
var Note = require('../models/models').Note;

// 适配器
var adapters = {
    mongo: mongoAdapter,
    mysql: mysqlAdapter,
    default: 'mongo'
};

// 连接
var connections = {
    mongo: {
        adapter: 'mongo',
        url: 'mongodb://localhost:27017/notes'
    },
    mysql: {
        adapter: 'mysql',
        url: 'mysql://root:123456@localhost/notes?useUnicode=true&characterEncoding=utf-8'
    }
};

var config = {
    adapters: adapters,
    connections: connections
}

var orm = new Waterline();
orm.loadCollection(User);
orm.loadCollection(Note);

exports.wlconfig = config;
exports.orm = orm;