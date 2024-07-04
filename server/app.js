const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const session = require('express-session');
const mongoose = require('mongoose');
const File = require('./model/file');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const fileController = require('./controllers/fileController');
const cors = require('cors');


const app = express();
const port = 5001;
dotenv.config();
app.use(cookieParser());
app.use(bodyParser.json());
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI);
app.post('/add', (req, res) => {
    const { num1, num2 } = req.body;
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        const sum = num1 + num2;
        res.json({ success: true, sum: sum });
    } else {
        res.status(400).json({ success: false, error: "number are not valid" });
    }
});
let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: 'mail@tradly.in',
        pass: '@Mypw123',
    }
});
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // const result = await User.deleteMany({});
        // await User.drop();
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
        let mailOptions = {
            from: '"Tradly" mail@tradly.in', // Sender address
            to: email.toLowerCase(), // List of receivers
            subject: 'Your One-Time Password (OTP) for Verification',
            html: '<!DOCTYPE html><html><head><style>body {font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;} .container {width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);} .header {text-align: center; padding: 10px 0; border-bottom: 1px solid #e0e0e0;} .header h1 {margin: 0; color: #333333;} .content {padding: 20px;} .content p {font-size: 16px; color: #333333;} .otp {font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #333333;} .footer {text-align: center; font-size: 14px; color: #666666; padding: 10px 0; border-top: 1px solid #e0e0e0;}</style></head><body><div class="container"><div class="header"><h1>Tradly</h1></div><div class="content"><p>Dear ' + name + ',</p><p>We have received a request to verify your email address for MyApp. Please use the following One-Time Password (OTP) to complete your verification process:</p><div class="otp">' + otp + '</div><p>This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone for security reasons. If you did not request this verification, please ignore this email.</p><p>If you have any questions or need further assistance, please contact our support team.</p><p>Thank you for using Tradly.in.</p></div><div class="footer"><p>Best regards,<br>Tradly Support Team<br>mail@tradly.in</p></div></div></body></html>' // HTML body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({ success: false, error: "Error occurred" });
            }
        });
        const newUser = new User({ name, email: email.toLowerCase(), password: hashedPassword, otp });
        await newUser.save();
        // const token = jwt.sign({ id: newUser._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
        res.status(201).json({ success: true, message: '1' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});
// otpcheck
app.post('/otpcheck', async (req, res) => {
    const { otp, email } = req.body;
    try {

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ success: false, error: 'Invalid username or password' });
        // console.log(otp + user.otp)
        if (otp === user.otp) {
            const token = jwt.sign({ id: user._id.toString(), name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
            res.json({ success: true, message: 'Login successful', token });
        } else {
            return res.status(400).json({ success: false, error: 'Invalid username or password' });

        }
    } catch (error) {
        console.error('Error during Checking OTP:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ success: false, error: 'Invalid username or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid username or password' });
        const token = jwt.sign({ id: user._id.toString(), name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
        res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/sendOtp', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            const otp = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;
            user.otp = otp;
            await user.save();
            let mailOptions = {
                from: '"Tradly" mail@tradly.in', // Sender address
                to: email.toLowerCase(), // List of receivers
                subject: 'Your One-Time Password (OTP) for Verification',
                html: '<!DOCTYPE html><html><head><style>body {font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;} .container {width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);} .header {text-align: center; padding: 10px 0; border-bottom: 1px solid #e0e0e0;} .header h1 {margin: 0; color: #333333;} .content {padding: 20px;} .content p {font-size: 16px; color: #333333;} .otp {font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #333333;} .footer {text-align: center; font-size: 14px; color: #666666; padding: 10px 0; border-top: 1px solid #e0e0e0;}</style></head><body><div class="container"><div class="header"><h1>Tradly</h1></div><div class="content"><p>Dear ' + user.name + ',</p><p>We have received a request to Change your Password for Tradly account. Please use the following One-Time Password (OTP) to complete your verification process:</p><div class="otp">' + otp + '</div><p>This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone for security reasons. If you did not request this verification, please ignore this email.</p><p>If you have any questions or need further assistance, please contact our support team.</p><p>Thank you for using Tradly.in.</p></div><div class="footer"><p>Best regards,<br>Tradly Support Team<br>mail@tradly.in</p></div></div></body></html>' // HTML body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).json({ error: "Error occurred" });
                }
            });
            res.status(201).json({ message: '1' });
        } else {
            res.status(400).json({ error: "0" });
        }
        // const token = jwt.sign({ id: newUser._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).json({ error: error.message });
    }
});


app.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.json({ success: true, message: 'Logged out' });
});

app.get('/protected', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ success: false, error: 'Unauthorized', auth: false });
    }
    try {
        // console.log("hi")
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ success: true, message: 'Protected content', user: verified });
    } catch (error) {
        res.json({ success: false, error: 'Unauthorized', auth: false });
    }
});

// const router = express.Router();
app.post('/fetchMyDrive', fileController.getNotes);
app.post('/createNotes', fileController.createNote);
app.post('/createfolderinnote', fileController.createFolderInNote);
app.post('/fetch', fileController.fetchFiles);














const sharedKeyCredential1 = new StorageSharedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);
const blobServiceClient1 = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    sharedKeyCredential1
);














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
