import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { capturePayment } from '@/store/shop/order-slice';
import { fetchCartItems } from '@/store/shop/cart-slice/index.js';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const PaypalReturnPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');

    useEffect(() => {
        if (paymentId && payerId) {
            const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
            dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
                if (data?.payload?.success) {
                    sessionStorage.removeItem('currentOrderId');
                    // Fetch updated cart to empty it in Redux
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user?.id) {
                        dispatch(fetchCartItems(user.id));
                    }
                    navigate('/shop/payment-success');
                } else {
                    setError('Payment failed. Please try again.');
                    navigate('/shop/payment-failure');
                }
            });
        } else if (location.search) {
            setError('Payment was cancelled or failed.');
            navigate('/shop/payment-failure');
        }
    }, [paymentId, payerId, dispatch, navigate, location.search]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{error ? 'Payment Error' : 'Processing Payment...Please wait!'}</CardTitle>
            </CardHeader>
            <CardContent>
                {error && <div className="text-red-600">{error}</div>}
            </CardContent>
        </Card>
    );
};

export default PaypalReturnPage;