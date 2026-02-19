import { createSlice } from '@reduxjs/toolkit';

const listSlice = createSlice({
    name: 'list',
    initialState: {
        myList: JSON.parse(localStorage.getItem('myList') || '[]'),
    },
    reducers: {
        toggleMyList: (state, action) => {
            const show = action.payload;
            const index = state.myList.findIndex(item => item.id === show.id);

            if (index === -1) {
                state.myList.push(show);
            } else {
                state.myList.splice(index, 1);
            }
            localStorage.setItem('myList', JSON.stringify(state.myList));
        },
        removeFromList: (state, action) => {
            state.myList = state.myList.filter(item => item.id !== action.payload);
            localStorage.setItem('myList', JSON.stringify(state.myList));
        }
    },
});

export const { toggleMyList, removeFromList } = listSlice.actions;
export default listSlice.reducer;
