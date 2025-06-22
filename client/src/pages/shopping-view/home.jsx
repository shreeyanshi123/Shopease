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
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-zinc-900 to-white text-white">
      {/* Full-width Banner Carousel with reduced top margin */}
      <div className="w-full relative mt-2 aspect-[16/5] overflow-hidden shadow-lg">
        <img src={slides[currentSlide]} alt="Banner" className="w-full h-full object-cover transition-all duration-500" />
        <button onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 rounded-full p-2 text-white hover:bg-white hover:text-black transition z-10">
          <ChevronLeftIcon size={28} />
        </button>
        <button onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 rounded-full p-2 text-white hover:bg-white hover:text-black transition z-10">
          <ChevronRightIcon size={28} />
        </button>
      </div>
      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8 flex flex-col items-center">
        {/* Categories */}
        <div className="w-full mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categoriesWithIcon.map((cat) => (
            <button key={cat.id} onClick={() => handleNavigateToListingPage(cat, 'category')} className="flex flex-col items-center bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 shadow text-white transition-all">
              <cat.icon size={32} />
              <span className="mt-2 text-xs sm:text-sm font-semibold">{cat.label}</span>
            </button>
          ))}
        </div>
        {/* Brands */}
        <div className="w-full mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {brandsWithIcon.map((brand) => (
            <button key={brand.id} onClick={() => handleNavigateToListingPage(brand, 'brand')} className="flex flex-col items-center bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 shadow text-white transition-all">
              <brand.icon size={32} />
              <span className="mt-2 text-xs sm:text-sm font-semibold">{brand.label}</span>
            </button>
          ))}
        </div>
        {/* Product Grid - 2 columns on small screens */}
        <div className="w-full mt-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList && productList.map((product) => (
            <ShoppingProductTile
              key={product}
              product={product}
              onAddToCart={handleAddToCart}
              onShowDetails={handleGetProductDetails}
            />
          ))}
        </div>
        {/* Product Details Dialog */}
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} />
      </div>
      {/* Enhanced Footer */}
      <footer className="w-full py-6 bg-zinc-900 text-zinc-300 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-xs">
            <a href="/shop/home" className="hover:underline">Home</a>
            <a href="/shop/listing" className="hover:underline">Shop</a>
            <a href="/shop/account" className="hover:underline">Account</a>
            <a href="mailto:support@shopease.com" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="hover:text-white"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg></a>
            <a href="#" aria-label="Twitter" className="hover:text-white"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 12 8.29c0 .34.04.67.1.99A12.13 12.13 0 0 1 3.1 4.86a4.28 4.28 0 0 0 1.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.19c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.72 8.72 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z"/></svg></a>
            <a href="#" aria-label="Facebook" className="hover:text-white"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>
          </div>
          <div className="text-xs text-zinc-400 mt-2 md:mt-0">support@shopease.com</div>
        </div>
        <div className="text-center text-xs text-zinc-500 mt-4">© {new Date().getFullYear()} ShopEase. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default ShoppingHome