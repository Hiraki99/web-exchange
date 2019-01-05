/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const engine = require('ejs-locals');
const expresslayout = require('express-ejs-layouts');
const partials = require('express-partials')
const request = require("request")
var black_list = []
var winston = require('./config/winston');
var appRoot = require('app-root-path');
const middleware = require('./middleware/middleware');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
	path: '.env.example'
});

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */

app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8090);
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public')
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, 'public'), {
	maxAge: 36000000000
}));
/**
 * Primary app routes.
 */
const router = require('./router/router');
const router_admin = require('./router/router_admin');
const router_trade = require('./router/router_trade');

app.use(router);
app.use(router_trade);
app.use(router_admin);


const server = require('http').createServer(app);

const io = require('socket.io')(server,{
    path: '/order',
    serveClient: true,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

io.on('connection', function (socket) {
	socket.on('response-list-order', function (data) {
		console.log("response-list-order")
		console.log(data)
		io.emit('response-list-order',data)
    });


    socket.on('response-list-order-matching', function (data) {
		console.log("response-list-order-matching")
		console.log(data)
		io.emit('response-list-order-matching',data)
    });
    
    socket.on('response-list-order-after-cancel', function (data) {
		console.log("response-list-order-after-cancel")
		console.log(data)
		io.emit('response-list-order-after-cancel',data)
	});
	socket.on('code-used', function (data) {
		console.log("code-used")
		console.log(data)
		io.emit('code-used',data)
	});
	socket.on('update_amount_crypto', function (data) {
		console.log("update_amount_crypto")
		console.log(data)
		io.emit('update_amount_crypto',data)
	});
	
	socket.on('active_traders',function(data){
		console.log("active_traders")
		console.log(data)
		io.emit("folow_active_traders",data)
	});

	socket.on('response-list-order-realtime', function (data) {
		console.log("listen pretrade response-list-order-realtime")
		console.log(data)
		io.emit('response-list-order-realtime',data)
    });


    socket.on('response-list-order-matching-realtime', function (data) {
		console.log("response-list-order-matching-realtime")
		console.log(data)
		io.emit('response-list-order-matching-realtime',data)
    });
    
    socket.on('response-list-order-after-cancel-realtime', function (data) {
		console.log("response-list-order-after-cancel-realtime")
		console.log(data)
		io.emit('response-list-order-after-cancel',data)
	});
});

const socket_client = require('socket.io-client');
const url = require('./config').url

client_nodejs = socket_client(url.NODEJS_HOST, {
	path: '/order'
});
client_pretrade =socket_client(url.SOCKET_HOST_PRE_TRADE + '/pre_trade/order');

client_pretrade.on('response-list-order', function (data) {
	client_nodejs.emit('response-list-order',data);
});

client_pretrade.on('response-list-order-matching', function (data) {
	client_nodejs.emit('response-list-order-matching',data);
});

client_pretrade.on('response-list-order-after-cancel', function (data) {
	client_nodejs.emit('response-list-order-after-cancel',data);
});

client_pretrade_real_time =socket_client(url.SOCKET_HOST_PRE_TRADE_REAL_TIME + '/pre_trade/order');

client_pretrade_real_time.on('response-list-order-realtime', function (data) {
	// console.log("client response-list-order-realtime "+JSON.stringify(data))
	client_nodejs.emit('response-list-order-realtime',data);
});

client_pretrade_real_time.on('response-list-order-matching-realtime', function (data) {
	client_nodejs.emit('response-list-order-matching-realtime',data);
});

client_pretrade_real_time.on('response-list-order-after-cancel-realtime', function (data) {
	client_nodejs.emit('response-list-order-after-cancel-realtime',data);
});


client_deposit_app =socket_client(url.SOCKET_HOST_DEPOSIT+ '/');
client_deposit_app.on('code-used', function (data) {
	console.log(140)
	console.log(data)
	client_nodejs.emit('code-used',data);
});
client_deposit_app.on('update_amount_crypto', function (data) {
	console.log(140)
	console.log(data)
	client_nodejs.emit('update_amount_crypto',data);
});

server.listen(app.get('port'),()=>{
    // db.sequelize.sync();
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');

})
// module.exports = app;