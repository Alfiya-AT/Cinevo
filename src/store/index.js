import { configureStore } from '@reduxjs/toolkit';
import showReducer from './slices/showSlice';
import uiReducer from './slices/uiSlice';
import listReducer from './slices/listSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        shows: showReducer,
        ui: uiReducer,
        list: listReducer,
        auth: authReducer,
    },
});

export default store;
