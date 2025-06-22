import { Button } from '@/components/ui/button'
import banner1 from '../../assets/banner-1.webp'
import banner2 from '../../assets/banner-2.jpg'
import banner3 from '../../assets/banner-3.jpg'
import banner4 from '../../assets/banner-4.jpg'
import { Airplay, BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice'
import { useDispatch, useSelector } from 'react-redux'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import ProductDetailsDialog from '@/components/shopping-view/product-details'
import { io } from 'socket.io-client'


const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];


const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];


const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  )
  const dispatch = useDispatch();
  const slides = [banner1, banner2, banner3, banner4];
  const { user } = useSelector((state) => state.auth);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId, "id");

    dispatch(fetchProductDetails(getCurrentProductId));
  }


  // console.log(productDetails, "productDetails") ;

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);


  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }



  function handleAddToCart(getCurrentProductId) {
    // console.log(getCurrentProductId,"id");
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then(data => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart!",
        })
      }
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)
    }, 8000)

    return () => clearInterval(timer)
  }, [])


  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);


  useEffect(() => {
    // Connect as a shopper to Socket.io (correct query param usage)
    const socket = io('http://localhost:8000?role=shopper', { withCredentials: true });
    socket.on('newProduct', (product) => {
      // Send notification event to header
      window.dispatchEvent(new CustomEvent('notify', {
        detail: {
          type: 'notification',
          payload: {
            title: 'New Product Added!',
            description: `${product.title} (${product.category}, ${product.brand}) is now available. Check it out!`,
          }
        }
      }));
    });
    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <div className='flex flex-col min-h-screen'>
      <div className='relative w-full h-[600px] overflow-hidden'>
        {
          slides.map((slide, index) => (
            <img src={slide} key={index} className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'}  absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`} />
          ))
        }


        <Button variant="outline" size="icon" className="absolute top-1/2 left-4 transform-translate-y-1/2 bg-white" onClick={() => setCurrentSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length)}>
          <ChevronLeftIcon className='w-4 h-4' />
        </Button>
        <Button variant="outline" size="icon" className="absolute top-1/2 right-4 transform-translate-y-1/2 bg-white" onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length)}>
          <ChevronRightIcon className='w-4 h-4' />
        </Button>
      </div>
      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>
            Shop by Category
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {categoriesWithIcon.map((categoryItem) => (
              <Card className="cursor-pointer hover:shadow-lg translate-shadow" onClick={() =>
                handleNavigateToListingPage(categoryItem, "category")
              }>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className='font-bold'>{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>
            Shop by Brand
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {brandsWithIcon.map((brandItem) => (
              <Card className="cursor-pointer hover:shadow-lg translate-shadow" onClick={() => handleNavigateToListingPage(brandItem, 'brand')} >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className='font-bold'>{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>
            Feature Products
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {
              productList && productList.length > 0 ? productList.map((productItem) => (
                <ShoppingProductTile handleAddToCart={handleAddToCart} product={productItem} handleGetProductDetails={handleGetProductDetails} />
              )) : null
            }
          </div>
        </div>
      </section>


      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

    </div>
  )
}

export default ShoppingHome