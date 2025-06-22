import { ProductImageUpload } from '@/components/admin-view/image-upload';
import AdminProductTile from '@/components/admin-view/product-tile';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import { addProductFormElements } from '@/config'

import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from '@/store/admin/products-slice';
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


const initialFormData = {
  image: null, title: "", description: "", category: "", brand: "", price: "", salesPrice: "", totalStock: "", averageReview: 0,
}




export const AdminProducts = () => {
  const [openCreateProductsDialog, setopenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);


  const { productList } = useSelector(state => state.adminProducts)
  const dispatch = useDispatch();

  const { toast } = useToast();


  function onSubmit(e) {
    e.preventDefault();
    currentEditedId !== null ?
      dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        console.log(data, "edit");
        if (data?.payload?.success) {
          dispatch(fetchAllProducts);
          setFormData(initialFormData);
          setopenCreateProductsDialog(false);
          setCurrentEditedId(null);
        }

      })
      :
      dispatch(addNewProduct({ ...formData, image: uploadedImageUrl })).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setopenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast({
            title: "Product Added Successfully!",
          })
        }
      });
  }

  function handleDelete(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData).map((key) => formData[key] !== "").every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch])

  console.log(formData, "formData");

  return (
    <Fragment>
      <div className='mb-5 w-full flex justify-end'>
        <Button onClick={() => setopenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {productList && productList.length > 0 ?

          productList.map((product) => (
            <AdminProductTile product={product} setFormData={setFormData} setopenCreateProductsDialog={setopenCreateProductsDialog} setCurrentEditedId={setCurrentEditedId} handleDelete={handleDelete} />
          ))
          : null
        }
      </div>
      <Sheet open={openCreateProductsDialog} onOpenChange={() => {
        setopenCreateProductsDialog(false);
        setCurrentEditedId(null);
        setFormData(initialFormData);
      }}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {
                currentEditedId !== null ? "Edit Product" : "Add New Product"
              }
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} setImageLoadingState={setImageLoadingState} isLoadingState={isLoadingState} isEditMode={currentEditedId !== null} />
          <div className='py-6'>
            <CommonForm formControls={addProductFormElements} formData={formData} setFormData={setFormData} buttonText={currentEditedId !== null ? "Edit" : "Add"} onSubmit={onSubmit} />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  )
}
