const cloudinary=require("cloudinary").v2;
const multer=require("multer");

cloudinary.config({
    cloud_name:"dqozeueg1",
    api_key:"839471131315843",
    api_secret:"BbntLPqm24Zs2XGUh-ALvb7P0ow",
});

const storage=new multer.memoryStorage();

async function imageUploadUtil(file) {
    const result=await cloudinary.uploader.upload(file,{
        resource_type:"auto",
    });

    return result;
}
const upload=multer({storage});

module.exports={upload,imageUploadUtil};

