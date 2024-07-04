import './App.css';
import Navbar from './components/Navbar';
import React, { Suspense, lazy } from "react";
// import Cookies from 'js-cookie';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import DriveBody from './components/DriveBody';
import Signup from './components/Signup';
import MyDrive from './components/MyDrive';
import MyFolder from './components/MyFolder';
import Notes from './components/Notes';

const Subtract = lazy(() => import('./components/Subtract'));

document.title = "File Manager";

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
        {/* <Route path="/signup" element={<Signup />}/> */}
          {/* <Route path="/folder/*" element={<DriveBody />} /> */}
          {/* <Route path="/myfolder/*" element={<MyDrive />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/note" element={<Notes />} />
          <Route path="/note/*" element={<DriveBody />}/>
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App;