var
    md5,
    mysql,
    db,
    apikeys,
    express,
    bodyParser,
    postmark,
    app,
    port,
    env
;

// required modules
//var app = require('./app');
express    = require('express');
bodyParser = require('body-parser');
mysql      = require('mysql');
md5        = require('MD5');
apikeys    = require('./apikeys');
postmark   = require('postmark')(apikeys.postmark);
mustacheExpress = require('mustache-express');
const { Client } = require('pg');
const pgCamelCase = require('pg-camelcase');

pgCamelCase.inject(require('pg'));
require('dotenv').config();

// express app
app        = express();
mustache = mustacheExpress();
mustache.cache = null;

// get environment
env        = app.get('env') === 'development' ? 'dev' : app.get('env');
port       = process.env.PORT || 3000;

// create database connection
db         = mysql.createConnection(require('./db/config/database')[env]);

db.connect();

const client = new Client();
client.connect()


// configure server
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false, limit: 1000000000 }));
app.use(bodyParser.json({ limit: 1000000000 }));
app.listen(port, () => {
                 console.log(`Listening on port ${port}.`);
               });
app.engine('mustache', mustache);
app.set('view engine', 'mustache');


global.__root   = __dirname + '/';

app.get('/api', function (req, res) {
  res.status(200).send('API works.');
});

var UserController = require(__root + 'user/UserController');
app.use('/api/users', UserController);

var AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

var ContactController = require(__root + 'contact/ContactController');
app.use('/api/contact', ContactController);


module.export = md5;
module.export = mysql;
module.export = db;
module.export = apikeys;
module.export = express;
module.export = bodyParser;
module.export = postmark;
module.export = app;
module.export = port;
module.export = env;
module.export = client;
