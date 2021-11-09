const express = require('express');
const dot = require('dotenv')
dot.config()
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const profile = require('./models/seeds');
const session = require('express-session')

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(session({secret:'change it'}))

const requireLogin = (req,res,next)=>{
    if(!req.session.user_id){
        return res.redirect('/login')
    }
    next()
}

mongoose.connect('mongodb+srv://cluster0.lce9f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    dbName:'test',
    pass:'js2iWLTdRqNwIkXG',
    user:'Oren',
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
.then(()=>{
    console.log('connected');
})
.catch(()=>{
    console.log('err');
})
app.get('/',(req,res)=>{
    if(!req.session.user_id){
        res.render('index');
        
    }else{
        res.redirect('/products')
    }
})
app.post('/register', async(req,res)=>{
    const {Email, address, username, password} = req.body
    const hashPass = await bcrypt.hash(password,13)
    const user = new profile({
        Email:Email,
        password:hashPass,
        username:username,
        address:address,
    })
    await user.save()
    .then(dat=>{
        console.log(dat)
    })
    .then(err=>{
        console.log(err)
    })
    res.redirect('/products')
})
app.get('/login',(req,res)=>{
   res.render('login')
})
app.post('/login',async(req,res)=>{
    const {Email , password} = req.body
    const user = await profile.findOne({Email:Email})
    const validPass = await bcrypt.compare(password,user.password)
    if(validPass){
       req.session.user_id = user._id
       res.redirect('/products')
    }else{
        res.redirect('/login')
    }
})
app.get('/products',requireLogin,(req,res)=>{
    res.render('products')
})
app.get('/pizza',requireLogin,async(req,res)=>{
    res.render('pizza')
})
app.post('/pizza',requireLogin,async(req,res)=>{
    const userid = req.session.user_id
    const {pizza}= req.body
    const user = await profile.findByIdAndUpdate(userid ,{pizza:pizza})   
    res.redirect('/products')
})

app.get('/burger',requireLogin,(req,res)=>{
    res.render('burger')
})
app.post('/burger',requireLogin, async(req,res)=>{
    const userid = req.session.user_id
    const {burger}= req.body
    const user = await profile.findByIdAndUpdate(userid ,{burger:burger})   
    res.redirect('/products')
})
app.get('/coffee',requireLogin,(req,res)=>{
    res.render('coffee')
})
app.post('/coffee',requireLogin,async(req,res)=>{
    const userid = req.session.user_id
    const {coffee}= req.body
    const user = await profile.findByIdAndUpdate(userid ,{coffee:coffee})   
    res.redirect('/products')
})
app.get('/cart',requireLogin, async(req,res)=>{
    const id = req.session.user_id;
    const user = await profile.findById(id)
    const {pizza, burger, coffee} = user
    res.render('cart',{pizza , burger , coffee})
})
app.get('/profile',requireLogin, async(req,res)=>{
    const id = req.session.user_id
    const user = await profile.findById(id)
    const {username ,password,Email ,address} = user
    res.render('profile',{username,Email,address ,password})
})
app.post('/logout',requireLogin,(req,res)=>{
    req.session.user_id = null
    return res.redirect('/login')
})
app.post('/deleteProfile',requireLogin, async(req,res)=>{
    const id = req.session.user_id
    const find = await profile.findByIdAndDelete(id)
})
app.get('/editProfile',requireLogin,(req,res)=>{
    res.render('editProfile')
})
app.post('/editProfile',requireLogin, async(req,res)=>{
    const id = req.session.user_id
    const user = await profile.findByIdAndUpdate(id,req.body,{runValidators:true , new:true})
     res.redirect('/profile')
})

app.post('/deletep',requireLogin,async(req,res)=>{
    const id =  req.session.user_id
    const user = await profile.findByIdAndUpdate(id ,{pizza:"no items to show"}) 
    res.redirect('/cart')
    
})
app.post('/deleteb',requireLogin,async(req,res)=>{
    const id =  req.session.user_id
    const user = await profile.findByIdAndUpdate(id ,{burger:"no items to show"}) 
    res.redirect('/cart')
    
})
app.post('/deletec',requireLogin,async(req,res)=>{
    const id =  req.session.user_id
    const user = await profile.findByIdAndUpdate(id ,{coffee:"no items to show"}) 
    res.redirect('/cart')
    
})
app.get('/proceed',requireLogin,(req,res)=>{
    res.render('proceed')
})
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`listening......${port}`);
})