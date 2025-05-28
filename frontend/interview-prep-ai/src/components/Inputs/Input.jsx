import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6';

const Input = ({value,onChange,label, placeholder,type}) => {
    const [showPassword,setshowPassword]=useState(false);

    const toggleShowPassword=()=>{
        setshowPassword(!showPassword);
    };
  return (
    <>
    <label className="text-[13px] text-slate-800">{label}</label>

    <div className="input-box border border-slate-400 ">
        <input 
        type={type=='password'? (showPassword ? "text" : "Password"):type}
        placeholder={placeholder}
        className='w-full bg-transparent outline-none'
        value={value ?? ""}
        onChange={(e)=>onChange(e)}
         />

         {type==='password' && (
            <>
            {showPassword ?(
                <FaRegEye
                size={22}
                className='text-primary cursor-pointer'
                onClick={()=>toggleShowPassword()}
                />
            ):(
                <FaRegEyeSlash
                size={22}
                className='text-slate-400 cursor-pointer'
                onClick={()=>toggleShowPassword()}
                />
            )
        
            }
            </>
         )}
    </div>
    </>
    

  )
}

export default Input