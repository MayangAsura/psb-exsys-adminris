import { useEffect, useState } from "react"


function ToogleInput({labelTitle, labelStyle, nameInput, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType}){

    const [value, setValue] = useState(defaultValue)

    useEffect(()=> {
        defaultValue==='active'?setValue(true):setValue(false)
        
    },[defaultValue])
    const updateToogleValue = () => {
        setValue(!value)
        updateFormValue({updateType, nameInput, value : !value})
    }

    return(
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label cursor-pointer">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
                <input type="checkbox" className="toggle toggle-success toggle-lg" checked={value}  onChange={(e) => updateToogleValue()}/>
            </label>
        </div>
    )
}


export default ToogleInput
