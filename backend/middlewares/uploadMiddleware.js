const multer=require('multer');


// Configure stroage
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{

        cb(null,`${Date.now()}-${file.originalname}`)
    }
});

// File filter to allow only images
const fileFilter=(req,file,cb)=>{
    const allowedTypes=['image/jpeg','image/png','image/jpg','image/gif','image/webp'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error('Only images are allowed'),false);
    }
};

const upload=multer({storage, fileFilter});

module.exports=upload;