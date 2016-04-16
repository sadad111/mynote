/*
 * Created by 刘冶 on 2016/3/15.
 */

var express =  require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session');
var moment = require('moment');
//引入 mongoose
var mongoose = require('mongoose');

//引入模型
var model = require('./models/models');



var User =model.User;
var Note =model.Note;

//使用 mongoose 连接服务
mongoose.connect('mongodb://localhost:27017/notes');
mongoose.connection.on('error',console.error.bind(console,'连接数据库失败'));


var pagelengh = 2;
//express实例
var app = express();

//定义EJS模板引擎和模板文件位置

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//建立session模型
app.use(session({
    secret: '1234',
    name: 'mynote',
    cookie: {maxAge: 1000 * 60 * 20 }, //设置session保存时间为20分钟
    resave: false,
    saveUninitialized: true
}));

app.use(function(req, res ,next){
    var err = req.session.error;
    delete req.session.error;
    message_error=null;
    if (err) message_error = err;
    next();
});
function authentication(req, res, next) {

	 if (!req.session.user) {
        req.session.error='请先登陆';
        return res.redirect('/login');
    }
    next();
}
function notAuthentication(req, res, next) {
    if (req.session.user) {
        req.session.error='已登陆';
        return res.redirect('/');
    }
    next();
}
function divpage(current,req,res){

    if (!req.session.user) {
        req.session.error='请先登陆';
        return res.redirect('/login');
    }
    var user =req.session.user;
    var all=Note.find({author: user.username});
    all.exec(function(err,notes){
        var  allnotes= notes.length;
         console.log(allnotes);
        var counts,pagehtml="";
        if(allnotes%pagelengh==0){
            counts = parseInt(allnotes/pagelengh);
        }else{
            counts = parseInt(allnotes/pagelengh)+1;
        }
        var currentpage =current;
        //只有一页内容
        if(allnotes<=pagelengh){pagehtml="";}
        //大于一页内容
        if(allnotes>pagelengh){
            if(currentpage>1){
                pagehtml+= '<li><a href="/index/'+(currentpage-1)+'">上一页</a></li>';
            }
            for(var i=0;i<counts;i++){
                if(i>=(currentpage-3) && i<(currentpage+3)){
                    if(i==currentpage-1){
                        pagehtml+= '<li class="active"><a href="/index/'+(i+1)+'">'+(i+1)+'</a></li>';
                    }else{
                        pagehtml+= '<li><a href="/index/'+(i+1)+'">'+(i+1)+'</a></li>';
                    }

                }
            }
            if(currentpage<counts){
                pagehtml+= '<li><a href="/index/'+(currentpage+1)+'">下一页</a></li>';
            }
        }
        console.log(pagehtml);
        Note.find({author:user.username}).limit(pagelengh).skip((current-1)*pagelengh)
            .exec(function(err, allNotes){
                if(err) {
                    console.log(err);
                    return res.redirect("/search");
                }
                res.render('index', {
                    user: req.session.user,
                    title: '笔记列表',
                    notes: allNotes,
                    pagehtml: pagehtml
                });
            });
    });

}

function checkcookies(req,res,next){
 
   var cookies = {}; // 保存请求中所有的cookie数据,之后直接可以cookies.name获取cookie的值
   var cookieString = req.headers.cookie; // 因为这里直接把cookie的字符串返回了,所以要方便用的话得处理一下
// 下边解析一下cookie字符串,保存到cookies对象中
    var pairs = cookieString.split(/[;,] */);
    for (var i =0; i < pairs.length; i++){
        var idx = pairs[i].indexOf('=');
        var key = pairs[i].substr(0, idx);
        var val = pairs[i].substr(++idx, pairs[i].length).trim();
        cookies[key] = val;
    }
    if(cookies["user_cookie"]!=null){
    if(cookies["user_cookie"].length>5)
    {
	console.log(cookies["user_cookie"]!=null);
	console.log(cookies["user_cookie"]);
        var check =cookies["user_cookie"].split("_");
        var username=check[0];
        var password=check[1];
        req.session.user={username: username,password:password}
    }
}
	next();
}



