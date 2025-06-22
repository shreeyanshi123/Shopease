import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { StarIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useToast } from '../ui/use-toast';
import { setProductDetails } from '@/store/shop/products-slice';

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {
    function handleDialogClose() {
        setOpen(false);
    }
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { toast } = useToast();
    const {cartItems}=useSelector((state)=>state.shopCart);

    function handleAddToCart(getCurrentProductId, getTotalStock) {
        // FIX: Use cartItems as array directly
        let getCartItems = cartItems || [];

        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(
                (item) => item.productId === getCurrentProductId
            );
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > getTotalStock) {
                    toast({
                        title: `Only ${getQuantity} quantity can be added for this item`,
                        variant: "destructive",
                    });

                    return;
                }
            }
        }
            dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then(data => {
                if (data?.payload?.success) {
                    dispatch(fetchCartItems(user?.id));
                    toast({
                        title: "Product is added to cart!",
                    })
                }
            });
        }

        function handleDialogClose() {
            setOpen(false);
            dispatch(setProductDetails());
        }

        // console.log(productDetails, 'productDetails');

        return (
            <Dialog open={open} onOpenChange={handleDialogClose}>
                <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-2xl p-2 sm:p-6 rounded-xl overflow-y-auto max-h-[90vh]">
                    <div className="flex flex-col w-full h-full">
                        {/* Product Image Section */}
                        <div className="flex items-center justify-center w-full bg-white p-2 sm:p-6">
                            <img
                                src={productDetails?.image}
                                alt={productDetails?.title}
                                className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-xl object-cover shadow mb-4"
                            />
                        </div>
                        {/* Product Details Section */}
                        <div className="flex-1 bg-white p-2 sm:p-6">
                            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{productDetails?.title}</h1>
                            <p className="text-base sm:text-xl text-muted-foreground mb-4">{productDetails?.description}</p>
                            <div className="flex items-center justify-between mb-2">
                                <p className={`text-2xl sm:text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? 'line-through' : ''}`}>${productDetails?.price}</p>
                                {productDetails?.salePrice > 0 && (
                                    <p className="text-2xl sm:text-3xl font-bold text-muted-foreground">${productDetails?.salePrice}</p>
                                )}
                            </div>
                            <div className='flex items-center gap-2 mb-4'>
                                <div className='flex items-center gap-0.5'>
                                    <StarIcon className='w-5 h-5 fill-primary' />
                                    <StarIcon className='w-5 h-5 fill-primary' />
                                    <StarIcon className='w-5 h-5 fill-primary' />
                                    <StarIcon className='w-5 h-5 fill-primary' />
                                    <StarIcon className='w-5 h-5 fill-primary' />
                                </div>
                                <span className='text-muted-foreground'>(4.5)</span>
                            </div>
                            <div className="mt-2 mb-4">
                                {productDetails?.totalStock === 0 ? (
                                    <Button className="w-full opacity-60 cursor-not-allowed text-base sm:text-lg py-3">Out of Stock</Button>
                                ) : (
                                    <Button className="w-full text-base sm:text-lg py-3" onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}>Add to Cart</Button>
                                )}
                            </div>
                            <Separator />
                            <div className="max-h-[200px] sm:max-h-[300px] overflow-auto mt-4">
                                <h2 className='text-lg sm:text-xl font-bold mb-4'>Reviews</h2>
                                <div className='grid gap-6'>
                                    <div className="flex gap-4">

                                        <Avatar className="w-10 h-10 border">
                                            <AvatarFallback>SM</AvatarFallback>
                                        </Avatar>

                                        <div className='grid gap-1'>
                                            <div className="flex items-center gap-2" >
                                                <h3>Shree</h3>
                                            </div>
                                            <div className='flex items-center gap-0.5'>
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                            </div>
                                            <p className="text-muted-foreground"> This is an awesome product</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">

                                        <Avatar className="w-10 h-10 border">
                                            <AvatarFallback>SM</AvatarFallback>
                                        </Avatar>

                                        <div className='grid gap-1'>
                                            <div className="flex items-center gap-2" >
                                                <h3>Shree</h3>
                                            </div>
                                            <div className='flex items-center gap-0.5'>
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                            </div>
                                            <p className="text-muted-foreground"> This is an awesome product</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">

                                        <Avatar className="w-10 h-10 border">
                                            <AvatarFallback>SM</AvatarFallback>
                                        </Avatar>

                                        <div className='grid gap-1'>
                                            <div className="flex items-center gap-2" >
                                                <h3>Shree</h3>
                                            </div>
                                            <div className='flex items-center gap-0.5'>
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                            </div>
                                            <p className="text-muted-foreground"> This is an awesome product</p>
                                        </div>
                                    </div>  <div className="flex gap-4">

                                        <Avatar className="w-10 h-10 border">
                                            <AvatarFallback>SM</AvatarFallback>
                                        </Avatar>

                                        <div className='grid gap-1'>
                                            <div className="flex items-center gap-2" >
                                                <h3>Shree</h3>
                                            </div>
                                            <div className='flex items-center gap-0.5'>
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                                <StarIcon className='w-5 h-5 fill-primary' />
                                            </div>
                                            <p className="text-muted-foreground"> This is an awesome product</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-6 flex gap-2'>
                                    <Input placeholder="Write a review...." />
                                    <Button>Submit</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    export default ProductDetailsDialog;
