import React, { useState } from 'react';
import { register, otpCheck } from './AuthService';
import '../css/Signup.css';
import Toast, { Toaster } from 'react-hot-toast';
import {
    Link
} from "react-router-dom";
function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otppage, setOtppage] = useState(false);
    const [otp, setOtp] = useState('');
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const validateEmail = (email) => {
        // Regular expression for email validation
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleRegister = async () => {
        if (name.length < 3) {
            Toast.error('Enter a valid Name');
        } else if(!validateEmail(email)){
            Toast.error('Enter a valid Email');
        }else if( password.length < 8){
            Toast.error('Enter 8 digit password');
        };
        try {
             await Toast.promise(
                 register(name, email, password),
                { 
                  loading: 'Loading...', // Optional loading message
                  success: 'Email sent!',
                  error: 'Email is already registed.',
                }
              );
              setOtp('')
              setOtppage(true)
        } catch (error) {
            // Toast.error('Error registering user!');
        }
    };
    const handleOtp = async () => {
        try {
            const response = await Toast.promise(
                otpCheck(otp, email),
               { 
                 loading: 'Checking...', // Optional loading message
                 success: 'Verified!',
                 error: 'Enter a valid OTP',
               }
             );
             if(response.data.success){
                setTimeout(() => {
                    window.location.href = process.env.REACT_APP_PUBLIC_URL;
                }, 500);
              }
        } catch (error) {
        }
    };

    // const handleLogin = async () => {
    //     try {
    //     } catch (error) {
    //     }
    // };

    // const handleLogout = async () => {
    //     try {
    //         await logout();
    //         setMessage('User logged out successfully');
    //     } catch (error) {
    //         setMessage('Error logging out');
    //     }
    // };

    // const handleGetProtected = async () => {
    //     try {
    //         const response = await getProtected();
    //         setMessage(response.data.message);
    //     } catch (error) {
    //         setMessage('Error fetching protected content');
    //     }
    // };

    return (
        <>
        {otppage? (
        <div>
            <div className='signup_form'>
                <h2>Sign Up</h2>
                <p>Enter OTP (sent on mail)</p>
                <input className='input_field' type="text" name="otp" onChange={(e) => setOtp(e.target.value)} placeholder="OTP" value={otp}/>
                <button type="submit" onClick={handleOtp}>Submit OTP</button>
            </div>
            </div>
        ): (<div>
            <div className='signup_form'>
                <h2>Sign Up</h2>
                <p>Create you Account</p>
                <input className='input_field' type="text" name="name" onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
                <input className='input_field' type="text" name="email" onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" />
                <input className='input_field' type={showPassword ? 'text' : 'password'} name="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <label className='label' htmlFor="show-password">
                    <input
                        type="checkbox"     
                        id="show-password"
                        checked={showPassword}
                        onChange={togglePasswordVisibility}
                    />
                    Show Password
                </label>
                <button type="submit" onClick={handleRegister}>Sign Up</button>
                {/* <button onClick={handleLogin}>Login</button> */}
                {/* <button onClick={handleLogout}>Logout</button> */}
                {/* <button onClick={handleGetProtected}>Get Protected Content</button> */}
            </div>
            <div className="login-link">
                <Link to="/login"><span>Already have an account.<img alt='>' src='./link_arrow.svg' /></span></Link>
            </div>
            </div>)}
            {/* <div className="App">
            <h1>Auth System</h1>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleRegister}>Register</button> */}

            {/*    <p>{message}</p>
        </div> */}
            <div><Toaster
                position="top-center"
                reverseOrder={false}
            /></div>
        </>
    );
}

export default Signup;
