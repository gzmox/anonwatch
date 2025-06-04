const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const uploadFolder = '/uploads';
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadFolder),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use('/videos', express.static('uploads'));

app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.redirect('/');
});

app.get('/list-videos', (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) return res.status(500).send('Server error');
    const videoFiles = files.filter(file => /\.(mp4|webm|ogg)$/i.test(file));
    res.json(videoFiles);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
