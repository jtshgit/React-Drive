const path = require('path');
const Notes = require('../model/notes');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
exports.getNotes =  async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({success: false, error: 'Unauthorized' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(verified){
            const allNotes = await Notes.find({userId: verified.id});
            res.json({ success: true, struct: allNotes });
        }
    } catch (error) {
        res.json({success: false, error: 'Unauthorized',auth: false });
    }
};

exports.createNote =  async (req, res) => {
    
    const token = req.cookies.token;
    const { name } = req.body;
    if (!token){
        return res.status(400).json({success: false, error: 'Unauthorized' });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // res.json({ message: 'Protected content', user: verified });
        if(verified){
            const newNote = new Notes({ name, userId: verified.id, userName: verified.name  });
            await newNote.save();
            res.json({ success: true });
        }
    } catch (error) {
        res.status(400).json({success: false, error: 'Unauthorized',auth: false });
        console.log(error)
    }
};