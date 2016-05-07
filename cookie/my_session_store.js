/**
 * Created by 刘冶 on 2016/4/26.
 */

var fs = require('fs');
var path = require('path');

module.exports=function(session) {
    //初始化eventemitte
    var Store = session.Store;
    var filestore = "/session"

    //函数实现
    function  MyFileStore(options){
        var self = this;
        options = options || {};
        filestore = filestore || options.filepath;
        fileExists(filestore);
        Store.call(self, options);
    }

    function fileExists(dirname){
        try{
            fs.accessSync(path.normalize(dirname))
        }catch(err){
                fs.mkdirSync(dirname);
        }
    }

    MyFileStore.prototype.__proto__ = Store.prototype;

    function sid_path(sid)
    {
        var dirpath = path.join(path.resolve(filestore),sid);
        console.log(dirpath);
        return dirpath;
    }


    MyFileStore.prototype.get = function(sid,callback)
    {
        console.log("get");
        var filepath = sid_path(sid);
        console.log("读取"+filepath);
      fs.readFile(filepath,'utf8',function(err,data){
            if(!err){
                var session = JSON.parse(data);
                callback(null,session);
            }else{
                callback(err,null);
            }
        });

    };


    MyFileStore.prototype.set = function(sid,session,callback)
    {
        console.log("set");

        var filepath = sid_path(sid);
        var store_json = JSON.stringify(session);
        console.log("创建"+filepath);
        fs.writeFile(filepath,store_json,'utf8',function(err){
            if (callback) {
                err ? callback(err) : callback(null, session);
            }
    });
    };

    MyFileStore.prototype.destroy = function(sid,callback)
    {
        var filepath = sid_path(sid);
        console.log("删除"+filepath);
        fs.unlinkSync(filepath,callback);
    };
    return MyFileStore;

}