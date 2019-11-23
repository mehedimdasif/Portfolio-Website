if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config();
}
const express = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const bcrypt =require("bcryptjs");
const flash = require("express-flash");
const session = require("express-session");
const override = require("method-override");
const app = express();
app.use(express.static("public"));

const passportInitialize = require("./passport-config");
passportInitialize(passport,
     email => user_details.find(user => email === user.email),
      id => user_details.find(user => id === user.id));

app.use(flash());
app.use(session({
    secret: process.env.SECRETE_SESSION,
    save: false,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const user_details = [];

app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine","ejs");
app.use(override("_method"));

app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/about",(req,res)=>{
    res.render("about");
});
app.get("/blog",(req,res)=>{
    res.render("blog");
});
app.get("/contact",(req,res)=>{
    res.render("contact");
});
app.get("/portfolio-details",(req,res)=>{
    res.render("portfolio-details");
});
app.get("/portfolio",(req,res)=>{
    res.render("portfolio");
});
app.get("/services",(req,res)=>{
    res.render("services");
});
app.get("/single-blog",(req,res)=>{
    res.render("single-blog");
});
app.get("/single",(req,res)=>{
    res.render("single");
});
app.get("/adminblog",(req,res)=>{
    res.render("adminblog");
});


app.get("/admin",checkNotAuth, (req,res)=>{
    res.render("admin");
});

app.get("/registration",checkNotAuth,(req,res)=>{
    res.render("registration");
});

app.get("/user",checkAuth,(req, res)=>{
    res.render("user", {user_details: user_details});
});

app.post("/admin",checkNotAuth, passport.authenticate("local",{
    successRedirect: "/user",
    failureRedirect: "/admin",
    failureFlash: true
}));

app.delete("/logout",(req, res)=>{
    req.logout();
    res.redirect('/admin');
});

app.post("/registration",checkNotAuth, async (req,res)=>{
    try {
        const hashPass = await bcrypt.hash(req.body.password, 10);
        user_details.push({
            id: Date.now().toString(),
            name: req.body.name,
            title: req.body.title,
            email: req.body.email,
            password:hashPass
        });
        res.redirect("/user");
    } catch (error) {
        res.redirect("/registration");
    }
    console.log(user_details);
    
});

function checkAuth(req, res, next) {  
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin');
}

function checkNotAuth(req, res, next) {  
    if(req.isAuthenticated()){
        return res.redirect('/user');
    }
    next();
}


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);