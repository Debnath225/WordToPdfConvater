const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.post('/convert', upload.single('wordFile'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded.');

  const inputPath = path.resolve(file.path);
  const outputPath = inputPath + '.pdf';

  // Convert using LibreOffice (needs to be installed on the server)
  exec(`libreoffice --headless --convert-to pdf "${inputPath}" --outdir "${path.dirname(inputPath)}"`, (err) => {
    if (err) return res.status(500).send('Conversion failed.');

    res.download(outputPath, file.originalname.replace(/\.(docx|doc)$/i, '.pdf'), () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
