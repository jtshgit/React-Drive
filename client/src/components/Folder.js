import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Toast from 'react-hot-toast';
import { createFolderinNote } from './server/ServerService';
const folderIcon = process.env.PUBLIC_URL + "/folder.svg";
const fileIcon = process.env.PUBLIC_URL + "../logo192.png";
const Folder = ({ data }) => {
  // console.log(childFiles)
  const id = useParams();
  const folderId = id.id;
  let childFiles;
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  const creatNotes = async () => {
    try {
      const response = await Toast.promise(
        createFolderinNote(name, folderId),
        {
          loadving: 'Creating...', // Optional loading message
          success: 'Done',
          error: 'Please Login',
        }
      );
    } catch (error) { }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };






  if (id.id) {
    childFiles = data.struct.filter((child) => child.parent === id.id);
  } else {
    childFiles = data.struct.filter((child) => child.parent === null);
  }
  let self = data.struct.find(item => item._id === id.id);


  const map = [];
  // map.push(self);
  let organizeData;
  let organizedData;
  if (self) {
    organizeData = (data, child) => {
      data.forEach((item) => {
        if (item._id === child.parent) {
          map.unshift(item);
          organizeData(data, item)
        }
      });
      return Object.values(map);
    }
    organizedData = organizeData(data.struct, self);
  }
  return (
    <div>
      <section className="breadcrumbs">
        <nav className="breadcrumb_nav" aria-label="breadcrumb">
          <ol className="breadcrumb">
            {self ? (organizedData.map((item) => (
              <li key={item._id} className="breadcrumb-item"><Link to={`/note/${item._id}`}>{item.name}</Link></li>
            )))

              : ""}

            {self ? (<li className="breadcrumb-item active" aria-current="page"><span>{self.name}</span></li>) : ""}
          </ol> </nav>
      </section>
      <section>
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
      </section>

      {self ? (childFiles.length === 0 ? <center className="no_file_here"><img src={folderIcon} alt="abc" /><h4>No file here</h4></center> : "") : <center className="no_file_here"><img src={folderIcon} alt="" /><h4>Not Exist</h4></center>}
      <ul style={{ marginTop: "3px" }}>
        {childFiles.map((file) => (
          <center key={file._id} className="folder-icon">
            <Link to={"/note/" + file._id}>
              <div>
                <img
                  src={file.type === "folder" ? folderIcon : fileIcon}
                  alt="abc"
                />
                <span>{file.name}</span>
              </div>
            </Link>
          </center>
        ))}
      </ul>
      {/* <FileUpload/> */}
      {/* <FileGet/> */}
    </div>
  );
};

export default Folder;

/* <center class="folder-icon" data-name="<%= file.name %>" data-ref="<%= file._id %>">
                  <a href="/folder/<%= file._id %>">
                      <div>
                          <img src="./images/folder.svg" alt="">
                          <span>
                              <%= file.name %>
                          </span>
                      </div>
                  </a>
              </center>
              <% } else { %>
                  <center class="folder-icon" data-name="<%= file.name %>" data-ref="<%= file._id %>">
                      <a href="#">
                          <div>
                              <img style="border: 1px solid rgb(237, 237, 237); border-radius: 4px;"
                                  src="<%= file.blobUrl %>" alt="">
                              <span>
                                  <%= file.name %>
                              </span>
                          </div>
                      </a>
                  </center> */

