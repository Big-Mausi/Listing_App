import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const getUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem('user');

    if (!storedUser || storedUser === 'undefined') return null;

    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const getTokenFromStorage = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined') return null;
  return token;
};


const initialState: AuthState = {
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  loading: false,
  error: null,
};


export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
      });

      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to register'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to login');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
  },

  extraReducers: (builder) => {
    builder
      /* REGISTER */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Something went wrong';
      })

      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Something went wrong';
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;