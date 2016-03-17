//Importing modules
var express = require('express'),
    stylus = require('stylus'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();

function compile(str,path){
    return stylus(str).set('filename',path);
}

//Setting views
    app.set('views',__dirname+'/server/views');
    app.set('view engine','jade');
    app.use(logger('dev'));
    app.use(bodyParser());
    app.use(stylus.middleware(
        {
            src: __dirname + '/public',
            compile: compile
        }
    ));
app.use(express.static(__dirname+'/public'));

//MongoDb connection
if(env ==='development') {
mongoose.connect('mongodb://localhost/mydatabase');
}
else {
    mongoose.connect('mongodb://ashok:mongopwd@ds013589.mlab.com:13589/mydatabase');
}
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error....'));
db.once('open',function callback(){
    console.log("connection to mydatabase is opened");
});
var messageSchema = mongoose.Schema({message:String});
var Message = mongoose.model('Message',messageSchema);
var mongoMessage;
Message.findOne().exec(function(err,messageDoc){
    mongoMessage = messageDoc.message;
})

//Routing
app.get('/partials/:partialPath',function(req,res){
    res.render('partials/'+req.params.partialPath);
})
app.get('*',function(req,res){
   res.render('index',{
       mongoMessage:mongoMessage
   });
});



var port = process.env.PORT ||  3040;
app.listen(port);
console.log("Listening on "+port);