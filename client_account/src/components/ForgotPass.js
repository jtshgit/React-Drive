import React, { useState } from 'react';
import { sendOtp, otpCheck } from './AuthService';
import '../css/Signup.css';
import Toast, { Toaster } from 'react-hot-toast';
import {
    Link
} from "react-router-dom";
function ForgotPass() {
    const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otppage, setOtppage] = useState('otp');
    const [otp, setOtp] = useState('');
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const validateEmail = (email) => {
        // Regular expression for email validation
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleEmail = async () => {
       if(!validateEmail(email)){
            Toast.error('Enter a valid Email');
            return;
        }
        try {
             const response = await Toast.promise(
                 sendOtp(email),
                { 
                  loading: 'Loading...', // Optional loading message
                  success: 'OTP sent!',
                  error: 'Email is not Registered.',
                }
              );
              setOtp('')
              setOtppage("otp")
              console.log(response.data);
            // setMessage('User registered successfully');
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
             console.log(response.data);
        } catch (error) {
        }
    };

    // const handleLogin = async () => {
    //     try {
    //         // await login(username, password);
    //         setMessage('User logged in successfully');
    //     } catch (error) {
    //         setMessage('Error logging in');
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
    const renderContent = () => {
        switch (otppage) {
          case 'email':
            return <div>
            <div className='signup_form'>
                <h2>Reset Password</h2>
                <p>Enter your account Email</p>
                <input className='input_field' type="text" name="email" onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
                <button type="submit" onClick={handleEmail}>Send OTP</button>
            </div>
            </div>;
          case 'otp':
            return <div>
            <div className='signup_form'>
                <h2>Reset Password</h2>
                <p>Enter your account Email</p>
                <input className='input_field' type="text" name="otp" onChange={(e) => setOtp(e.target.value)} placeholder="OTP" value={otp}/>
                <button type="submit" onClick={handleOtp}>Submit OTP</button>
            </div>
            </div>;
          case 'reset':
            return <div>
            <div className='signup_form'>
                <h2>Reset Password</h2>
                <p>Enter your account Email</p>
                {/* <input className='input_field' type="text" name="name" onChange={(e) => setName(e.target.value)} placeholder="Your Name" /> */}
                <input className='input_field' type="text" name="email" onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" />
                <label className='label' htmlFor="show-password">
                    <input
                        type="checkbox"     
                        id="show-password"
                        checked={showPassword}
                        onChange={togglePasswordVisibility}
                    />
                    Show Password
                </label>
                <button type="submit" onClick={handleOtp}>Sign Up</button>
                {/* <button onClick={handleLogin}>Login</button> */}
                {/* <button onClick={handleLogout}>Logout</button> */}
                {/* <button onClick={handleGetProtected}>Get Protected Content</button> */}
            </div>
            <div className="login-link">
                <Link to="/login"><span>Already have an account.<img alt='>' src='./link_arrow.svg' /></span></Link>
            </div>
            </div>;
          default:
            return <div>Not Found</div>;
        }
      };

    return (
        <>
        {renderContent()}
        
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

export default ForgotPass;
