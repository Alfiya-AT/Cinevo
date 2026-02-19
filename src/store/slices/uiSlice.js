import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isDetailModalOpen: false,
        selectedShowId: null,
    },
    reducers: {
        openDetailModal: (state, action) => {
            state.isDetailModalOpen = true;
            state.selectedShowId = action.payload;
        },
        closeDetailModal: (state) => {
            state.isDetailModalOpen = false;
            state.selectedShowId = null;
        },
    },
});

export const { openDetailModal, closeDetailModal } = uiSlice.actions;
export default uiSlice.reducer;
