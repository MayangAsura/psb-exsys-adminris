import { useState } from "react"
// importing styling datepicker
// import ".. /css/react-datepicker/react-datepicker.css"
// import { useForm } from "react-hook-form"


function InputTextRadio({labelTitle, labelStyle, register, required, nameInput, type, options, checked, containerStyle, defaultValue, placeholder, updateFormValue, updateType}){

    const [value, setValue] = useState(defaultValue)
    // const {register, handleSubmit} = useForm()
    console.log(options)

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
            {options.map((option) => (
                <div className="flex flex-auto justify-start items-center gap-1  mb-1">
                    {/* style={{ borderRadius: 35% }} */}
                    <input name={nameInput} type="radio" key={option.value} value={option.value} checked={option.value===value?true:false} placeholder={placeholder || ""} onChange={(e) => updateInputValue(e.target.value)} className="input-radio radio radio-primary border-green-500 hover:border-green-800 focus-visible:bg-green-800 checked:bg-green-800 " />
                     <span className="text-base-content"> {option.label}</span>
                </div>
            ))}
        </div>
    )
}


export default InputTextRadio