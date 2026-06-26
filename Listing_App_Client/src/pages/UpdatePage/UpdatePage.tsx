import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchUserListingById,
  updateListing,
  selectSingleListing,
  selectListingsLoading,
  selectListingsError,
} from '../../features/listings/listingSlice';
import './style.css';

// interface Listing {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   location: string;
//   images: string[];
//   videos?: string[];
//   user: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

const UpdateListing = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem('user') || '{}');
  const listing = useAppSelector(selectSingleListing);
  const loading = useAppSelector(selectListingsLoading);
  const error = useAppSelector(selectListingsError);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    location: '',
    images: [] as string[],
    videos: [] as string[],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    console.log('User:', user);
    console.log('Listing ID:', id);
    if (!user.id) {
      console.error('No user ID found, redirecting to login');
      navigate('/login');
      return;
    }
    if (id && user.id) {
      console.log('Fetching listing for userId:', user.id, 'listingId:', id);
      dispatch(fetchUserListingById({ userId: user.id, listingId: id }));
    } else {
      console.error('Invalid listing ID or user ID');
      setFormError('Invalid listing or user ID');
    }
  }, [dispatch, navigate, id, user.id]);

  useEffect(() => {
    console.log('Listing:', listing);
    console.log('Loading:', loading);
    console.log('Error:', error);
    if (listing) {
      console.log('Pre-filling form with listing:', listing);
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        images: listing.images || [],
        videos: listing.videos || [],
      });
    }
  }, [listing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'images' | 'videos') => {
    const files = Array.from(e.target.files || []);
    const validTypes = field === 'images' ? ['image/jpeg', 'image/png'] : ['video/mp4', 'video/mov'];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setUploadError(`Invalid file types: ${invalidFiles.map((f) => f.name).join(', ')}. ${field === 'images' ? 'Use JPEG or PNG.' : 'Use MP4 or MOV.'}`);
      return;
    }

    if (field === 'images') {
      setImageFiles((prev) => [...prev, ...files]);
    } else {
      setVideoFiles((prev) => [...prev, ...files]);
    }
    setUploadError('');
  };

  const removeFile = (index: number, field: 'images' | 'videos') => {
    if (field === 'images') {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setVideoFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const removeExistingUrl = (index: number, field: 'images' | 'videos') => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const uploadToCloudinary = async (file: File, resourceType: 'image' | 'video') => {
    const formData = new FormData();
    console.log(formData);
    
    formData.append('file', file);
    formData.append('upload_preset', 'ramos_realty');
    formData.append('resource_type', resourceType);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dlqwmscse/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      console.log('data from cloudinary', data );
      
      if (data.secure_url) {
        return data.secure_url;        
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      // Type-safe error handling
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred during upload';
      throw new Error(`Failed to upload ${resourceType}: ${errorMessage}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setUploadError('');
    setUploading(true);

    if (!formData.title || !formData.description || !formData.price || !formData.location) {
      setFormError('Please fill in all required fields');
      setUploading(false);
      return;
    }

    try {
      const newImageUrls = [];
      for (const file of imageFiles) {
        const url = await uploadToCloudinary(file, 'image');
        newImageUrls.push(url);
      }

      const newVideoUrls = [];
      for (const file of videoFiles) {
        const url = await uploadToCloudinary(file, 'video');
        newVideoUrls.push(url);
      }

      const updatedFormData = {
        ...formData,
        images: [...formData.images, ...newImageUrls],
        videos: [...formData.videos, ...newVideoUrls],
      };

      if (id && user.id) {
        console.log('Submitting update for listingId:', id, 'with data:', updatedFormData);
        const resultAction = await dispatch(
          updateListing({
            id,
            updates: {
              title: updatedFormData.title,
              description: updatedFormData.description,
              price: updatedFormData.price,
              location: updatedFormData.location,
              images: updatedFormData.images,
              videos: updatedFormData.videos,
            },
          })
        );
        if (updateListing.fulfilled.match(resultAction)) {
          console.log('Update successful, navigating to dashboard');
          navigate('/dashboard');
        } else {
          setFormError((resultAction.payload as string) || 'Failed to update listing');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Update error:', errorMessage);
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) return <p>Loading listing...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!listing && !loading && !error) {
    return <p>Listing not found</p>;
  }

  return (
    <div className="update-page">
      <div className="update-container">
        <h2>Update Listing</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {formError && <p className="error">{formError}</p>}
        {uploadError && <p className="error">{uploadError}</p>}

        {listing && (
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="images">Upload New Images (JPEG, PNG)</label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/jpeg,image/png"
                multiple
                onChange={(e) => handleFileChange(e, 'images')}
              />
              <div className="file-preview">
                {formData.images.map((url, index) => (
                  <div key={`existing-image-${index}`} className="preview-item">
                    <img src={url} alt="Existing" className="preview-image" />
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeExistingUrl(index, 'images')}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {imageFiles.map((file, index) => (
                  <div key={`new-image-${index}`} className="preview-item">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="preview-image" />
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeFile(index, 'images')}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="videos">Upload New Videos (MP4, MOV)</label>
              <input
                type="file"
                id="videos"
                name="videos"
                accept="video/mp4,video/mov"
                multiple
                onChange={(e) => handleFileChange(e, 'videos')}
              />
              <div className="file-preview">
                {formData.videos.map((url, index) => (
                  <div key={`existing-video-${index}`} className="preview-item">
                    <video src={url} className="preview-video" controls />
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeExistingUrl(index, 'videos')}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {videoFiles.map((file, index) => (
                  <div key={`new-video-${index}`} className="preview-item">
                    <p>{file.name}</p>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeFile(index, 'videos')}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={loading || uploading}>
                {uploading ? 'Uploading...' : loading ? 'Updating...' : 'Update Listing'}
              </button>
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateListing;