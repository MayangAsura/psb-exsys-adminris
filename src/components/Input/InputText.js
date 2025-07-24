import { useEffect, useState } from "react"
import { DefaultContext } from "react-icons/lib"
// importing styling datepicker
// import ".. /css/react-datepicker/react-datepicker.css"
// import { useForm } from "react-hook-form"


function InputText({labelTitle, labelStyle, register, required, nameInput, type, checked, containerStyle, defaultValue, placeholder, updateFormValue, updateType}){

    const [value, setValue] = useState(defaultValue)
    // const {register, handleSubmit} = useForm()
    
useEffect(()=>{
    console.log(defaultValue)
    if(defaultValue)
        setValue(defaultValue)
},[defaultValue])
    const updateInputValue = (val) => {
        setValue(val)
        updateFormValue({updateType, nameInput, value})
    }

    return(
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
            </label>
            {/* {...register(nameInput, {required})}  */}
            <input name={nameInput} type={type || "text"} value={defaultValue} checked placepholder={placeholder || ""} onChange={(e) => updateInputValue(e.target.value)} className="input  input-bordered w-full " />
        </div>
    )
}


export default InputText