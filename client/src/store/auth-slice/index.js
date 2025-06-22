import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { act } from 'react';

const initialState = {
  isAuthenticated: false,
  isLoading:true,
  user: null,
}

export const registerUser=createAsyncThunk(
  "/auth/register",
  async(formData)=>{
    const response=await axios.post(
      "https://shopease-q3li.onrender.com/api/auth/register",
      formData,
      {
        withCredentials:true,
      }
    );
    return response.data;
  }
)


export const loginUser=createAsyncThunk(
  "/auth/login",
  async(formData)=>{
    const response=await axios.post(
      "https://shopease-q3li.onrender.com/api/auth/login",
      formData,
      {
        withCredentials:true,
      }
    );
    return response.data;
  }
)


export const logoutUser=createAsyncThunk(
  "/auth/logout",async()=>{
    const response=await axios.post("https://shopease-q3li.onrender.com/api/auth/logout",{},{
      withCredentials:true,
    });
    return response.data;
  }
)


export const checkAuth=createAsyncThunk("/auth/checkauth",
  async()=>{
    const response=await axios.get("https://shopease-q3li.onrender.com/api/auth/check-auth",{
      withCredentials:true,
      headers:{
        "Cache-Control":"no-store,no-cache,must-revalidate,proxy-revalidate",
      }
    });
    return response.data;
  }
)

const authSlice=createSlice({
  name:'auth',
  initialState,
  reducers:{
    setUser:(state,action)=>{}
  },
  extraReducers:(builder)=>{
    builder.addCase(registerUser.pending,(state)=>{
      state.isLoading=true;
    }).addCase(registerUser.fulfilled,(state,action)=>{
      state.isLoading=false;
      state.user=null;
      state.isAuthenticated=false;
    }).addCase(registerUser.rejected,(state,action)=>{
      state.isLoading=false;
      state.user=null;
      state.isAuthenticated=false;
    }).addCase(loginUser.pending,(state)=>{
      state.isLoading=true;
    }).addCase(loginUser.rejected,(state,action)=>{
      state.isAuthenticated=false;
      state.isLoading=false;
      state.user=null;
    }).addCase(loginUser.fulfilled,(state,action)=>{
      console.log(action);
      state.isAuthenticated=!action.payload.success?false:true;
      state.isLoading=false;
      state.user=action.payload.success && action.payload.user
        ? { ...action.payload.user, id: action.payload.user._id }
        : null;
    }).addCase(checkAuth.pending,(state)=>{
      state.isLoading=true;
    }).addCase(checkAuth.fulfilled,(state,action)=>{
      state.isLoading=false;
      state.isAuthenticated=action.payload.success;
      state.user=action.payload.success && action.payload.user
        ? { ...action.payload.user, id: action.payload.user._id }
        : null;
    }).addCase(checkAuth.rejected,(state,action)=>{
      state.isLoading=false;
      state.user=null;
      state.isAuthenticated=false;
    }).addCase(logoutUser.fulfilled,(state,action)=>{
      state.isLoading=false;
      state.user=null;
      state.isAuthenticated=false;
    });
  },
});

export const {setUser}=authSlice.actions;
export default authSlice.reducer;