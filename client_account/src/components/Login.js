import React, { useState } from 'react';
import { login } from './AuthService';
import '../css/Signup.css';
import Toast, { Toaster } from 'react-hot-toast';
import {
    Link
} from "react-router-dom";
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const validateEmail = (email) => {
        // Regular expression for email validation
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleLogin = async () => {
        if(!validateEmail(email)){
            Toast.error('Enter a valid Email');
        }else if( password.length < 8){
            Toast.error('Enter 8 digit password');
        };
        try {
             const response = await Toast.promise(
                login(email, password),
                { 
                  loading: 'Logging in...', // Optional loading message
                  success: 'Done!',
                  error: 'Invalid User.',
                }
              );
              if(response.data.success){
                setTimeout(() => {
                    window.location.href = process.env.REACT_APP_PUBLIC_URL;
                }, 500);
              }
            //   console.log(response.data);
            // setMessage('User registered successfully');
        } catch (error) {
            // Toast.error('Error registering user!');
        }
    };

    // const handleLogin = async () => {
    //     try {
    //         await login(email, password);
    //         setMessage('User logged in successfully');
    //     } catch (error) {
    //         setMessage('Error logging in');
    //     }
    // };

    // const handleLogout = async () => {
    //     try {
    //         await logout();
    //     } catch (error) {
    //     }
    // };

    // const handleGetProtected = async () => {
    //     try {
    //         const response = await getProtected();
    //     } catch (error) {
    //     }
    // };

    return (
        <>
        
            <div className='signup_form'>
                <h2>Login Up</h2>
                <p>Login to your Account</p>
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
                <button type="submit" onClick={handleLogin}>Sign Up</button>
                {/* <button onClick={handleLogin}>Login</button> */}
                {/* <button onClick={handleLogout}>Logout</button> */}
                {/* <button onClick={handleGetProtected}>Get Protected Content</button> */}
            </div>
            <div className="login-link">
                <Link to="/resetpass"><span>Forgot Password<img alt='>' src='./link_arrow.svg' /></span></Link>
                <br />
                <Link to="/signup"><span>Don't have any account.<img alt='>' src='./link_arrow.svg' /></span></Link>
            </div>
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

export default Login;
