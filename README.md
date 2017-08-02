 "dependencies": {
    "body-parser": "~1.17.1",
    "cookie-parser": "~1.4.3",
    "debug": "~2.6.3",
    "ejs": "~2.5.6",
    "express": "~4.15.2",
    "morgan": "~1.8.1",
    "serve-favicon": "~2.4.2"
  }

Node.js开发指南 microblog 基于express4.15.2
-----
###创建项目
`express --ejs microblog`

###配置项目
`cd microblog && npm install`

###安装supervisor
>参考supervisor安装方法
>####启动supervisor
>书中启动的方式较老，由于express的框架重构，查阅相关资料之后，启动方式为：
>`supervisor bin/www `

跟着书接下来该是导入Bootstrap和添加layout.ejs，由于express不支持ejs模块的partials方法，所以需要自己额外安装模块：
`npm install express-partials`

app.js中添加：
```
var partials = require('express-partials');
app.use(partials());
```

接下来是安装配置MongoDB,
因为我用的是MacOs，我直接参考了[地址](http://www.cnblogs.com/corvoh/p/5766722.html)

连接数据库参考了[连接数据库](http://www.cnblogs.com/yuanzm/p/3770986.html)
#####博客提示写出这样
		app.use(session({
		secret: settings.cookie_secret,
		store: newMongoStore({
		db : settings.db,
		})
		}));

#####因为现版本连接修改，需用这种方式连接。
		app.use(session({
  		secret: settings.cookieSecret,
  		store: new MongoStore({
        host: '127.0.0.1',
        port: '27017',
        db: 'microblog',
        url: 'mongodb://localhost:27017/microblog'
    	})
		}));

跟着书接着往下走，可能会报错
`TypeError:Cannot read property ‘DEFAULT_PORT’ of undefined`
根据错误提示，知道Connection对象没有定义，所以不能读取数据库端口号。Connection.DEFAULT_PORT是要连接的mongodb数据库默认端口号，所以把Connection.DEFAULT_PORT改成27017即可，修改后的db.js代码如下：

	var settings = require('./settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
	module.exports = new Db(settings.db,
    new Server(settings.host,27017, {}),
    { safe: true });
    
###ps:因为版本的问题，后续还有很多问题。我就不再一一添加了，如果感兴趣请看源码吧。