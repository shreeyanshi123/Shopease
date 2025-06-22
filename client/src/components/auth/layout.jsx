import React from 'react'
import { Outlet } from "react-router-dom";
import accountImg from '@/assets/account2.jpg';

const AuthLayout = () => {
    return (
        <div className="flex min-h-screen w-full">
            <div className="hidden lg:flex items-center justify-center bg-black w-1/2 p-0 overflow-hidden">
                <img src={accountImg} alt="Ecommerce" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout