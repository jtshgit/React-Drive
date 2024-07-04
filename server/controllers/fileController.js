const path = require('path');
const Notes = require('../model/notes');
const File = require('../model/file');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

exports.getNotes =  async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({success: false, error: 'Unauthorized',auth: false });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(verified){
            const allNotes = await Notes.find({userId: verified.id});
            res.json({ success: true,note: null,struct: allNotes,auth: true });
        }
    } catch (error) {
        res.json({success: false, error: 'Unauthorized',auth: false });
    }
};

exports.fetchFiles = async (req, res) => {
    const { parent } = req.body;
    const folder = await File.findOne({ _id: parent });
    const note = await Notes.findOne({ _id: folder.note });
    const folderFirst = await File.findOne({ _id: note.path });
    
    if(folder){
        const allfiles = await File.find();
        res.json({ found: true, owner: true,success: true,note: folderFirst._id, struct: allfiles, auth: true });
    }else{
    res.json({found: false, success: true });
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
            const newFile = new File({ name,type: "folder", path: null, note: newNote._id,parent: newNote._id});
            await newFile.save();
            const updatedNote = await Notes.findByIdAndUpdate(
                newNote._id, // Find the newly created note by its ID
                { $set: { path: newFile._id } }, // Update operation
                { new: true } // Option to return the updated document
              );
            res.json({ success: true });
        }
    } catch (error) {
        res.status(400).json({success: false, error: 'Unauthorized',auth: false });
        console.log(error)
    }
};


exports.createFolderInNote =  async (req, res) => {
    
    const token = req.cookies.token;
    const { name,folderId } = req.body;
    if (!token){
        return res.status(400).json({success: false, error: 'Unauthorized' });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // res.json({ message: 'Protected content', user: verified });
        if(verified){
            const folder = await File.findOne({ _id: folderId });
            const Note = await Notes.findOne({ _id: folder.note });
            if(verified.id === Note.userId){
                const newFile = new File({ name,type: "folder", path: null, note: Note._id,parent: folder._id});
                await newFile.save();
                res.json({ success: true });
            }else{
                res.status(400).json({success: false, error: 'Unauthorized',auth: false }); 
            }
            // const newNote = new Notes({ name, userId: verified.id, userName: verified.name  });
            // await newNote.save();
            // const newFile = new File({ name,type: "folder", path: null, note: newNote._id,parent: newNote._id});
            // await newFile.save();
            // const updatedNote = await Notes.findByIdAndUpdate(
            //     newNote._id, // Find the newly created note by its ID
            //     { $set: { path: newFile._id } }, // Update operation
            //     { new: true } // Option to return the updated document
            //   );
        }
    } catch (error) {
        res.status(400).json({success: false, error: 'Unauthorized',auth: false });
    }
};