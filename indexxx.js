const express = require("express");
const app = express();
const { pool } = require("./db");
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require("passport");
const path = require('path');
const mysql = require("mysql");

const initializePassport = require("./passportConfig");

initializePassport(passport);


const PORT = process.env.PORT || 7000;


app.use(express.static(path.join(__dirname, 'public')));

app.use('/public', express.static('public'))
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/user')]);
app.use('/Voya', express.static(path.join(__dirname, 'views', 'Voya')));



app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");



app.use(session({
    secret: '674857n65dmgt3h7528s6hf6g664grhxmfb738hfp3f3rg35cy57n',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.get("/register", checkAuthenticated, (req, res) => {
    res.render("register");
});




app.get("/index", checkAuthenticated, (req, res) => {
    res.render("login");});

app.get("/login", checkAuthenticated, (req, res) => {
    res.render("login");
});


app.get("/", checkAuthenticated, (req, res) => {
    res.redirect("/login");
});

app.get("/forgot-password", checkAuthenticated, (req, res) => {
    res.render("forgot-password");


});

app.get("/user/dashboard", checkNotAuthenticated, (req, res) => {
    res.render("dashboard", { user: req.user.first_name});
});


app.get("/user/amount", checkNotAuthenticated, (req, res) => {
    res.render("amount", { user: req.user.first_name});
});

app.get("/user/history", checkNotAuthenticated, (req, res) => {
    res.render("history", { user: req.user.first_name});
});
app.get("/user/invest", checkNotAuthenticated, (req, res) => {
    res.render("invest", { user: req.user.first_name});
});
app.get("/user/manager", checkNotAuthenticated, (req, res) => {
    res.render("manager", { user: req.user.first_name});
});
app.get("/user/market", checkNotAuthenticated, (req, res) => {
    res.render("market", { user: req.user.first_name});
});



app.get("/user/my-investment", checkNotAuthenticated, (req, res) => {
    res.render("my-investment", { user: req.user.first_name});
});
app.get("/user/password", checkNotAuthenticated, (req, res) => {
    res.render("password", { user: req.user.first_name});
});
app.get("/user/popper", checkNotAuthenticated, (req, res) => {
    res.render("popper", { user: req.user.first_name});
});
app.get("/user/profile", checkNotAuthenticated, (req, res) => {
    res.render("profile", { user: req.user.first_name});
});

app.get("/user/referral", checkNotAuthenticated, (req, res) => {
    res.render("referral", { user: req.user.first_name, refcode: req.user.last_name+"0xah7jhd"});
});
app.get("/user/reinvest", checkNotAuthenticated, (req, res) => {
    res.render("reinvest", { user: req.user.first_name});
});
app.get("/user/transfer", checkNotAuthenticated, (req, res) => {
    res.render("transfer", { user: req.user.first_name});
});
app.get("/user/withdraw", checkNotAuthenticated, (req, res) => {
    res.render("withdraw", { user: req.user.first_name});
});

app.get('/user/logout', (req, res) => {
    req.logout(function(err){
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
    
  });


// app.get("/user/logout", (req, res) => {
//     req.logout();
//     res.flash("success_msg", "You have logged out");
//     res.redirect("/login");

// });


app.post('/register', async (req, res)=>{
    let { first_name, last_name,  email, password, password_confirmation, age , us_investor, investor_type, account_type, investor_status, hear_about, capital, funds_type, love_to_know,  bitcoin_address, } = req.body;
    console.log(req.body)
    let errors = [];

    if ( !first_name && !last_name && !email && !password && !password_confirmation && !age && !us_investor && !investor_type && !account_type && !investor_status && !hear_about && !capital && !funds_type && !love_to_know && !bitcoin_address ){
        errors.push({message : "Please enter all reqiured fields"});
    }

    if(password.length < 8){
        errors.push({message : "Password should be at least 6 characters"});
    }

    if(password !== password_confirmation){
        errors.push({message :"Passwords do not match"});
    }
    if(errors.length > 0) {
        res.render("register", {errors});
    }else{
        let hashedPassword = await bcrypt.hash(password, 10);
        
        pool.query(
            `SELECT * FROM users WHERE email = $1`, [email], (err, results)=>{
                if (err){
                    throw err;
                }
                if(results.rows.length > 0){
                    errors.push({message: "User Already Registered"});
                    res.render('register',{ errors });
                }else{
                    pool.query(
                        `INSERT INTO users (first_name, last_name, email, password, age, us_investor, investor_type, account_type, investor_status, hear_about, capital, funds_type, love_to_know, bitcoin_address)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                        RETURNING id, password`, [first_name, last_name, email, hashedPassword, age, us_investor, investor_type, account_type, investor_status, hear_about, capital, funds_type, love_to_know, bitcoin_address], (err, results) => {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash("success_msg", "You are now registered. Please log in");
                            res.redirect('login');

                        }
                    )
                }
            }
        )
    }

        
    console.log(errors)
});

app.post("/login", passport.authenticate("local", {
    successRedirect:"/user/dashboard",
    failureRedirect: "/login",
    failureFlash: true
}));

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/user/dashboard");
    }
    next();
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }


app.listen(PORT, ()=>console.log(`server is listening on ${PORT}`));


