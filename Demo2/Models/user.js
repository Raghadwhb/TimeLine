const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

firstName:{
type:String,
required:[true,"First name is required"],
maxlength:[10,"First name must not exceed 10 characters"]
},

lastName:{
type:String,
required:[true,"Last name is required"],
maxlength:[15,"Last name must not exceed 15 characters"]
},

email:{
type:String,
required:[true,"Email is required"],
unique:true
},

password:{
type:String,
required:[true,"Password is required"]
}

})

module.exports = mongoose.model('User',userSchema)