const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Upload folder
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Configure multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadFolder),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Middleware
app.use('/uploads', express.static(uploadFolder));
app.use(express.static('public'));

// Upload route
app.post('/upload', upload.single('video'), (req, res) => {
  res.redirect('/');
});

// Main page
app.get('/', (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) return res.send('Error reading files.');
    const videos = files.filter(f => f.endsWith('.mp4'));
    let html = `
      <h1>📹 Anonymous Video Watch</h1>
      <form method="POST" action="/upload" enctype="multipart/form-data">
        <input type="file" name="video" accept="video/mp4" required />
        <button type="submit">Upload</button>
      </form>
      <hr/>
    `;
    videos.forEach(file => {
      html += `<video width="400" controls src="/uploads/${file}"></video><br/>`;
    });
    res.send(html);
  });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
