import React, { useEffect, useState } from "react";
import {Routes, Route } from "react-router-dom";
import FileMap from "./FileMap";
import Folder from "./Folder";
import axios from "axios";
// import Signup from "./Signup";

export default function DriveBody() {
  const [prmid, setId] = useState(null);
  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const id = segments[2];
    setId(id);
  }, []);
  // console.log(prmid)
  const [data, setData] = useState(true);
  const [loading, setLoading] = useState(true);
  const handleAddition = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL+"/fetch", {
        parent: null,
      });
      if (response.data.success) {
        setData(response.data.struct);
        // setChildFiles(response.data.struct.filter(child => child.parent === id));
        // setSelf(response.data.struct.find(item => item._id === id));
        //  console.log(childFiles)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAddition();
  }, []);

  return (
    
    <div style={{ display: "flex", height: "calc(100vh - 4rem)" }}>
      {window.innerWidth > 768?  (<div
        style={{
          width: "20%",
          height: "100%",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        {loading ? <p>loading...</p> : <FileMap data={data} prmid={prmid} />}
      </div>):""}
      
      <div
        style={
          window.innerWidth <= 768
            ? { width: "100%", height: "100%", overflowY: "auto" }
            :  { width: "80%", height: "100%", overflowY: "auto" }
        }
      >
        {process.env.ACCOUNT_APP_URL}
        {loading ? (
          <p>loading...</p>
        ) : (
          <Routes>
            <Route path="/:id" element={<Folder data={data} />} />
            <Route path="/" element={<Folder data={data} />} />
          </Routes>
        )}
      </div>
    </div>
  );
}
