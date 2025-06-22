import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice';
import adminProductsSlice from './admin/products-slice';
import shopProductsSlice from "./shop/products-slice/index"
import shopCartSlice from "./shop/cart-slice/index"
import shopAddressSlice from "./shop/address-slice/index"
import shopOrderSlice from "./shop/order-slice/index";
import adminOrderSlice from './admin/order-slice/index';
import shopSearchSlice from './shop/search-slice';



const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts:adminProductsSlice,
    adminOrder:adminOrderSlice,
    shopProducts:shopProductsSlice,
    shopCart:shopCartSlice,
    shopAddress:shopAddressSlice,
    shopOrder:shopOrderSlice,
    shopSearch: shopSearchSlice,
  },
});


export default store;