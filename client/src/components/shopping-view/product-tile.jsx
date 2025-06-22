import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { brandOptionsMap, categoryOptionsMap } from '@/config'
import { Badge } from '../ui/badge'

const ShoppingProductTile = ({ product, handleAddToCart = () => {}, handleGetProductDetails = () => {} }) => {
    return (
        <Card className="w-full max-w-full bg-white text-black border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 cursor-pointer flex flex-col h-full">
            <div onClick={() => handleGetProductDetails(product?._id)} className="flex-1 flex flex-col">
                <div className='relative flex items-center justify-center h-36 sm:h-40 md:h-48 bg-white'>
                    <img src={product?.image} alt={product?.title} className='h-full w-auto max-w-full object-contain' />
                    {product?.totalStock === 0 ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs px-2 py-1">
                            Out Of Stock
                        </Badge>
                    ) : product?.totalStock < 10 ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs px-2 py-1">
                            {`Only ${product?.totalStock} left`}
                        </Badge>
                    ) : product?.salePrice > 0 ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs px-2 py-1">
                            Sale
                        </Badge>
                    ) : null}
                </div>
                <CardContent className="p-2 flex-1 flex flex-col justify-between">
                    <h2 className='text-sm font-bold mb-1 truncate'>{product?.title}</h2>
                    <div className='flex justify-between items-center mb-1'>
                        <span className='text-xs text-gray-500'>{categoryOptionsMap[product?.category]} </span>
                        <span className='text-xs text-gray-500'>{brandOptionsMap[product?.brand]}</span>
                    </div>
                    <div className='flex justify-between items-center mb-1'>
                        <span className={`${product?.salePrice > 0 ? "line-through" : ""} text-base font-semibold text-gray-800`}>${product?.price}</span>
                        {product?.salePrice > 0 ? (
                            <span className="text-base font-semibold text-green-600">
                                ${product?.salePrice}
                            </span>
                        ) : null}
                    </div>
                </CardContent>
            </div>
            <CardFooter className="p-2 pt-0">
                {product?.totalStock === 0 ? (
                    <Button className="w-full opacity-60 cursor-not-allowed text-xs py-2" disabled>Out of Stock</Button>
                ) : (
                    <Button onClick={() => handleAddToCart(product?._id, product?.totalStock)} className="w-full text-xs py-2">Add to Cart</Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default ShoppingProductTile