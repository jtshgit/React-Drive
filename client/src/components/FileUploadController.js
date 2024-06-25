import axios from "axios";

export const uploadFiles = async (files, updateFileProgress, updateCombinedStats, addUploadedFile) => {
  const startTime = Date.now();
  const totalBytes = files.reduce((total, file) => total + file.size, 0);
  let uploadedBytes = 0;

  const updateStats = (loaded, total, speed, remainingTime) => {
    uploadedBytes += loaded;
    updateCombinedStats((prevState) => ({
      ...prevState,
      uploadedBytes,
      speed: uploadedBytes / ((Date.now() - startTime) / 1000),
      remainingTime: ((totalBytes - uploadedBytes) / speed).toFixed(2),
    }));
  };

  await Promise.all(files.map((file) => uploadFile(file, startTime, updateFileProgress, updateStats, addUploadedFile)));
};

const uploadFile = async (file, startTime, updateFileProgress, updateStats, addUploadedFile) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("https://www.tradly.in/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const progress = Math.floor((loaded / total) * 100);
        const elapsedTime = (Date.now() - startTime) / 1000; // seconds
        const speed = loaded / elapsedTime; // bytes per second
        const remainingTime = ((total - loaded) / speed).toFixed(2); // seconds

        updateFileProgress(file.name, loaded, progress, speed, remainingTime);
        updateStats(loaded, total, speed, remainingTime);

        if (loaded === total) {
          const fileSize = total < 1024 ? `${total} KB` : `${(loaded / (1024 * 1024)).toFixed(2)} MB`;
          addUploadedFile({ name: file.name, size: fileSize });
        }
      },
    });
    console.log("Upload success:", response.data);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
