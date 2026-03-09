const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const routes = require('./Config/Routes')

require('./Config/mondb')



app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(routes)
app.listen(3000,()=>{

console.log("Server running")

})