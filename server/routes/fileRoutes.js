const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.get('/', fileController.getRoot);
router.get('/folder/:id', fileController.getFolderContent);
router.post('/create-folder', fileController.createFolder);
router.post('/upload-file', fileController.uploadFile);
router.delete('/delete/:id', fileController.deleteFileOrFolder);


module.exports = router;
