import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    isLoading: false,
}

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, quantity }) => {
        const resp = await axios.post("http://localhost:8000/api/shop/cart/add", {
            userId,
            productId,
            quantity
        });
        return resp.data;
    }
)


export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (userId) => {
        const res = await axios.get(`http://localhost:8000/api/shop/cart/get/${userId}`);
        return res.data;
    }
)


export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async ({userId,productId}) => {
        const res = await axios.delete(`http://localhost:8000/api/shop/cart/${userId}/${productId}`);
        return res.data;
    }
)

export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ userId, productId, quantity }) => {
        const res = await axios.put("http://localhost:8000/api/shop/cart/update-cart", {
            userId,
            productId,
            quantity,
        });
        return res.data;
    }
)

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            }).addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data.items;
            }).addCase(addToCart.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            }).addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            }).addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data.items;
            }).addCase(fetchCartItems.rejected, (state) => {
                state.isLoading = true;
                state.cartItems = [];
            }).addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true;
            }).addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data.items;
            }).addCase(updateCartQuantity.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            }).addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            }).addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data.items;
            }).addCase(deleteCartItem.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
    }
})


export default shoppingCartSlice.reducer;