import { Input } from "../ui/input";
import { useEffect, useRef } from 'react'
import { Label } from '../ui/label'
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";



export const ProductImageUpload = ({ imageFile, setImageFile, uploadedImageUrl, setUploadedImageUrl, setImageLoadingState, isLoadingState ,isEditMode}) => {

    const inputRef = useRef(null);
    function handleImageFileChange(event) {
        console.log(event.target.files);
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setImageFile(selectedFile);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
            setImageFile(droppedFile);
        }
    }

    function handleRemoveImage() {
        setImageFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    async function uploadImageToCloudinary() {
        setImageLoadingState(true);
        const data = new FormData();
        data.append('my_file', imageFile);
        const response = await axios.post('https://shopease-q3li.onrender.com/api/admin/products/upload-image', data);

        console.log(response, "response");

        if (response?.data?.success) {
            setUploadedImageUrl(response.data.result.url);
            setImageLoadingState(false);
        }
    }

    console.log(uploadedImageUrl, "uploadedImageUrl");


    useEffect(() => {
        if (imageFile !== null) uploadImageToCloudinary();
    }, [imageFile]);



    return (
        <div className="w-full max-w-md mx-auto mt-4">
            <Label className="text-lg font-semibold  mb-2 block" >Upload Image</Label>
            <div onDragOver={handleDragOver} onDrop={handleDrop} className={`${isEditMode?"opacity-60":""}border-2 border-dashed rounded-lg p-4`}>
                <Input id="image-upload" type="file" className="hidden" ref={inputRef} onChange={handleImageFileChange} disabled={isEditMode} />


                {

                    !imageFile ?
                        <Label htmlFor="image-upload" className={`${isEditMode?"cursor-not-allowed":""} flex flex-col items-center justify-center h-32 cursor-pointer`}>
                            <UploadCloudIcon className="w-10 h-10 text-muted foregorund mb-2" />
                            <span>drag & Drop or click to upload Image</span>
                        </Label>
                        :
                        isLoadingState ? (
                            <Skeleton className='h-10 bg-gray-100' />
                        )
                            : (

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FileIcon className="w-8 text-primary mr-2 h-8" />
                                    </div>
                                    <p className="text-sm font-medium">
                                        {imageFile.name}
                                    </p>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleRemoveImage}>
                                        <XIcon />
                                        <span className="sr-only">Remove File</span>
                                    </Button>
                                </div>

                            )}
            </div>
        </div>
    )
}
