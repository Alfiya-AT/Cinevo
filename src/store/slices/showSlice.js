import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getShowsByFilters, getShowDetails, searchShowsByKeyword } from '../../api/showService';

export const fetchShows = createAsyncThunk(
    'shows/fetchShows',
    async (params, { rejectWithValue }) => {
        try {
            return await getShowsByFilters(params);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchShowById = createAsyncThunk(
    'shows/fetchShowById',
    async (id, { rejectWithValue }) => {
        try {
            return await getShowDetails(id);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const showSlice = createSlice({
    name: 'shows',
    initialState: {
        trending: [],
        topRated: [],
        originals: [],
        searchResults: [],
        selectedShow: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedShow: (state) => {
            state.selectedShow = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShows.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchShows.fulfilled, (state, action) => {
                state.loading = false;
                // Logic to categorize shows could go here or in components
            })
            .addCase(fetchShows.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchShowById.fulfilled, (state, action) => {
                state.selectedShow = action.payload;
            });
    },
});

export const { clearSelectedShow } = showSlice.actions;
export default showSlice.reducer;
