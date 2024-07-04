import React from 'react'

export default function SayLogin() {
  return (
    <div style={{height: "calc(100vh - 150px)",margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"}}>
        <center className="login-message" style={{fontFamily: '"Poppins", sans-serif'}}>
        <h4>Login Required</h4>
        <p style={{fontSize: "12px", margin: "20px"}}>Please log in or sign up if you don't have an account.</p>
        <a href={process.env.REACT_APP_ACCOUNT_APP_URL +"/login"} className="button-2" style={{marginRight: "15px",backgroundColor: "rgba(51, 51, 51, 0.05)"}}>Login</a>
        <a href={process.env.REACT_APP_ACCOUNT_APP_URL +"/signup"} className="button-2" style={{color: "white",backgroundColor: "rgba(74, 137, 255)"}}>Sign Up</a>
        
    </center>
    </div>
  )
}
