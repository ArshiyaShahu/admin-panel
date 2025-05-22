import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import axios from '../axios';

function Create() {
  const navigate = useNavigate();

  const [modelName, setModelName] = useState('');
  const [modelCode, setModelCode] = useState('');
  const [brand, setBrand] = useState('');
  const [classType, setClassType] = useState('');
  const [price, setPrice] = useState('');
  const [dateOfManufacturing, setDateOfManufacturing] = useState('');
  const [active, setActive] = useState(true);
  const [sortOrder, setSortOrder] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [images, setImages] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(file => file.size <= maxSize);

    if (validFiles.length < files.length) {
      alert("Some files are larger than 5MB and have been ignored.");
    }

    setImages(validFiles);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setButtonClicked(true);

  const formData = new FormData();
  formData.append('modelName', modelName);
  formData.append('modelCode', modelCode);
  formData.append('brand', brand);
  formData.append('class', classType);
  formData.append('price', price);
  formData.append('dateOfManufacturing', dateOfManufacturing);
  formData.append('active', active);
  formData.append('sortOrder', sortOrder || 0);
  formData.append('description', description);
  formData.append('features', features);

  for (let i = 0; i < images.length; i++) {
    formData.append('images', images[i]);
  }

  try {
    await axios.post('http://localhost:4000/api/car-models', formData);
    alert('Car model saved successfully!');
    navigate('/');
  } catch (err) {
    console.error('Error saving model:', err);
    alert('Failed to save car model. Please try again.');
  } finally {
    // reset click animation after short delay
    setTimeout(() => setButtonClicked(false), 300);
  }
};


  return (
    <div style={{
      padding: '30px',
      maxWidth: '800px',
      margin: 'auto',
      background: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 0 12px rgba(0,0,0,0.1)'
    }}>
      {/* Embed Toggle CSS */}
      <style>
        {`
          .switch {
            position: relative;
            display: inline-block;
            width: 45px;
            height: 20px;
          }
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.4s;
            border-radius: 30px;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 15.1px;
            width: 12px;
            left: 0.5px;
            bottom: 3px;
            background-color: white;
            transition: 0.4s;
            border-radius: 50%;
          }
          input:checked + .slider {
            background-color: #4caf50;
          }
          input:checked + .slider:before {
            transform: translateX(30px);
          }
        `}
      </style>

      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>🚗 Add New Car Model</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Model Name" value={modelName} onChange={(e) => setModelName(e.target.value)} required />
        <input type="text" placeholder="Model Code" value={modelCode} onChange={(e) => setModelCode(e.target.value)} required />

        <select value={brand} onChange={(e) => setBrand(e.target.value)} required>
          <option value="">Select Brand</option>
          <option value="Toyota">Toyota</option>
          <option value="Honda">Honda</option>
          <option value="Ford">Ford</option>
          <option value="BMW">BMW</option>
          <option value="Tesla">Tesla</option>
        </select>

        <select value={classType} onChange={(e) => setClassType(e.target.value)} required>
          <option value="">Select Class</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Truck">Truck</option>
        </select>

        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="date" value={dateOfManufacturing} onChange={(e) => setDateOfManufacturing(e.target.value)} required />

        {/* Fancy Active Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
          <label htmlFor="activeToggle">Active:</label>
          <label className="switch">
            <input
              id="activeToggle"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <input type="number" placeholder="Sort Order (optional)" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />

        <label style={{ fontWeight: 'bold' }}>Description:</label>
        <FroalaEditorComponent tag="textarea" model={description} onModelChange={setDescription} />

        <label style={{ fontWeight: 'bold' }}>Features:</label>
        <FroalaEditorComponent tag="textarea" model={features} onModelChange={setFeatures} />

        <label style={{ fontWeight: 'bold' }}>Upload Images (Max 5MB each):</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        <button
         type="submit"
         style={{
         backgroundColor: buttonClicked ? '#0069d9' : '#007bff',
         color: '#fff',
         padding: '12px',
         border: 'none',
         borderRadius: '8px',
         cursor: 'pointer',
         fontSize: '16px',
         marginTop: '10px',
        transition: 'background-color 0.3s ease'
        }}
    >
         ✅ Save Model
        </button>

      </form>
    </div>
  );
}

export default Create;
