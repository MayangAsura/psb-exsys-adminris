import { useEffect, useState } from "react"
// import DateTimePicker from "react-datetime-picker"
// import DatePicker from "react-datepicker";
import { DatePicker, Stack } from 'rsuite';
import { FaCalendar, FaClock } from 'react-icons/fa';

import 'rsuite/dist/rsuite.min.css';


function InputDateTimePicker({labelTitle, labelStyle, register, nameInput, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType, errors, error_msg}){

    const [value, setValue] = useState()

    useEffect(() => {
        if(defaultValue){
            setValue(defaultValue)
        }
    },[defaultValue])
    const updateInputValue = (val) => {
        // val.toISOString()
        setValue(val)
        updateFormValue({updateType, nameInput, value})
        console.log(value)
    }

    const CustomTimeInput = ({ value, onChange }) => (
        <input
        name={nameInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.target?.focus()}
        style={{ border: "solid 1px green" }}
        />
    );

    return(
        <div className={`form-control w-full  ${containerStyle}`}>
            <label className="label">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
            </label>
            <DatePicker
                format="dd MMM yyyy hh:mm:ss aa"
                showMeridiem
                caretAs={FaCalendar}
                style={{ width: 220 }}
                name={nameInput}
                value={value}
                onChange={updateInputValue}
                />
                {errors && 
                    <span className="mt-2 text-sm text-red-500 ">
                        {error_msg}
                                                    {/* {error[nameInput] && error[nameInput].message} */}
                                                    </span>
                                                    // hidden peer-[&:not(:placeholder-shown):not(:focus):invalid]:block
                
                }
            {/* <DatePicker
                selected={value}
                onChange={(date) => updateInputValue(date)}
                showTimeInput
                customTimeInput={<CustomTimeInput />}
                // {...register(nameInput)}
                /> */}
            {/* <DateTimePicker onChange={(e) => updateInputValue(e.target.value)} value={value}/> */}
            
            {/* <input type={type || "text"} value={value} placeholder={placeholder || ""} onChange={(e) => updateInputValue(e.target.value)}className="input  input-bordered w-full " /> */}
        </div>
    )
}


export default InputDateTimePicker
// const [selectedDate, setSelectedDate] = useState(new Date());
//   const ExampleCustomTimeInput = ({ value, onChange }) => (
//     <input
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       onClick={(e) => e.target?.focus()}
//       style={{ border: "solid 1px pink" }}
//     />
//   );
//   return (
//     <DatePicker
//       selected={selectedDate}
//       onChange={(date) => setSelectedDate(date)}
//       showTimeInput
//       customTimeInput={<ExampleCustomTimeInput />}
//     />
//   );