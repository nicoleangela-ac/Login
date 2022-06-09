const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');

let userInfo = {};

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    userInfo = {};
    res.render('pages/index');
});

app.get("/register", (req, res) => {
    res.render('pages/register');
});

app.get("/home", (req, res) => {
    res.render('pages/home');
});

app.get("/profile", (req, res)=> {
    console.log(userInfo)
    res.render('pages/profile', {userInfo});
})


app.post("/register", async (req, res) => {
    const userInfo = {
        "password" : req.body.password,
        "email" : req.body.email
    };

    const userEmail = await User.findOne({email: req.body.email});
    if(userEmail){
        const error = new Error("Email already exists");
        return res.status(400).render('pages/register', {errorMessage: error.message});
    }

    const newUser = new User(userInfo);
    await newUser.save()
    res.render('pages/home', {
        name: userInfo.email 
    }); 
})

app.post("/login",  async (req, res) => {
    const user = await User.findOne({email: req.body.email});

    //if the user doesn't exist, throw an error
    if(!user){
        const error = new Error('User could not be found.');
        return res.status(404).render('pages/index', {errorMessage: error.message});
    } 
    
    //if the password doesn't match, throw an error
    if(req.body.password != user.password) {
        const error = new Error('Invalid Password');
        return res.status(401).render('pages/index', {errorMessage: error.message});
    } else {
        userInfo = {email : user.email, password : user.password};
        res.render('pages/home', {
            name: user.email 
        });  
    }
}) 

app.listen(3000, () => {
    console.log("Listening on port 3000");
});


mongoose.connect('mongodb://127.0.0.1:27017/backendregsiter', { useNewUrlParser: true, useUnifiedTopology: true })
.then( () => {
  console.log("Connection Open")

})
.catch(err => console.log(err));