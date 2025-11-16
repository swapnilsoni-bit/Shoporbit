import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types';
import { clientFakeStoreAPI } from '@/lib/api/client-api';
import type { AppDispatch } from '../store';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  isGuest: boolean;
}

// Load user from localStorage on initialization
const loadAuthFromStorage = (): Partial<AuthState> => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return {
          user: userData,
          isAuthenticated: true,
          isGuest: false,
        };
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
  }
  return {};
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  isGuest: true,
  ...loadAuthFromStorage(),
};

// Async thunk for login
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await clientFakeStoreAPI.login(username, password);
      if (data.token) {
        const userData: User = {
          username: username,
          token: data.token,
          email: `${username}@fakestoreapi.com`,
          loginTime: new Date().toISOString(),
        };
        return userData;
      } else {
        throw new Error('No token received');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed. Try: mor_2314 / 83r5^_');
    }
  }
);

// Async thunk for register
export const registerAsync = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const userData: User = {
        name: name,
        email: email,
        token: 'demo-token-' + Date.now(),
        loginTime: new Date().toISOString(),
      };
      return userData;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.error = null;
      state.loading = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
        if (action.payload.token) {
          localStorage.setItem('authToken', action.payload.token);
        }
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.isGuest = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isGuest = true;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    },
    setGuest: (state, action: PayloadAction<boolean>) => {
      state.isGuest = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login async thunk handlers
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isGuest = false;
        state.error = null;
        state.loading = false;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload));
          if (action.payload.token) {
            localStorage.setItem('authToken', action.payload.token);
          }
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.isGuest = true;
        state.loading = false;
      })
      // Register async thunk handlers
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isGuest = false;
        state.error = null;
        state.loading = false;
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(action.payload));
          if (action.payload.token) {
            localStorage.setItem('authToken', action.payload.token);
          }
        }
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isGuest = true;
        state.loading = false;
      });
  },
});

export const { setLoading, setError, loginSuccess, loginFailure, logout, setGuest } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;

