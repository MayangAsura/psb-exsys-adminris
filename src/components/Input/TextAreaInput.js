import { useEffect, useState } from "react"


function TextAreaInput({labelTitle, labelStyle, required, nameInput, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType}){

    const [value, setValue] = useState("")

    useEffect(() => {
        if(defaultValue){
            setValue(defaultValue)
        }
    }, [defaultValue])
    const updateInputValue = (val) => {
        setValue(val)
        updateFormValue({updateType, nameInput,  value})
    }

    return(
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
            </label>
            <textarea value={value} className="textarea textarea-bordered w-full" rows="8" cols="9" placeholder={placeholder || ""} onChange={(e) => updateInputValue(e.target.value)}></textarea>
        </div>
    )
}


export default TextAreaInput