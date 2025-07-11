import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null,
}

export const addNewProduct = createAsyncThunk(
    "/products/addnewproduct",
    async (formData) => {
        const result = await axios.post(
            "https://shopease-q3li.onrender.com/api/admin/products/add",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        return result?.data;
    }

)



export const fetchAllProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async () => {
        const result = await axios.get(
            "https://shopease-q3li.onrender.com/api/admin/products/get",
        )
        return result?.data;
    }

)



export const editProduct = createAsyncThunk(
    "/products/editProduct",
    async ({ id, formData }) => {
        const result = await axios.put(
            `https://shopease-q3li.onrender.com/api/admin/products/edit/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        return result?.data;
    }

);



export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",
    async (id) => {
        const result = await axios.delete(
            `https://shopease-q3li.onrender.com/api/admin/products/delete/${id}`
        )
        return result?.data;
    }

)

const AdminProductSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                console.log(action.payload);
                state.isLoading = false,
                state.productList = action.payload.data;
            }).addCase(fetchAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.productList = [];
            })
    }
})


export default AdminProductSlice.reducer;