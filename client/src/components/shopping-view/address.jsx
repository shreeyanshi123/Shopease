import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form'
import { addressFormControls } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from '@/store/shop/address-slice'
import { AddressCard } from './address-card'
import { toast, useToast } from '../ui/use-toast'


const initialAddressFormData = {
    address: '',
    city: '',
    phone: '',
    pincode: '',
    notes: ''
}




const Address = ({setcurrentSelectedAddress}) => {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { addressList } = useSelector((state) => state.shopAddress);
    const { toast } = useToast();




    function handleManageAddress(e) {
        e.preventDefault();

        if (addressList.length >= 3 && currentEditedId === null) {
            setFormData(initialAddressFormData);
            toast({
              title: "You can add max 3 addresses",
              variant: "destructive",
            });
      
            return;
          }
        currentEditedId !== null ? dispatch(editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
        })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
                setCurrentEditedId(null);
                setFormData(initialAddressFormData);

                toast({
                    title: "Address updated successfully",
                })
            }
        }) :

            dispatch(addNewAddress({
                ...formData,
                userId: user?.id
            })).then(data => {
                console.log(data);
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id))
                    setFormData(initialAddressFormData)
                }
            })
    }

    function isFormValid() {
        return Object.keys(formData).map(key => formData[key] !== "").every(item => item)
    }

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchAllAddresses(user.id));
        }
    }, [dispatch, user?.id]);

    function handleDeleteAddress(getCurrentAddress) {
        dispatch(
            deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
                toast({
                    title: "Address deleted successfully",
                })
            }
        });
    }

    function handleEditAddress(getCurrentAddress) {
        setCurrentEditedId(getCurrentAddress?._id);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes,
        })
    }

    return (
        <Card>
            <div className='mb-5  p-3 grid grid-cols-1 sm:grid-cols-3 gap-2'>
                {
                    addressList && addressList.length > 0 ? addressList.map(singleAddressItem => <AddressCard addressInfo={singleAddressItem} handleDeleteAddress={handleDeleteAddress} handleEditAddress={handleEditAddress}  setcurrentSelectedAddress={setcurrentSelectedAddress}/>) : null
                }
            </div>
            <CardHeader>
                <CardTitle>
                    {currentEditedId !== null ? "Edit Address" : "Add New Address"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CommonForm formControls={addressFormControls} formData={formData} setFormData={setFormData} buttonText={'Add'} onSubmit={handleManageAddress} handleDeleteAddress={handleDeleteAddress}
                    isBtnDisabled={!isFormValid()}
                />
            </CardContent>
        </Card>
    )
}

export default Address;