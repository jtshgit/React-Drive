import React, { useState } from 'react';
import { register, login, logout, getProtected } from './AuthService';
import '../css/Signup.css';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('Hello, this message');

    const handleRegister = async () => {
        try {
            await register(username, password);
            setMessage('User registered successfully');
        } catch (error) {
            setMessage('Error registering user');
        }
    };

    const handleLogin = async () => {
        try {
            await login(username, password);
            setMessage('User logged in successfully');
        } catch (error) {
            setMessage('Error logging in');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setMessage('User logged out successfully');
        } catch (error) {
            setMessage('Error logging out');
        }
    };

    const handleGetProtected = async () => {
        try {
            const response = await getProtected();
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error fetching protected content');
        }
    };

    return (
        <>
          <div className='signup_form'>
    <h2>Sign Up</h2>
    <p>{message}</p>
    {/* <input type="text" name="name" onChange={(e) => setUsername(e.target.value)} placeholder="Your Name"/> */}
    <input type="text" name="email" onChange={(e) => setUsername(e.target.value)} placeholder="Your Email"/>
    <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
    <button type="submit" onClick={handleRegister}>Sign Up</button>
    <button onClick={handleLogin}>Login</button>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleGetProtected}>Get Protected Content</button>
  </div>

  <div className="login-link">
    <a href="/login">I already have an account.</a>
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
        </>
    );
}

export default App;
