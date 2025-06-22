import ProductFilter from '@/components/shopping-view/filter'
import ProductDetailsDialog from '@/components/shopping-view/product-details'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { sortOptions } from '@/config'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice'
import { ArrowUpDownIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'


function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(',');

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  console.log(queryParams, "queryParams")
  return queryParams.join('&')
}


const ShoppingListing = () => {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector((state) => state.shopProducts)
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setsort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { toast } = useToast();
  const categorySearchParam = searchParams.get("category");
  const { cartItems } = useSelector((state) => state.shopCart);
  function handleSort(value) {
    setsort(value);
  }

  console.log(productDetails, "productDetails");




  function handleFilter(getSectionId, getCurrentOption) {
    console.log(getSectionId, getCurrentOption);

    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption]
      }
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    // console.log(cpyFilters);
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters))
  }

  useEffect(() => {
    setsort('price-lowtohigh');
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {})
  }, [categorySearchParam])

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);


  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);


  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId, "id");

    dispatch(fetchProductDetails(getCurrentProductId));
  }

  // console.log(productDetails, "productDetails") ;

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);


  function handleAddtoCart(getCurrentProductId, getTotalStock) {
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



  return (
    <div className="w-full min-h-screen bg-[#f1f2f4] flex justify-center">
      <div className="flex w-full max-w-[1400px]">
        {/* Sidebar filter for desktop */}
        <aside className="hidden md:block w-[260px] bg-white border-r border-gray-200 p-3 sticky top-0 h-screen overflow-y-auto">
          <ProductFilter filters={filters} handleFilters={handleFilter} />
        </aside>
        {/* Mobile filter drawer */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden fixed z-30 left-4 top-20 bg-black text-white px-3 py-2 rounded shadow" onClick={() => setFilterOpen(true)}>Filters</button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80vw] max-w-xs p-0">
            <ProductFilter filters={filters} handleFilters={handleFilter} />
          </SheetContent>
        </Sheet>
        {/* Main content */}
        <main className="flex-1 px-1 sm:px-6 py-4 w-full">
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-black'>All Products</h2>
            <div className='flex items-center gap-3'>
              <span className='text-black'>{productList.length}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 border-black text-black bg-white hover:bg-black hover:text-white transition-colors duration-150">
                    <ArrowUpDownIcon className='h-4 w-4' />
                    <span>Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-[200px] bg-white text-black border border-black'>
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort} >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id} className="hover:bg-black hover:text-white">{sortItem.label}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {
              productList && productList.length > 0 ? productList.map(productItem => <ShoppingProductTile product={productItem} handleGetProductDetails={handleGetProductDetails} handleAddToCart={handleAddtoCart} key={productItem.id} />) : (
                <div className="col-span-full text-center text-black text-lg font-semibold py-8">No products found.</div>
              )
            }
          </div>
          <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </main>
      </div>
    </div>
  )
}

export default ShoppingListing