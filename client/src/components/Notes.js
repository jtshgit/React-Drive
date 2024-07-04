import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Toast from 'react-hot-toast';
import SayLogin from "./comps/SayLogin";
import { createFolder } from './server/ServerService';


export default function Notes() {
    const [data, setData] = useState(true);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');

    const creatNotes = async () => {
        try {
            const response = await Toast.promise(
                createFolder(name),
                {
                    loading: 'Creating...', // Optional loading message
                    success: 'Done',
                    error: 'Please Login',
                }
            );
        } catch (error) {
            // setMessage('Error logging in');
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };
    const handleAddition = async () => {
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + "/fetchMyDrive", {
                parent: null,
            }, { withCredentials: true });
            setData(response.data);
            setLoading(false);
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
        <div>
            {loading ? (<><div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div></>) : (data.auth?(<section>
            <div className="toolbar">
                <div className="dropdown">
                    <button className="button-4 " data-bs-toggle="dropdown" aria-expanded="false"><img alt="Tradly.in" src="../add_circle.svg" height={"15px"} /> Add
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="/" data-bs-toggle="modal" data-bs-target="#exampleModal" >Create Folder</a></li>
                        <li><a className="dropdown-item" href="/">Upload File</a></li>
                        <li><a className="dropdown-item" href="/">Upload Folder</a></li>
                    </ul>
                </div>
                <div className="vertical"></div>
            </div>

            <div className="modal fade " id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" >
                    <div className="modal-content" style={{ borderRadius: "15px", border: "none" }}>
                        <div className="modal-header" style={{ borderBottom: "none", paddingBottom: "10px" }}>
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Create Folder</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3 d-flex h-200" style={{ height: "35px" }}>
                                    <input onChange={(e) => setName(e.target.value)} type="text" className="form-control" id="recipient-name" /><button onClick={creatNotes} type="button" className="btn btn-primary py-1 ms-1">Send message</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="note-container">
                    {(data.struct.map((item) => (
                        <Link to={"./"+item.path} key={item._id} className="note-box">
                            <img className="thumbnail" src={item.image} />
                            <div className="middle">
                                <center className="view">
                                    <img src="../eye.svg" />
                                    <br />
                                    <span>{item.views}</span>
                                </center>
                                <div className="note-name">
                                    <span>{item.name}</span>
                                </div></div>
                            <div className="lowerDet">
                                <div className="lower">
                                    <img className="userP" src={item.userP} />
                                    <div className="naming">
                                        <h4>{item.userName}</h4>
                                        <span>{formatDate(item.createdAt)}</span>
                                    </div>

                                </div>
                                <button className="option">
                                    <img src="../more-three.svg" />
                                </button>
                            </div>
                        </Link>
                    )))}
                </div>
            </section>):(
                <SayLogin/>
            ))}
        </div>
    )
}
