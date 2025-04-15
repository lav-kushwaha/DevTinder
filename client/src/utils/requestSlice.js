import {createSlice} from "@reduxjs/toolkit"

const RequestSlice = createSlice({
    name:"requests",
    initialState:null,
    reducers:{
        addRequests:(state,action)=>{
            return action.payload;
        },
        removeRequest:(state,action)=>{
            const newArray = state.filter((r)=>r._id !== action.payload)
            return newArray;
        }
    }
});

export const {addRequests,removeRequest} = RequestSlice.actions;
export default RequestSlice.reducer;