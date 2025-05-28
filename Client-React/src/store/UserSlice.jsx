import {createSlice} from '@reduxjs/toolkit';
const initialState = {
   userName: localStorage.getItem('name')||null
  };
  const userSlice=createSlice({
    name:'User',
    initialState,
    reducers:{  
        setUserName:(state,action)=>{
            state.userName=action.payload;
        },
        logout:(state)=>{
            state.userName=null;
        }
    }
  });
  export const { setUserName, logout } = userSlice.actions;
  export default userSlice.reducer;
