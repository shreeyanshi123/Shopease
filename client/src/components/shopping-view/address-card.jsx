import React from 'react'
import { Label } from '../ui/label'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'

export const AddressCard = ({ addressInfo,handleDeleteAddress,handleEditAddress,setcurrentSelectedAddress }) => {
  return (
    <Card onClick={setcurrentSelectedAddress?()=>setcurrentSelectedAddress(addressInfo):null}>
      <CardContent className="grid mt-4 gap-4">
        <Label>Address:  {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>pincode:{addressInfo?.pincode}</Label>
        <Label>Phone:{addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="justify-between  flex p-3">
        <Button onClick={()=>handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={()=>handleDeleteAddress(addressInfo)}>Delete</Button>

      </CardFooter>
    </Card>
  )
}