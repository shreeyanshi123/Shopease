import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-red-600">Payment Failed</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Unfortunately, your payment could not be processed. Please try again or use a different payment method.</p>
        <Button onClick={() => navigate('/shop/checkout')}>Try Again</Button>
      </CardContent>
    </Card>
  );
};

export default PaymentFailurePage;
