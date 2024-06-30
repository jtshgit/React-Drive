import './App.css';
import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Signup from './components/Signup';
import Login from './components/Login';
import ForgotPass from './components/ForgotPass';
function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/resetpass" element={<ForgotPass />}/>
        <Route path="/login" element={<Login />}/>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
