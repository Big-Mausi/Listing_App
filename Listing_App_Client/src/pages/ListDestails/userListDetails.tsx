import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './style.css';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  videos?: string[];
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ListingDetail = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const fetchListing = async () => {
      try {
        console.log(user);
        const response = await axiosInstance.get(`/listings/user/${user.id}/${listingId}`);
        setListing(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch listing');
      } finally {
        setLoading(false);
      }
    };

    if (user.id && listingId) {
      fetchListing();
    } else {
      setError('Invalid user or listing ID');
      setLoading(false);
    }
  }, [listingId, user.id]);


  const handleEdit = () => {
    if (listingId) {
      console.log('Navigating to update page for listingId:', listingId);
      navigate(`/listings/update/${listingId}`);
    }
  };

  
    const handleDelete = async () => {
    if (listingId) {
      console.log('Deleting listing with listingId:', listingId);
      try {
        await axiosInstance.delete(`/listings/${listingId}`);
        console.log('Listing deleted successfully');
        navigate('/dashboard'); 
      } catch (err: any) {
        console.error('Delete error:', err.response?.data);
        setError(err.response?.data?.message || 'Failed to delete listing');
      }
    } else {
      console.error('No listingId provided');
      setError('Invalid listing ID');
    }
  };
 

  if (loading) return <p>Loading listing...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!listing) return <p>Listing not found</p>;

  return (
    <div className="listing-detail-page">
      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      <h2>{listing.title}</h2>
      <div className="listing-detail-content">
        <div className="listing-images">
          {listing.images && listing.images.length > 0 ? (
            listing.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${listing.title} ${index + 1}`}
                className="listing-image"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.png';
                }}
              />
            ))
          ) : (
            <img src="/placeholder.png" alt="No image available" className="listing-image" />
          )}
        </div>
        <div className="listing-info">
          <p><strong>Price:</strong> ${listing.price.toFixed(2)}</p>
          <p><strong>Description:</strong> {listing.description}</p>
          <p><strong>Location:</strong> {listing.location}</p>
          <p><strong>Posted by:</strong> {listing.user.name} ({listing.user.email})</p>
          <p><strong>Created:</strong> {new Date(listing.createdAt).toLocaleDateString()}</p>
          {listing.videos && listing.videos.length > 0 && (
            <div className="listing-videos">
              <h3>Videos</h3>
              {listing.videos.map((video, index) => (
                <video key={index} controls className="listing-video">
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          )}
          <button className="edit-button" onClick={handleEdit}>
            Edit Listing
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;