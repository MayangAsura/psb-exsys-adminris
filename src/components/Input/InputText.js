import { useEffect, useState } from "react"
import { DefaultContext } from "react-icons/lib"
// importing styling datepicker
// import ".. /css/react-datepicker/react-datepicker.css"
// import { useForm } from "react-hook-form"


function InputText({labelTitle, labelStyle, error, register, registerOptions, required, nameInput, type, pattern, checked, containerStyle, inputStyle, defaultValue, placeholder, updateFormValue, updateType, error_msg}){

    const [value, setValue] = useState(defaultValue)
    const [registerOptions_, setRegisterOptions] = useState(registerOptions)
    // const {register, handleSubmit} = useForm()
    
useEffect(()=>{
    console.log(defaultValue)
    if(registerOptions)
        setRegisterOptions(registerOptions)
    console.log('registerOptions', registerOptions)
    console.log(error)
    console.log(defaultValue)
    if(defaultValue)
        setValue(defaultValue)
},[defaultValue, registerOptions])
// const registerOptions = {
//     name: { required: "Harap isi Nama" },
//     subtitle: { required: "Harap isi Deskripsi" },
//     started_at: { required: "Harap isi Waktu mulai " },
//     ended_at: { required: "Harap isi Waktu selesai" },
//     scheme: { required: "Harap isi Skema" },
//     question_type: { required: "Harap isi Tipe Pertanyaan" },
//     location: { required: "Harap isi Tipe Lokasi" },
//     room: { required: "Harap isi Ruangan" }
//     // is_random_answer: {
//     //   required: "Password is required",
//     //   minLength: {
//     //     value: 8,
//     //     message: "Password must have at least 8 characters"
//     //   }
//     // }
//   };
// {...register(nameInput, registerOptions[nameInput])}
    const updateInputValue = (val) => {
        setValue(val)
        console.log(updateType, nameInput, value)
        updateFormValue({updateType, nameInput, value})
    }

    return(
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
            </label>
            {/* {...register(nameInput, {required})}  */}
            <input name={nameInput} type={type || "text"} value={value} pattern={pattern} checked placeholder={placeholder || ""} onChange={(e) => updateInputValue(e.target.value)} required  className={`input input-bordered w-full ${inputStyle}` }  />
            <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block" required>
                                            {/* {error[nameInput] && error[nameInput].message} */}
                                        </span>
        </div>
    )
}


export default InputText