import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setDownloading(true);

    const formData = new FormData();
    formData.append('wordFile', file);

    const response = await fetch('http://localhost:5000/convert', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.(docx|doc)$/i, '.pdf');
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert('Conversion failed.');
    }
    setDownloading(false);
  };

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Word to PDF Converter</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".doc,.docx" onChange={handleFileChange} required />
        <button type="submit" disabled={downloading}>
          {downloading ? 'Converting...' : 'Convert to PDF'}
        </button>
      </form>
    </div>
  );
}

export default App;
