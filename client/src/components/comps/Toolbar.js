import React, { useState } from 'react'
import Toast from 'react-hot-toast';
import { createFolderinNote } from '../server/ServerService';
import FileUpload from "../FileUpload";

export default function Toolbar({folderId,updateData}) {
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
        updateData(response.data.folder);
      } catch (error) { }
    };
  return (
    <section>
        <div className="toolbar">
          <div className="dropdown">
            <button className="button-4 " data-bs-toggle="dropdown" aria-expanded="false"><img alt="Tradly.in" src="../add_circle.svg" height={"15px"} /> Add
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="/" data-bs-toggle="modal" data-bs-target="#createFolder" >Create Folder</a></li>
              <li><a className="dropdown-item" href="/" data-bs-toggle="modal" data-bs-target="#uploadFile">Upload File</a></li>
              <li><a className="dropdown-item" href="/">Upload Folder</a></li>
            </ul>
          </div>
          <div className="vertical"></div>
        </div>

        <div className="modal fade " id="createFolder" tabIndex="-1" aria-labelledby="createFolderLabel" aria-hidden="true">
          <div className="modal-dialog" >
            <div className="modal-content" style={{ borderRadius: "15px", border: "none" }}>
              <div className="modal-header" style={{ borderBottom: "none", paddingBottom: "10px" }}>
                <h1 className="modal-title fs-5" id="createFolderLabel">Create Folder</h1>
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
        <div className="modal fade " id="uploadFile" tabIndex="-1" aria-labelledby="uploadFileLabel" aria-hidden="true">
          <div className="modal-dialog" >
            <div className="modal-content" style={{ borderRadius: "15px", border: "none",border:"1px solid black" }}>
              <div className="modal-header" style={{ borderBottom: "none", paddingBottom: "10px" }}>
                <h1 className="modal-title fs-5" id="uploadFileLabel">Upload File</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <FileUpload folderId={folderId} updateData={updateData}/>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
