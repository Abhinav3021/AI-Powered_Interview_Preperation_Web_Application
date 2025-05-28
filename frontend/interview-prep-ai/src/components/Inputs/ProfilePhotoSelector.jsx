import React from 'react'
import {LuUser,LuUpload,LuTrash} from 'react-icons/lu'
import { useState } from 'react'

const ProfilePhotoSelector = ({image,setImage}) => {
    const inputRef=React.useRef(null);
    const [previewUrl,setPreviewUrl]=useState(null);
    const [preview,setPreview]=useState(null);
    

    const handleImageChange=(event)=>{
        const file=event.target.files[0];
        if(file){
            //Upload the image state
            setImage(file);
            //Create a preview URL from the file
            const preview=URL.createObjectURL(file);
            if(setPreview){
                setPreview(preview);
            }
            setPreviewUrl(preview)
        }
    }

    const handleRemoveImage=()=>{
        setImage(null);
        setPreviewUrl(null);
        
        if(setPreview){
            setPreview(null);
        }
    }
    const onChooseFile=()=>{
        inputRef.current.click();
    }
        
  return (
    <div className="flex justify-center mb-6">
        <input 
        type="file"
        accept='image/*'
        className='hidden'
        onChange={handleImageChange}
        ref={inputRef}
        />

        {!image ? (
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-50 relative cursor-pointer">
                <LuUser className='text-4xl text-orange-500'/>

                <button
                type='button'
                className='w-8 h-8 flex items-center justify-center rounded-full bg-linear-to-r from-orange-500/85 to-orange-600 text-white absolute bottom-1 right-1 cursor-pointer'
                onClick={onChooseFile}>
                    <LuUpload/>
                </button>
            </div>
        ):(
            <div className="relative">
                <img
                src={preview || previewUrl}
                alt="Profile photo"
                className='w-20 h-20 rounded-full object-cover'
                />
                <button
                type='button'
                className='w-8 h-8 flex items-center justify-center rounded-full bg-linear-to-r from-orange-500/85 to-orange-600 text-white absolute bottom-1 right-1 cursor-pointer'
                onClick={handleRemoveImage}>
                    <LuTrash/>
                </button>
            </div>
        )
        }
    </div>
  )
}

export default ProfilePhotoSelector