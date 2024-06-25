const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const mongoose = require('mongoose');
const File = require('./model/file');

const app = express();
const port = 5001;
dotenv.config();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);




// API endpoint to add two numbers
app.post('/add', (req, res) => {
    const { num1, num2 } = req.body;
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        const sum = num1 + num2;
        res.json({ success: true,sum:sum });
    } else {
        res.status(400).json({  success: false,error:"number are not valid"  });
    }
});
app.post('/fetch',async (req,res) =>{
    const allfiles = await File.find();
    res.json({ success: true,struct:allfiles });
    console.log("sent")
});

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
);

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req, res) => {
    console.log("hi")
    try {
        const blobName = req.file.originalname;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const stream = req.file.buffer;
        const streamLength = req.file.size;

        await blockBlobClient.upload(stream, streamLength, {
            onProgress: (progress) => {
                console.log(`Uploaded ${progress.loadedBytes} of ${streamLength} bytes`);
            }
        });
        res.status(200).json({ message: 'File uploaded successfully.', url: blockBlobClient.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
