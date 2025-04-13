import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';


const initialState = {
    toastMessage: null,
    toastType: 'success', // success, error, info, warning
};


const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setToastMessage: (state, action) => {
            state.toastMessage = action.payload.message;
            state.toastType = action.payload.type || 'success';
        },
        clearToastMessage: (state) => {
            state.toastMessage = null;
        },
    },
});


export const { setToastMessage, clearToastMessage } = appSlice.actions;


export default appSlice.reducer;

export const showToast = (message, type = 'success') => (dispatch) => {
    dispatch(setToastMessage({ message, type }));
    toast[type](message);

    setTimeout(() => {
        dispatch(clearToastMessage());
    }, 3000);
};
