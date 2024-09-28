import React, { useState } from 'react'
import '../Pages/css/loginsignup.css'
const LoginSignup = () => {

  const[state,setState] = useState("Login")
  const[formData,setFormdata] = useState({
    username:"",
    password:"",
    email:""
  })
const changeHandler =(e)=>{
setFormdata({...formData,[e.target.name]:e.target.value})
}
  const login = async ()=>{
console.log("login, ",formData)
let responseData;
await fetch("https://e-commerce-omep.onrender.com/login",{
method:"POST",
headers:{
  Accept:"application/form-data",
  'Content-Type':"application/json",
},
body:JSON.stringify(formData),
}).then((res)=>res.json()).then((data)=>responseData = data)
if(responseData.success){
  localStorage.setItem("auth-token",responseData.token);
  window.location.replace("/");
}
else{
  alert(responseData.errors)
}
  }

  
  const signup = async()=>{
console.log("signup",formData)
let responseData;
await fetch("https://e-commerce-omep.onrender.com/signup",{
method:"POST",
headers:{
  Accept:"application/form-data",
  'Content-Type':"application/json",
},
body:JSON.stringify(formData),
}).then((res)=>res.json()).then((data)=>responseData = data)
if(responseData.success){
  localStorage.setItem("auth-token",responseData.token);
  window.location.replace("/");
}
else{
  alert(responseData.errors)
}
  }
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
      {state === "Sign Up"? <input type="text" placeholder="Your Name" name='username' value={formData.username} onChange={changeHandler} />:<></>}   
          <input type="email" placeholder="Email Address" name='email' value={formData.email} onChange={changeHandler} />
          <input type="password" placeholder="password" name='password' value={formData.password} onChange={changeHandler} />
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state === "Sign Up"?<p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login here </span></p>:
        <p className="loginsignup-login">Create an New account? <span onClick={()=>{setState("Sign Up")}}>Click here </span></p>}
      
      
      

        
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id=''/>
          <p>By continuing, i agree to the terms of use & privacy policy</p>
        </div>
      </div>
     
    </div>
  )
}

export default LoginSignup