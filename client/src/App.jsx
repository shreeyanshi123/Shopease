import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin-view/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import { AdminProducts } from './pages/admin-view/products'
import AdminOrder from './pages/admin-view/orders'
import AdminFeatures from './pages/admin-view/features'
import ShoppingLayout from './components/shopping-view/layout'
import NotFound from './pages/not-found'
import ShoppingHome from './pages/shopping-view/home'
import ShoppingListing from './pages/shopping-view/listing'
import ShoppingCheckout from './pages/shopping-view/checkout'
import ShoppingAccount from './pages/shopping-view/account'
import CheckAuth from './components/common/check-auth'
import UnauthPage from './pages/unauth-page'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/auth-slice'
import { useEffect } from 'react'
import { Skeleton } from './components/ui/skeleton'
import PaypalReturnPage from './pages/shopping-view/paypal-return'
import PaymentSuccessPage from './pages/shopping-view/payment-success'
import PaymentFailurePage from './pages/shopping-view/payment-failure'
import SearchProducts from './pages/shopping-view/search'
import AdminsPage from './pages/admin-view/admins'

function App() {

  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
  return <Skeleton className="w-screen h-screen bg-white rounded-none m-0" />
}
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-zinc-900 to-white text-white font-sans flex flex-col overflow-x-hidden">
      <Routes>
       <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path='/auth' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>} >
          <Route path='login' element={<AuthLogin />} />
          <Route path='register' element={<AuthRegister />} />
        </Route>

        <Route path='/admin' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>}
        >
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='products' element={<AdminProducts />} />
          <Route path='orders' element={<AdminOrder />} />
          <Route path='features' element={<AdminFeatures />} />
          <Route path='admins' element={<AdminsPage />} />

        </Route>

        <Route path='/shop' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path='home' element={<ShoppingHome />} />
          <Route path='listing' element={<ShoppingListing />} />
          <Route path='account' element={<ShoppingAccount />} />
          <Route path='checkout' element={<ShoppingCheckout />} />
          <Route path='paypal-return' element={<PaypalReturnPage />} />
          <Route path='payment-success' element={<PaymentSuccessPage />} />
          <Route path='payment-failure' element={<PaymentFailurePage />} />
          <Route path="search" element={<SearchProducts />} />

        </Route>

        <Route path='*' element={<NotFound />} />
        <Route path='/unauth-page' element={<UnauthPage />} />
      </Routes>

    </div>
  )
}

export default App
