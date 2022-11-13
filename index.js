var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()
const MongoClient = require('mongodb').MongoClient;
const url= 'mongodb://localhost:27017';

const dbName = 'adbms';

const client = new MongoClient(url);
const assert = require('assert');
const { callbackify } = require('util');

app.use(bodyParser.json())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({
    extended:true
}))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://Localhost:27017/adbms',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"))
db.once('open',()=>console.log("Connected to Database"))


app.use(express.static("public"));

app.set('view engine', 'ejs')

// for data insertion


app.post("/sign_up",(req,res)=>{
    var name = req.body.name;
    var tableno = req.body.tableno;

    var data = {
        "name":name,
        "tableno":tableno,
    }

  db.collection('users').insertOne(data,(err,collection)=>{
    if(err){
        throw err;
    }
    console.log("Record inserted successfully");
  });

  return res.redirect('menu.html')
})
 

// for menu ordering

app.post("/menu",(req,res)=>{
    //var volvo = req.body.volvo
    var tableno = req.body.tableno;
    var starters = req.body.selectpicker;
    var ramen = req.body.ramen;
    var soft = req.body.soft;
    var alcool = req.body.alcool;
  
  
    var data = {
         "tableno": tableno,
         "starters":starters,
         "ramen":ramen,
         "soft": soft,
         "alcool": alcool
    }
  
  db.collection('order').insertOne(data,(err,collection)=>{
    if(err){
        throw err;
    }
    console.log("Record inserted successfully");
  });
  
  return res.redirect('menu.html')
  })

//for admin page



app.get('/devices',(req,res) =>{
    // let device_list = [{'name':'dht22'},{'name':'temp36'}]
     const db = client.db(dbName);
     const collection = db.collection('order');
     collection.find({}).toArray(function(err,user_list){
         assert.equal(err,null);
         res.render('users',{'users': user_list})
     });
 })

// for new collection


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin":'*'
    })
    return res.redirect('loader.html')
}).listen(4000);

console.log("listening on PORT 4000");