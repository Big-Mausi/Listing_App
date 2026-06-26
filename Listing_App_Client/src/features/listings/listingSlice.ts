import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import axiosInstance from '../../api/axiosInstance';

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  videos: string[];
  modelUrl?: string;
  location: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ListingsState {
  listings: Listing[];
  userListings: Listing[];
  singleListing: Listing | null;
  loading: boolean;
  error?: string;
}


const safeParseArray = (key: string): Listing[] => {
  try {
    const value = localStorage.getItem(key);

    if (!value || value === 'undefined') return [];

    return JSON.parse(value);
  } catch {
    return [];
  }
};


const initialState: ListingsState = {
  listings: safeParseArray('listings'),
  userListings: safeParseArray('userListings'),
  singleListing: null,
  loading: false,
  error: undefined,
};


export const fetchListings = createAsyncThunk<
  Listing[],
  void,
  { rejectValue: string }
>('listings/fetchListings', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/listings');
    return response.data as Listing[];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to fetch listings'
    );
  }
});

export const fetchListingsByUser = createAsyncThunk<
  Listing[],
  string,
  { rejectValue: string }
>('listings/fetchListingsByUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/listings/user/${userId}`);
    return response.data as Listing[];
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to fetch user listings'
    );
  }
});

export const fetchUserListingById = createAsyncThunk<
  Listing,
  { userId: string; listingId: string },
  { rejectValue: string }
>(
  'listings/fetchUserListingById',
  async ({ userId, listingId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/listings/user/${userId}/${listingId}`
      );
      return response.data as Listing;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch listing'
      );
    }
  }
);

export const fetchListingById = createAsyncThunk<
  Listing,
  string,
  { rejectValue: string }
>('listings/fetchListingById', async (listingId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/listings/${listingId}`);
    return response.data as Listing;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to fetch listing'
    );
  }
});

export const createListing = createAsyncThunk<
  Listing,
  {
    title: string;
    description: string;
    price: number;
    location: string;
    images?: string[];
    videos?: string[];
    modelUrl?: string;
  },
  { rejectValue: string }
>('listings/createListing', async (newListing, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      '/listings/create',
      newListing
    );
    return response.data as Listing;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to create listing'
    );
  }
});

export const updateListing = createAsyncThunk<
  Listing,
  {
    id: string;
    updates: Partial<Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'>>;
  },
  { rejectValue: string }
>('listings/updateListing', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/listings/${id}`, updates);
    return response.data as Listing;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to update listing'
    );
  }
});

export const deleteListing = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('listings/deleteListing', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/listings/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to delete listing'
    );
  }
});


const listingSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH ALL */
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
        localStorage.setItem('listings', JSON.stringify(action.payload));
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH USER LISTINGS */
      .addCase(fetchListingsByUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchListingsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userListings = action.payload;
        localStorage.setItem(
          'userListings',
          JSON.stringify(action.payload)
        );
      })
      .addCase(fetchListingsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH USER LISTING BY ID */
      .addCase(fetchUserListingById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUserListingById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleListing = action.payload;

        const index = state.userListings.findIndex(
          (l) => l._id === action.payload._id
        );

        if (index !== -1) state.userListings[index] = action.payload;
        else state.userListings.unshift(action.payload);

        localStorage.setItem(
          'userListings',
          JSON.stringify(state.userListings)
        );
      })
      .addCase(fetchUserListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH SINGLE LISTING */
      .addCase(fetchListingById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleListing = action.payload;

        const index = state.listings.findIndex(
          (l) => l._id === action.payload._id
        );

        if (index !== -1) state.listings[index] = action.payload;
        else state.listings.unshift(action.payload);

        localStorage.setItem('listings', JSON.stringify(state.listings));
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createListing.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.loading = false;
        state.userListings.unshift(action.payload);
        state.listings.unshift(action.payload);

        localStorage.setItem(
          'userListings',
          JSON.stringify(state.userListings)
        );
        localStorage.setItem('listings', JSON.stringify(state.listings));
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateListing.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.loading = false;

        const userIndex = state.userListings.findIndex(
          (l) => l._id === action.payload._id
        );
        if (userIndex !== -1) state.userListings[userIndex] = action.payload;

        const globalIndex = state.listings.findIndex(
          (l) => l._id === action.payload._id
        );
        if (globalIndex !== -1) state.listings[globalIndex] = action.payload;

        if (
          state.singleListing &&
          state.singleListing._id === action.payload._id
        ) {
          state.singleListing = action.payload;
        }

        localStorage.setItem(
          'userListings',
          JSON.stringify(state.userListings)
        );
        localStorage.setItem('listings', JSON.stringify(state.listings));
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteListing.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.loading = false;

        state.userListings = state.userListings.filter(
          (l) => l._id !== action.payload
        );
        state.listings = state.listings.filter(
          (l) => l._id !== action.payload
        );

        if (
          state.singleListing &&
          state.singleListing._id === action.payload
        ) {
          state.singleListing = null;
        }

        localStorage.setItem(
          'userListings',
          JSON.stringify(state.userListings)
        );
        localStorage.setItem('listings', JSON.stringify(state.listings));
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const selectListings = (state: RootState) =>
  state.listings.listings;

export const selectUserListings = (state: RootState) =>
  state.listings.userListings;

export const selectSingleListing = (state: RootState) =>
  state.listings.singleListing;

export const selectListingsLoading = (state: RootState) =>
  state.listings.loading;

export const selectListingsError = (state: RootState) =>
  state.listings.error;

export const { clearError } = listingSlice.actions;
export default listingSlice.reducer;