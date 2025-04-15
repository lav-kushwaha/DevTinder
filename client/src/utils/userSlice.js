import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:null,
    reducers:{
        //actions
        addUser:(state,action)=>{
            return action.payload; //check redux dev tool kit chrome extension for more understanding about action and payload.
        },
        removeUser:(state,action)=>{
            return null
        }
    }
});

export const {addUser,removeUser} = userSlice.actions;

export default userSlice.reducer;