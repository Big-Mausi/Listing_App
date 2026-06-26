import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchListings,
  selectListings,
  selectListingsLoading,
  selectListingsError,
} from '../../features/listings/listingSlice';
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

const AllListings = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const listings = useAppSelector(selectListings);
  const loading = useAppSelector(selectListingsLoading);
  const error = useAppSelector(selectListingsError);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const handleViewMore = (listingId: string) => {
    console.log('Navigating to general listing details for listingId:', listingId); 
    navigate(`/listings/general/${listingId}`);
  };

  return (
    <div className="all-listings-page">
      <h2>Explore Listings</h2>
      {loading && <p>Loading listings...</p>}
      {error && <p className="error">{error}</p>}

      <div className="listings-grid">
        {listings.map((listing: Listing) => (
          <div key={listing._id} className="listing-card">
            <div className="listing-image">
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                />
              ) : (
                <img src="/placeholder.png" alt="No image available" />
              )}
            </div>
            <div className="listing-content">
              <h3>{listing.title}</h3>
              <p><strong>Price:</strong> ${listing.price}</p>
              <p><strong>Description:</strong> {listing.description
                  ? `${listing.description.slice(0, 200)}...`
                  : listing.description}
              </p>
              <p><strong>Location:</strong> {listing.location}</p>
              <button
                className="view-more-button"
                onClick={() => handleViewMore(listing._id)}
              >
                View More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllListings;