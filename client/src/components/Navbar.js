import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProtected, logout } from './AuthService';
import Toast, { Toaster } from 'react-hot-toast';


export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getProtected();
        if(response.data.success){
          setIsAuthenticated(true);
        }
        
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await Toast.promise(
        logout(),
       { 
         loading: 'Loging Out...', // Optional loading message
         success: 'Done!',
         error: 'Something went Wrong',
       }
     );
    } catch (error) {
      Toast.error("Something went Wrong");
    }
};
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img alt="Tradly.in" style={{marginLeft: "10%"}} height={"13px"} src={process.env.REACT_APP_PUBLIC_URL + "/tradly-2.png"}/>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/myfolder/">
                Drive
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to="/folder/6677b4482eeb972699285e96">
                Subtract
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sub">
                Subtract
              </Link>
            </li> */}
          </ul>
          <div>
          
      {!isAuthenticated && <a href={process.env.REACT_APP_ACCOUNT_APP_URL +"/login"} className="button-2" style={{marginRight: "15px",backgroundColor: "rgba(51, 51, 51, 0.05)"}}>Login</a>}
      {isAuthenticated && <button className="btn btn-danger" onClick={handleLogout}>Logout</button>}
    </div>
          {/* <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form> */}
        </div>
      </div>
      <div><Toaster
                position="top-center"
                reverseOrder={false}
            /></div>
    </nav>
  );
}
