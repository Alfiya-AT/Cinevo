import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signupUser, loginUser, getMe, logoutUser } from '../../api/authApi';

export const signup = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
    try {
        const { data } = await signupUser(userData);
        localStorage.setItem('cinevo_token', data.token);
        return data.user;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const { data } = await loginUser(userData);
        localStorage.setItem('cinevo_token', data.token);
        return data.user;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
});

export const fetchCurrentUser = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
    try {
        const { data } = await getMe();
        return data.user;
    } catch (err) {
        localStorage.removeItem('cinevo_token');
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Session expired');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: !!localStorage.getItem('cinevo_token')
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('cinevo_token');
            logoutUser().catch(() => { }); // Optional: call logout on server
        }
    },
    extraReducers: (builder) => {
        builder
            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch User
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
