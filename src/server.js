const express=require('express');
const app=express();
const nunjucks=require('nunjucks');
const path=require('path');
require('dotenv').config();
const db=require('./dao');
let [Pin,Car,User]=[require('./models/pin'),require('./models/pin'),require('./models/user')];

app.use(express.static(path.resolve(__dirname,'public')));

// configure
nunjucks.configure(path.resolve(__dirname,'public'),{
    express:app,
    autoscape:true,
    noCache:false,
    watch:true
});

const bodyParser=require('body-parser');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false })); 

let passport = require('passport'), LocalStrategy = require('passport-local').Strategy;



app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (user, next) {
    next(null, user);
  });

passport.use('local', new LocalStrategy({ usernameField: 'username',passwordField:'userpass' },(username, password, done) => {  

    User.findOne({ username: username }, (err, user) => {
      
      if (err) { return done(err); }
      if (!user) { return done(null, null, { message: 'No user found!' }); }
      if (user.userpass!==password) {
       
        return done(null, null, { message: 'Username or password is incorrect!' });
      }
  
      return done(null, user, null);
    });
  }
  ));

  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }



app.use(express.static('src/public'));
    

nunjucks.configure(path.resolve(__dirname,'public'),{
    express:app,
    autoscape:true,
    noCache:false,
    watch:true
});

app.get("/",(req,res)=>{
    //res.status(200).send("hello node");
    res.status(200).render('home.html',{ title: "Hello Node" });
});

app.get("/login",(req,res)=>{
    res.status(200).render('login.html',{});
});
app.get('/admin', isAuthenticated, (req, res) => { res.render('admin.html') });
//app.get('/user', isAuthenticated, (req, res) => { res.render('user.html') });

app.post('/login', (req, res) => {
  
    passport.authenticate('local', function (err, user, info) {
      
     
      if (err) {
       
        res.render('login.html', { error: err });
      } else if (!user) {
       
        res.render('login.html', { errorMessage: info.message });
  
      } else {
        //setting users in session
        req.logIn(user, function (err) {
          if (err) {
            res.render('login.html', { error: err });
          } else {
            res.render('admin.html',{ name:user.username});
          }
        })
      }
    })(req, res);
  });
  




app.get("/pincode",(req,res)=>{
    var val=req.query.pincode;

    Pin.find({pincode:val},(err,data)=>{
        if(err){
            console.error(err);
        }
        else{
           if( data.length==0){
            res.status(200).render('pincode.html',{ pin:val, msg:"Pincode not found"  });
           }
           else{
            res.status(200).render('pincode.html',{ pin:val, output:data  });
           }
           
        }
    })
});
app.get("/api/:pindata",(req,res)=>{
    var pin=req.params.pindata;
    res.header('Access-Control-Allow-Origin',"*");
    
    Pin.find({pincode:pin},(err,data)=>{
        if(err){
            return res.send(err);
        }
        else{
            return res.send(data);
        }  
    }) 
});

app.get("/search",(req,res)=>{
    var val=req.query.search;
    res.render("search.html",{data:{ip:process.env.IP, port:process.env.PORT}});
});
app.get("/api",(req,res)=>{
    res.render("api.html",{data:{ip:process.env.IP, port:process.env.PORT}});
});

app.listen(process.env.PORT,()=>{
    console.log(`server running at http://${process.env.IP}:${process.env.PORT} `);
});