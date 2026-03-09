const User = require('../Models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = "secretkey"

const authPage = (req,res)=>{
res.render('auth',{registerError:null,loginError:null,registerSuccess:null})
}


const registerUser = (req,res)=>{
const {firstName,lastName,email,password,confirmPassword} = req.body

if(password !== confirmPassword){
return res.render('auth',{
registerError:"Passwords do not match",
loginError:null,
registerSuccess:null
})
}

bcrypt.hash(password,10)
.then((hashedPassword)=>{
const user = new User({
firstName,lastName,email,password:hashedPassword
})
return user.save()
})
.then(()=>{
res.render('auth',{
registerError:null,
loginError:null,
registerSuccess:"Registered! Please log in"
})
})
.catch((err)=>{
if(err.name === "ValidationError"){
return res.render('auth',{
registerError:Object.values(err.errors)[0].message,
loginError:null,
registerSuccess:null
})
}
res.render('auth',{
registerError:"Email already exists",
loginError:null,
registerSuccess:null
})
})
}


const loginUser = (req,res)=>{
const {email,password} = req.body

User.findOne({email})
.then((user)=>{
if(!user){
return res.render('auth',{
registerError:null,
loginError:"User not found",
registerSuccess:null
})
}

bcrypt.compare(password,user.password)
.then((match)=>{
if(!match){
return res.render('auth',{
registerError:null,
loginError:"Wrong password",
registerSuccess:null
})
}

const token = jwt.sign({id:user._id},SECRET,{expiresIn:"1h"})
res.cookie("token",token)
res.redirect('/profile')
})
})
.catch((err)=>{
console.log(err)
res.render('auth',{
registerError:null,
loginError:"Login error",
registerSuccess:null
})
})
}

const profilePage = (req,res)=>{
const token = req.cookies.token
if(!token){
return res.redirect('/')
}
try{
const decoded = jwt.verify(token,SECRET)
User.findById(decoded.id)
.then((user)=>{
res.render('profile',{user:user})
})
}catch{
res.redirect('/')
}
}

const logoutUser = (req,res)=>{
res.clearCookie("token")
res.redirect('/')
}

module.exports = {
authPage,
registerUser,
loginUser,
profilePage,
logoutUser
}