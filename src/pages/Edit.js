import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FroalaEditorComponent from 'react-froala-wysiwyg';

function Edit() {
  const { id } = useParams();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/car-models/${id}`)
      .then(res => {
        const data = res.data;
        setValue('brand', data.brand);
        setValue('class', data.class);
        setValue('modelName', data.modelName);
        setValue('modelCode', data.modelCode);
        setValue('price', data.price);
        setValue('dateOfManufacturing', data.dateOfManufacturing.slice(0, 10));
        setValue('active', data.active);
        setValue('sortOrder', data.sortOrder);
        setDescription(data.description);
        setFeatures(data.features);
        setExistingImages(data.images);
      });
  }, [id, setValue]);

  const handleImageDelete = (img) => {
    setExistingImages(prev => prev.filter(i => i !== img));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('brand', data.brand);
    formData.append('class', data.class);
    formData.append('modelName', data.modelName);
    formData.append('modelCode', data.modelCode);
    formData.append('description', description);
    formData.append('features', features);
    formData.append('price', data.price);
    formData.append('dateOfManufacturing', data.dateOfManufacturing);
    formData.append('active', data.active ? true : false);
    formData.append('sortOrder', data.sortOrder || 0);
    formData.append('existingImages', JSON.stringify(existingImages));

    for (let i = 0; i < newImages.length; i++) {
      formData.append('images', newImages[i]);
    }

    try {
      setIsSubmitting(true);
      await axios.put(`http://localhost:4000/api/car-models/edit/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Car Model Updated Successfully!');
    } catch (err) {
      alert('Error updating car model');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" style={{ maxWidth: '700px', margin: 'auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Edit Car Model</h2>

      <label>Brand:</label>
      <select {...register('brand')} required>
        <option value="Audi">Audi</option>
        <option value="Jaguar">Jaguar</option>
        <option value="Land Rover">Land Rover</option>
        <option value="Renault">Renault</option>
      </select>

      <label>Class:</label>
      <select {...register('class')} required>
        <option value="A-Class">A-Class</option>
        <option value="B-Class">B-Class</option>
        <option value="C-Class">C-Class</option>
      </select>

      <label>Model Name:</label>
      <input type="text" {...register('modelName')} required />

      <label>Model Code:</label>
      <input type="text" {...register('modelCode')} required maxLength={10} />

      <label>Description:</label>
      <FroalaEditorComponent model={description} onModelChange={setDescription} />

      <label>Features:</label>
      <FroalaEditorComponent model={features} onModelChange={setFeatures} />

      <label>Price:</label>
      <input type="number" step="0.01" {...register('price')} required />

      <label>Date of Manufacturing:</label>
      <input type="date" {...register('dateOfManufacturing')} required />

      <label>Active:</label>
      <input type="checkbox" {...register('active')} value={true} />

      <label>Sort Order:</label>
      <input type="number" {...register('sortOrder')} />

      <label>Existing Images:</label>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {existingImages.map((img, idx) => (
          <div key={idx}>
            <img src={`http://localhost:4000${img}`} width="100" alt="car" />
            <button type="button" onClick={() => handleImageDelete(img)}>❌</button>
          </div>
        ))}
      </div>

      <label>Upload New Images:</label>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        multiple
        onChange={e => setNewImages(e.target.files)}
      />
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
        {Array.from(newImages).map((file, idx) => (
          <img key={idx} src={URL.createObjectURL(file)} width="100" alt="preview" />
        ))}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
}

export default Edit;
