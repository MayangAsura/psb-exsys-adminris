
import axios from 'axios'
import capitalize from 'capitalize-the-first-letter'
import React, { useState, useEffect } from 'react'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'


function SelectBox(props){
    
    const {labelTitle, labelDescription, nameInput, defaultValue, register, containerStyle, placeholder, labelStyle, options, updateType, updateFormValue, errors, error_msg} = props

    const [value, setValue] = useState(defaultValue || "")
    console.log('op', options)

    console.log(labelTitle)

    const updateValue = (newValue) =>{
        setValue(newValue)
        console.log('newValue', newValue, updateType)
        updateFormValue({updateType, nameInput, value})
    }
    



    return (
        <div className={`inline-block ${containerStyle}`}>
            <label  className={`label  ${labelStyle}`}>
                <div className="label-text">{labelTitle}
                {/* {labelDescription && <div className="tooltip tooltip-right" data-tip={labelDescription}><InformationCircleIcon className='w-4 h-4'/></div>} */}
                </div>
            </label>

            <select className="select select-bordered w-full" name={nameInput} value={value} onChange={(e) => updateValue(e.target.value)}>
                <option disabled value="PLACEHOLDER">{placeholder}</option>
                {/* <option value={o.value || o.name} key={k}>{o.name}</option> */}
                {
                    options.map((o) => 
                        (
                            
                            // selected={o.value || o.school_id==value} 
                    <option value={o.value || o.school_id  || o.id} key={o.value || o.school_id} >{o.label || o.school_name }</option>)
                    
                        // return 
                    )
                    // ((o, k) => {
                    // })
                }
            </select>
            {errors && 
                <span className="mt-2 text-sm text-red-500 ">
                    {error_msg}
                                                {/* {error[nameInput] && error[nameInput].message} */}
                                                </span>
                                                    // hidden peer-[&:not(:placeholder-shown):not(:focus):invalid]:block
                
            }
        </div>
    )
}

export default SelectBox
