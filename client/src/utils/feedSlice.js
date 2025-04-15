import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name:"feed",
    initialState:null,
    reducers:{
        // actions
        addFeed:(state,action)=>action.payload,
        removeUserFromFeed:(state,action)=>{
            //user._id which is already present in state.
            //action.payload which is "id" coming from dipatch.
            const newFeed = state.filter((user)=>user._id!==action.payload); //filtering 
            return newFeed; //return new feed where state.userid is not equal to action.payload(id)
        },
    }
});

export const {addFeed,removeUserFromFeed} = feedSlice.actions;

export default feedSlice.reducer;