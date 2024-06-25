import './App.css';
import Navbar from './components/Navbar';
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import DriveBody from './components/DriveBody';

const Subtract = lazy(() => import('./components/Subtract'));

document.title = "File Manager";

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/folder/*" element={<DriveBody />} />
          <Route path="/sub" element={<Subtract />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
