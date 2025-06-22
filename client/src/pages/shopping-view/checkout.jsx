import Address from "@/components/shopping-view/address"
import img from "../../assets/account.jpg"
import { useDispatch, useSelector } from "react-redux"
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";


const ShoppingCheckout = () => {
  const { cartItems } = useSelector(state => state.shopCart);
  const { user } = useSelector(state => state.auth);
  const [currentSelectedAddress, setcurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setisPaymentStart] = useState(false);
  const { approvalURL } = useSelector(state => state.shopOrder);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "currentSelectedAddress");
  const totalCartAmount = cartItems && cartItems.length > 0
    ? cartItems.reduce(
      (sum, currentItem) =>
        sum + (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity, 0)
    : 0;

  function handleInitiatePaypalPayment() {

    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: 'destructive'
      })
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "please select one address to proceed",
        variant: 'destructive'
      })
      return;
    }



    const orderData = {
      userId: user?.id,
      cartItems: cartItems.map(singleCartItem => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?.id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: '',
      payerId: '',
    }

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success && data?.payload?.orderId) {
        sessionStorage.setItem('currentOrderId', JSON.stringify(data.payload.orderId));
        setisPaymentStart(true);
      } else {
        setisPaymentStart(false);
      }
    })
  }


  if (approvalURL) {
    window.location.href = approvalURL;
  }


  return (
    <div className='flex flex-col'>
      <div className='relative h-[300px] w-full overflow-hidden'>
        <img src={img} className='h-full w-full object-cover object-center' />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address setcurrentSelectedAddress={setcurrentSelectedAddress} />
        <div className="flex flex-col gap-4">
          {
            cartItems && cartItems.length > 0 ? cartItems.map((item) => (
              <UserCartItemsContent cartItem={item} />
            )) : null
          }

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">Checkout with PayPal</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckout