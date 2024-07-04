import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import FileMap from "./MyFileMap";
import MyFolder from "./MyFolder";
import axios from "axios";
// import Signup from "./Signup";
import SayLogin from "./comps/SayLogin";
import MyNote from "./MyNote";

export default function MyDrive() {
    // console.log(prmid)
    const [data, setData] = useState(true);
    const [loading, setLoading] = useState(true);
    const handleAddition = async () => {
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + "/fetchMyDrive", {
                parent: null,
            },{ withCredentials: true });
                setData(response.data);

        } catch (error) {
            console.log("done");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleAddition();
    }, []);

    return (
        <>

        {data.auth?(<div style={{ display: "flex", height: "calc(100vh - 4rem)" }}>
            {window.innerWidth > 768 ? (<div
                style={{
                    width: "20%",
                    height: "100%",
                    borderRight: "1px solid #f0f0f0",
                }}
            >
                {loading ? <p>loading...</p> : (
                    <Routes>
                    {/* <Route path="/" element={<FileMap data={data}/>} /> */}
                    <Route path="/" element={<FileMap data={data}/>} />
                    <Route path="/note/:id" element={<FileMap data={data}/>} />
                </Routes>
                    
                    )}
            </div>) : ""}
            <div
                style={
                    window.innerWidth <= 768
                        ? { width: "100%", height: "100%", overflowY: "auto" }
                        : { width: "80%", height: "100%", overflowY: "auto" }
                }
            >
                {process.env.ACCOUNT_APP_URL}
                {loading ? (
                    <p>loading...</p>
                ) : (
                    <Routes>
                        <Route path="/:id" element={<MyFolder data={data} />} />
                        <Route path="/" element={<MyFolder data={data} />} />
                        <Route path="/note/:id" element={<MyNote/>} />
                    </Routes>
                )}
            </div>
        </div>):(
                <SayLogin/>
            )}
        </>
    );
}
