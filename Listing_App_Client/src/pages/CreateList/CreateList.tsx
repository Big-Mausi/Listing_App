import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createListing } from '../../features/listings/listingSlice';
import './style.css';

const CreateListing = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error } = useAppSelector((state) => state.listings);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImageFiles(Array.from(e.target.files));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setVideoFiles(Array.from(e.target.files));
  };

  // Handler for the 3D GLB file selector
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModelFile(e.target.files[0]);
    }
  };

  const uploadToCloudinary = async (file: File, type: 'image' | 'video'| 'raw') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'shelta_asset');

    console.log("Uploading file:", file.name);
    console.log("Upload type:", type);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dmmkhddj4/${type}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log("Cloudinary status:", res.status)
      console.log('Cloudinary upload response:', data);

      if (!res.ok) {
        throw new Error(
          data?.error?.message || JSON.stringify(data)
        );
      }

      // if (!data.secure_url) throw new Error('Failed to upload file');
      return data.secure_url;
    } catch (error) {
      console.error('Error during uploadToCloudinary:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, description, price, location } = form;
    if (!title || !description || !price || !location) {
      alert('Please fill all fields');
      return;
    }

    if (!user) {
      alert('You must be logged in to create a listing.');
      return;
    }

    setUploading(true);

    try {
      const images: string[] = [];
      const videos: string[] = [];
      let modelUrl = ''; // Tracks the uploaded 3D asset URL

      for (const image of imageFiles) {
        const url = await uploadToCloudinary(image, 'image');
        images.push(url);
      }

      for (const video of videoFiles) {
        const url = await uploadToCloudinary(video, 'video');
        videos.push(url);
      }

      if (modelFile) {
        modelUrl = await uploadToCloudinary(modelFile, 'raw');
      }

      const payload = {
        title,
        description,
        price: parseFloat(price),
        location,
        images,
        videos,
        modelUrl,
      };

      await dispatch(createListing(payload)).unwrap();
      alert('Listing created successfully!');
      setForm({ title: '', description: '', price: '', location: '' });
      setImageFiles([]);
      setVideoFiles([]);
      setModelFile(null);
    } catch (err) {
      console.error('Error creating listing:', err);
      alert(`Failed to create listing: ${err}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleInputChange}
        required
        className="form-input"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleInputChange}
        required
        className="form-textarea"
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleInputChange}
        required
        className="form-input"
      />
      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleInputChange}
        required
        className="form-input"
      />
      <label className="form-label">Upload Images</label>
      <input type="file" accept="image/*" multiple onChange={handleImageChange} className="form-input" />
      <label className="form-label">Upload Videos</label>
      <input type="file" accept="video/*" multiple onChange={handleVideoChange} className="form-input" />
      <label className="form-label">Upload 3D House Structure (.glb format)</label>
      <input type="file" accept=".glb" onChange={handleModelChange} className="form-input" />
      <button type="submit" disabled={uploading || loading} className="form-button">
        {uploading || loading ? 'Processing...' : 'Create Listing'}
      </button>
      {error && <p className="form-error">Error: {error}</p>}
    </form>
  );
};

export default CreateListing;