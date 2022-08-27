//srever creation

//1. import express
const express= require('express')

 //Import jsonwebtoken
 const jwt = require("jsonwebtoken")

 //Impoert cors
 const cors = require('cors')

const dataService = require('./service/data.service')

//2. create server app
 const app = express()

 //to parse JSON
 app.use(express.json())

 //to use cors to share data with others
 app.use(cors({
   origin:['http://localhost:4200', 'http://127.0.0.1:8080', 'http://192.168.1.38:8080']
 }))

 //Application Specific Middleware

 const appMiddleware = (req,res,next)=>{
   next()
 }
 app.use(appMiddleware)

 //Router Specific Middleware - Token Validate
 const jwtMiddleware = (req,res,next)=>{
   try { 
      console.log('Router Specific Middleware');
   const token = req.headers['x-access-token']
   const data = jwt.verify(token,"supersecertkey12345")
   console.log(data);
   next()
}
catch{
   res.status(422).json({
      statusCode:422,
        status:false,
        message:'Please Log in'
   })
}
 }

 //3. HTTP request resolve

 //Bank App Request Resolving

 //register api
app.post('/register',(req,res)=>{
   console.log(req.body);
   dataService.register(req.body.acno,req.body.password,req.body.username)
   .then(result=>{
      res.status(result.statusCode).json(result)
   })
})

 //login api
 app.post('/login',(req,res)=>{
   console.log(req.body);
   dataService.login(req.body.acno,req.body.pswd)
   .then(result=>{
      res.status(result.statusCode).json(result)
   })
})

//deposit api
app.post('/deposit',jwtMiddleware,(req,res)=>{
   console.log(req.body);
   dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
   .then(result=>{
      res.status(result.statusCode).json(result)
   })
})

//withdraw api
app.post('/withdraw',jwtMiddleware,(req,res)=>{
   console.log(req.body);
   dataService.withdraw(req.body.acno,req.body.pswd,req.body.amt)
   .then(result=>{
      res.status(result.statusCode).json(result)
   })
})

//getTransaction api
app.post('/getTransaction',jwtMiddleware,(req,res)=>{
   console.log(req.body);
  try{  
   dataService.getTransaction(req.body.acno)
   .then(result=>{
      res.status(result.statusCode).json(result)
   })
}
catch{
   res.status(422).json({
      statusCode:422,
        status:false,
        message:'No Transaction Has Been Done'
   })
}
} )

//onDelete api
app.delete('/onDelete/:acno',(req,res)=>{
   dataService.onDelete(req.params.acno)
   .then(result=>{
      res.status(result.statusCode).json(result)
   })
})

 //4. set up port number
 app.listen(3000,()=>{
    console.log('server started at port 3000');
 })