const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://cluster0.lce9f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    dbName:'test',
    pass:'js2iWLTdRqNwIkXG',
    user:'Oren',
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
.then(()=>{
    console.log('seeds...')
})
.catch(err=>{
    console.log(err)
})



const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'username not accepted']
    },
    password:{
        type:String,
        required:[true, 'password not accepted']
    },
    Email:{
        type:String,
        required:[true, 'Email not accepted']
    },
    address:{
        type:String,
        required:[true, 'address not accepted']
    },
    pizza:{
        type:[String],
        required:[true, 'Pizza not accepted']
    },
    burger:{
        type:[String],
        required:[true, 'Burger not accepted']
    },
    coffee:{
        type:[String],
        required:[true, 'coffee not accepted']
    }
})

const profile = mongoose.model('profile',userSchema)

module.exports = profile
