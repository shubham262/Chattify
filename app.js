const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");
const app=express();
const http = require('http').createServer(app)


const socket = require('socket.io')

var port = process.env.PORT || 3000;



app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Shubham:shubham@cluster0.1sqrd.mongodb.net/Chattify");



const userSchema = new mongoose.Schema({
    Name:String,
    email: String,
    Password: String
   
  });

  const CUser = mongoose.model("CUser", userSchema);

app.get("/",function(req,res){

res.render("front");

})


app.get("/login",function(req,res){
    res.render("sigin")
})

app.get("/register", function (req, res) {
    res.render("signup");
  });

app.post("/login",function(req,res){
    console.log(req.body)
    console.log(req.body.email)
    console.log(req.body.password)


    CUser.find({email:req.body.email}, function (err, founduser) {
        if(err){console.log(err)}
        else{
          if(founduser){
            if(founduser[0].Password===req.body.password){
                // res.send("authenticated");
                res.redirect(`/index?username=${founduser[0].Name}`)
            }
            else{
                res.send("Authentication failed")
            }



          }
        }



    });


    
})
app.post("/register",function(req,res){
    console.log(req.body)
    CUser.find({email:req.body.useremail}, function (err, founduser) {
        if(err){console.log(err)}
        else{
            if(!founduser.length){

                if(req.body.pass1===req.body.pass2){const newuser=new CUser({
                    Name:req.body.username,
                    email:req.body.useremail,
                    Password:req.body.pass1
            
                });newuser.save();
            res.redirect("/login")}
            else{
               
                res.render("signup");
            }

                
            }
            else{
                console.log("Email already exist")
            }
        }



    });



   
})
app.get('/index', (req, res) => {
    res.render('index')
})

app.get('/newchatt', (req, res) => {
    res.render('newchatt')
})


app.post('/newchatt', (req, res) => {
    roomname = req.body.roomname;
    username = req.body.username;
    res.redirect(`/newchatt?username=${username}&roomname=${roomname}`)
})
http.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})