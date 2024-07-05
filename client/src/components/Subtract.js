import React, { useRef, useState } from "react";
import axios from "axios";

const Subtract = () => {
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

    const startTime = Date.now();

    try {
      const response = await axios.post("https://api.tradly.in/upload", formData, {
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
            uploadedBytes: prevState.uploadedBytes + loaded,
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
      console.log("Upload success:", response.data);
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
    <div
      className={`upload-box ${isDragging ? "dragging" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p>Upload your files</p>
      <form>
        <input
          className="file-input"
          type="file"
          name="file"
          multiple
          hidden
          ref={fileInputRef}
          onChange={uploadFiles}
        />
        <div className="icon" onClick={handleFileInputClick}>
          <img src="./folder.svg" alt="folder-icon" />
        </div>
        <p>Browse Files to upload or drag and drop them here</p>
      </form>
      {showProgress && (
        <section className="loading-area">
          {files.map((file, index) => (
            <li className="row" key={index}>
              <i className="fas fa-file-alt"></i>
              <div className="content">
                <div className="details">
                  <div className="name">{`${file.name} - uploading`}</div>
                  <div className="percent">{`${file.loading}%`}</div>
                  <div className="loading-bar">
                    <div className="loading" style={{ width: `${file.loading}%` }}></div>
                  </div>
                  <div className="stats">
                    <p>{`Uploaded: ${formatBytes(file.uploadedBytes)} / ${formatBytes(file.totalBytes)}`}</p>
                    <p>{`Speed: ${formatBytes(file.speed)}/s`}</p>
                    <p>{`Remaining time: ${file.remainingTime}s`}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          <div className="combined-stats">
            <p>{`Total Uploaded: ${formatBytes(combinedStats.uploadedBytes)} / ${formatBytes(combinedStats.totalBytes)}`}</p>
            <p>{`Overall Speed: ${formatBytes(combinedStats.speed)}/s`}</p>
            <p>{`Total Remaining time: ${combinedStats.remainingTime}s`}</p>
          </div>
        </section>
      )}

      <section className="uploaded-area">
        {uploadedFiles.map((file, index) => (
          <li className="row" key={index}>
            <div className="content upload">
              <i className="fas fa-file-alt"></i>
              <div className="details">
                <span className="name">{file.name}</span>
                <span className="size">{file.size}</span>
              </div>
            </div>
            <i className="fas fa-check"></i>
          </li>
        ))}
      </section>
    </div>
  );
};

export default Subtract;
