import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchListingsByUser,
  selectUserListings,
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

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem('user') || '{}');
  const listings = useAppSelector(selectUserListings);
  const loading = useAppSelector(selectListingsLoading);
  const error = useAppSelector(selectListingsError);


  useEffect(() => {
    console.log('User:', user); 
    if(user.id) {
      dispatch(fetchListingsByUser(user.id));
      console.log('Dispatching fetchListingsByUser for userId:', user.id);
    } else {
      console.error('No user ID found');
    }
  }, [dispatch, user.id]);


  useEffect(() => {
    console.log('Listings:', listings);
    console.log('Loading:', loading); 
    console.log('Error:', error); 
  }, [listings, loading, error]);

  const handleViewMore = (listingId: string) => {
    navigate(`/listings/user/${user.id}/${listingId}`);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h2>Welcome, {user.name || 'User'}</h2>
        <p>Email: {user.email || 'N/A'}</p>

        <hr className="divider" />

        <h3>Your Listings</h3>

        {loading && <p>Loading listings...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && listings.length === 0 && (
          <p>You do not have any listings yet. Create one!</p>
        )}

        {!loading && listings.length > 0 && (
          <div className="listings-grid">
            {listings.map((listing: Listing) => (
              <div key={listing._id} className="listing-card">
                <div className="listing-image">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.png';
                      }}
                    />
                  ) : (
                    <img src="/placeholder.png" alt="No image available" />
                  )}
                </div>
                <div className="listing-content">
                  <h3>{listing.title}</h3>
                  <p><strong>Price:</strong> ${listing.price}</p>
                  <p><strong>Description:</strong> {listing.description}</p>
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;