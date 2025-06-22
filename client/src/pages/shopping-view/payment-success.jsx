import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-green-600">Payment Successful!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Thank you for your purchase. Your payment was successful and your order is being processed.</p>
        <Button onClick={() => navigate('/shop/home')}>Continue Shopping</Button>
      </CardContent>
    </Card>
  );
};

export default PaymentSuccessPage;