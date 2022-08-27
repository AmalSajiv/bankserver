 //Import jsonwebtoken
 const jwt = require("jsonwebtoken")

 //Import db
 const db = require('./db')
 
 // data base
 userDetails = {
    1000:{acno:1000,username:'Neer',password:1000,balance:5000,transaction:[]},
    1001:{acno:1001,username:'Laisha',password:1001,balance:6000,transaction:[]},
    1002:{acno:1002,username:'Vyom',password:1002,balance:4000,transaction:[]}
  }

//Register
const register = (acno, password, username)=>{    
  //asynchronous
  return db.User.findOne({acno})
  .then(user=>{
    if(user){
      return {
        statusCode:401,
        status:false,
        message:'User Already Exist.. Please Log In'
      }
    }
    else{
      const newUser = new db.User({
        acno,
        username,
        password,
        balance:0,
        transaction:[]
      })
      newUser.save()
      return {
        statusCode:200,
        status:true,
        message:"Successfully Register"
      }
    }
  })
}

// login
const login = (acno,pswd)=>{
  //asynchronous
  return db.User.findOne({
    acno,
    password:pswd
})
.then(user=>{
  if(user){
    currentUsername = user.username
      currentAcno = acno

      //token generation using jwt
      const token = jwt.sign({
        currentAcno:acno
      },"supersecertkey12345")
      return  {
        statusCode:200,
        status:true,
        message:"Login Successfull",
        currentUsername,
        currentAcno,
        token
      }
  }
  else{
    return {
      statusCode:401,
      status:false,
      message:'Incorrect Account Number / Password'
    }
  }
})
  }

  //deposit
  const deposit = (acno,pswd,amt)=>{
  var amount = parseInt(amt)
  //asynchronous
  return db.User.findOne({
    acno,
    password:pswd
})
.then(user=>{
  if(user){
    user.balance += amount
    user['transaction'].push({
      type:'CREDIT',
      amount
    })
    user.save()
    return {
      statusCode:200,
      status:true,
      message:`${amount} Credited. New Balance is ${user.balance}`
    }
  }
  else{
    return {
      statusCode:401,
      status:false,
      message:'Incorrect Password or Account Number'
    } 
  }
})
  }

   //withdraw
   const withdraw = (acno,pswd,amt)=>{
  var amount = parseInt(amt)
   //asynchronous
   return db.User.findOne({
    acno,
    password:pswd
})
.then(user=>{
  if(user){
    if(user.balance>amount){
      user.balance -= amount
      user['transaction'].push({
      type:'DEBIT',
      amount
    })
    user.save()
    return  {
      statusCode:200,
      status:true,
      message:`${amount} Debited. New Balance is ${user.balance}`
    }
    }
    else{
      return {
        statusCode:401,
        status:false,
        message:'Insufficient Balance'
      }
    }
  }
  else{
    return {
      statusCode:401,
      status:false,
      message:'Incorrect Password or Account Number'
    }
  }
})
  }

   //transaction
   const getTransaction = (acno)=>{
    return db.User.findOne({acno})
    .then(user=>{
      if(user){
        return {
          statusCode:200,
          status:true,
          transaction:user['transaction']
        }
      }
      else{
        return {
          statusCode:401,
          status:false,
          message:'Incorrect Account Number'
        }
      }
    })
  }

  //onDelete
  const onDelete = (acno)=>{
    return db.User.deleteOne({acno})
    .then(result=>{
      if(result){
        return {
          statusCode:200,
          status:true,
          message:'Deleted Successfully'
        }
      }
      else{
        return {
          statusCode:401,
          status:false,
          message:'Incorrect Account Number'
        }
      }
    })
  }


// to export
module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction,
    onDelete
}