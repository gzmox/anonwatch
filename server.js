const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const uploadDir = path.join(__dirname, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.use(express.static('public'));

app.post('/upload', upload.single('video'), (req, res) => {
  res.send('Video uploaded successfully!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
