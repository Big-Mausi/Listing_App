import axiosInstance from './axiosInstance';

interface ListingPayload {
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  videos: string[];
}

export const getAllListings = async () => {
  const response = await axiosInstance.get('/listings/get');
  return response.data;
};

export const getListingsByUser = async (userId: string) => {
  const response = await axiosInstance.get(`/listings/user/${userId}`);
  return response.data;
};

export const getUserListingById = async (userId: string, listingId: string) => {
  const response = await axiosInstance.get(`/listings/user/${userId}/${listingId}`);
  return response.data;
};

export const getListingById = async (listingId: string) => {
    const response = await axiosInstance.get(`/listings/${listingId}`);
    return response.data;
};

export const createListing = async (data: ListingPayload) => {
  const response = await axiosInstance.post('/listings/create', data);
  return response.data.listing; 
};

export const updateListing = async (id: string, data: Partial<ListingPayload>) => {
  const response = await axiosInstance.put(`/listings/update/${id}`, data);
  return response.data.listing; 
};

export const deleteListing = async (id: string) => {
  const response = await axiosInstance.delete(`/listings/delete/${id}`);
  return response.data; 
};