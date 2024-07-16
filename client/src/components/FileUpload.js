import React, { useRef, useState } from "react";
import axios from "axios";
import '../css/FileUpload.css';

export default function FileUpload({ folderId,updateData }) {
  const [files, setFiles] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [combinedStats, setCombinedStats] = useState({
    uploadedBytes: 0,
    totalBytes: 0,
    speed: 0,
    remainingTime: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      uploadFiles({ target: { files: droppedFiles } });
    }
  };

  const uploadFiles = async (event) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles.length) return;

    const filesArray = Array.from(selectedFiles);
    const newFiles = filesArray.map((file) => ({
      name: file.name,
      size: file.size,
      uploadedBytes: 0,
      totalBytes: file.size,
      speed: 0,
      remainingTime: 0,
      loading: 0,
    }));

    const totalBytes = filesArray.reduce((total, file) => total + file.size, 0);
    setCombinedStats((prevState) => ({ ...prevState, totalBytes }));
    setFiles((prevState) => [...prevState, ...newFiles]);
    setShowProgress(true);

    await Promise.all(filesArray.map((file) => uploadFile(file)));
  };

  const uploadFile = async (file) => {
    const fileName = file.name;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("parentId", folderId );

    const startTime = Date.now();
    try {
        const response = await axios.post("http://localhost:5001/upload", formData, {
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const progress = Math.floor((loaded / total) * 100);
                const elapsedTime = (Date.now() - startTime) / 1000; // seconds
                const speed = loaded / elapsedTime; // bytes per second
                const remainingTime = ((total - loaded) / speed).toFixed(2); // seconds

                setFiles((prevState) =>
                    prevState.map((f) =>
                        f.name === fileName
                            ? {
                                ...f,
                                uploadedBytes: loaded,
                                loading: progress,
                                speed,
                                remainingTime,
                            }
                            : f
                    )
                );

                setCombinedStats((prevState) => ({
                    ...prevState,
                    uploadedBytes: loaded,
                    speed: (prevState.uploadedBytes + loaded) / elapsedTime,
                    remainingTime: ((prevState.totalBytes - prevState.uploadedBytes - loaded) / speed).toFixed(2),
                }));

                if (loaded === total) {
                    const fileSize = total < 1024 ? `${total} KB` : `${(loaded / (1024 * 1024)).toFixed(2)} MB`;
                    setUploadedFiles((prevUploadedFiles) => [
                        ...prevUploadedFiles,
                        { name: fileName, size: fileSize },
                    ]);
                }
            },
        });

      updateData(response.data.file);
      
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setFiles((prevState) => prevState.filter((f) => f.name !== fileName));
      if (files.length === 1) setShowProgress(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  return (
    <div className="formbold-main-wrapper">
      
      <div className="formbold-form-wrapper">
        <form>
          <div className="mb-6">
            <div className={`formbold-mb-5 formbold-file-input ${isDragging ? "dragging" : ""}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}>
              <input type="file" name="file" hidden ref={fileInputRef} onChange={uploadFiles} multiple/>
              <label>
                <div>
                  <span className="formbold-drop-file">Drop files here </span>
                  <span className="formbold-or"> Or </span>
                  <span onClick={handleFileInputClick} className="formbold-browse"> Browse </span>
                </div>
              </label>
            </div>
            {showProgress && (
              files.map((file, index) => (
                <div key={index}>
                  <div className="formbold-file-list formbold-mb-5">
                    <div className="formbold-file-item">
                      <span className="formbold-file-name">{file.name}</span>
                      <div className="naming">
                        <span className="data">{`${formatBytes(file.uploadedBytes)} / ${formatBytes(file.totalBytes)}`}</span>
                        <button>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                              d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                              fill="currentColor" />
                            <path fillRule="evenodd" clipRule="evenodd"
                              d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                              fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignContent: "center", alignItems: "center", height: "30px", marginTop: "5px" }}>
                      <div style={{ fontSize: "10px", width: "30px" }}>{`${file.loading}%`}</div>
                      <div className="formbold-progress-bar">
                        <div className="formbold-progress" style={{ width: `${file.loading}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))

            )}

            {uploadedFiles.map((file, index) => (
              <div className="formbold-file-list formbold-mb-5" key={index}>
                <div className="formbold-file-item">
                  <span className="formbold-file-name"> {file.name} </span>
                  <div className="naming">
                    <span className="data">{file.size}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* <div>
          <button className="formbold-btn w-full">Send File</button>
        </div> */}
        </form>
      </div>
    </div>
  )
}