app.all('/login', notAuthentication);
app.all('/register', notAuthentication);
app.get('/quit',authentication);
app.get('/detail',authentication);
app.get('/post',authentication);
app.get('/index/:current',authentication);
//app.get('/',authentication);
app.get('/',checkcookies)
//响应首页get请求
app.get('/',function(req,res){
	 divpage(1,req,res);

});
app.get("/index/:current",function(req,res){
    var current = parseInt(req.params.current);
    divpage(current,req,res);
});

app.get('/register',function(req , res){
    res.render('register', {
        user: req.session.user,
        title: '注册',
        error: ''
    });
});

app.post('/register',function(req ,res){
    //req.body可以获取表单各项数据
    var username = req.body.user,
        password = req.body.pwd,
        passwordRepeat = req.body.repwd;

    //检查数据是否存在避免重复注册
    User.findOne({username: username}, function(err , user){
        if(err) {
            console.log(err);
            return res.redirect('/register');
        }

        if(user) {
            console.log('用户名已经存在');
            req.session.error = "用户名已经存在";
            return res.redirect('/register');
        }

        //对密码加密
        var md5 = crypto.createHash('md5'),
            md5password = md5.update(password).digest('hex');

        //新建对象保存
        var newUser = new User({
            username: username,
            password: md5password,
            createTime: new Date()
        });

        newUser.save(function(err, doc) {
            if(err){
                console.log(err);
                return res.redirect('/register');
            }
            console.log('注册成功');
            req.session.succcess = "注册成功";
            return res.redirect('/login');
        });
    });
});

app.get('/login',function(req , res){
    res.render('login', {
        user: "",
        title: '登陆',
        error:''
    });
});

app.post('/login',function(req ,res){
    var username = req.body.username,
        password = req.body.passwd;
    User.findOne({username: username}, function(err , user){
        if(err) {
            console.log(err);
//            $.cookie('user_cookie',null);
            return res.redirect('/login');
        }

        if(!user) {
            console.log('用户名不存在');
            req.session.error = "用户名不存在";
            res.clearCookie("user_cookie");
            return res.redirect('/login');
        }

        //对密码加密
        var md5 = crypto.createHash('md5'),
            md5password = md5.update(password).digest('hex');

       if(user.password !== md5password) {
           console.log('密码错误');
           req.session.error = "密码错误";
           res.clearCookie("user_cookie");
           return res.redirect('/login');
       }
            console.log('登陆成功');
            user.password = null;
            delete  user.password;
            req.session.user = user;
            return res.redirect('/');
    });
})

app.get('/quit',function(req , res){
    req.session.user = null;
    res.clearCookie("user_cookie");
   return res.redirect('/login')
});


app.get('/post',function(req , res){
    res.render('post', {
        user: req.session.user,
        title: '发布'
    });
});

app.post('/post',function(req ,res){
    console.log(req.body.content);
    var note = new Note ({
        title: req.body.title,
        author: req.session.user.username,
        tag: req.body.tag,
        content: req.body.content,
        createTime: new Date()
    });

    note.save(function(err, doc) {
        if(err) {
            console.log(err);
            return res.redirect('/post');
        }
        console.log('文章发表成功！');
        req.session.succcess = "文章发表成功";
        return res.redirect('/');
    });
});

//响应首页get请求
app.get('/detail/:_id',function(req , res){
    Note.findOne({_id:req.params._id})
            .exec(function(err, art){
                if(err){
                    console.log(err);
                    return res.redirect('/');
                }
                if(art) {
                    res.render('detail', {
                        title: '笔记详情',
                        user: req.session.user,
                        art:  art,
                        moment: moment
                    });
                }
            });

});


app.get('/search',function(req , res){
    res.render('search', {
        user: req.session.user,
        title: '搜索'
    });
});
//监听3000端口

app.listen(80, function(req, res){
   console.log('app is running at port 3000');
});
