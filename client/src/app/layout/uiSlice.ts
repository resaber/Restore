import { createSlice } from "@reduxjs/toolkit";

export  const uiSlice  = createSlice({
    name:'ui',
    initialState : {
        isLoading : false
    },
    //實際的action
    reducers : {
        startLoading : (state) => {
            state.isLoading = true
        },
        stopLoading : (state) => {
            state.isLoading = false
        }
    }
});
//導出action 
export const {startLoading,stopLoading} = uiSlice.actions;