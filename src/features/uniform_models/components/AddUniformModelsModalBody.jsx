// import { useEffect, useState } from "react"
// import { useDispatch } from "react-redux"
// import InputText from '../../../../components/Input/InputText'
// import ErrorText from '../../../../components/Typography/ErrorText'
// import SelectBox from "../../../../components/Input/SelectBox"
// import InputDateTimePicker from "../../../../components/Input/InputDateTimePicker"
// import ToogleInput from "../../../../components/Input/ToogleInput"
// import { showNotification } from "../../../common/headerSlice"
// import { addAdmissionSchool } from "../../../../services/api/admissions"
// import supabase from "../../../../services/database-server"
// // import { addNewLead } from "../leadSlice"

// const INITIAL_ADMISSION_SCHOOL = {
//     admission_id : "",
//     school_id : "",
//     started_at : "",
//     ended_at : "",
//     admission_status : "",
//     admission_fee : "",
//     quota : ""
// }

// function AddAdmissionSchoolModalBody({closeModal, extraObject}){
//     const dispatch = useDispatch()
//     const [loading, setLoading] = useState(false)
//     const [errorMessage, setErrorMessage] = useState("")
//     const [admissionSchool, setAdmissionSchool] = useState(INITIAL_ADMISSION_SCHOOL)
//     const [schoolOptions, setSchoolOptions] = useState([])
//     const { index } = extraObject

//     useEffect(() => {
//         getSchoolsOptions()
//         console.log(index)
//         if(index){
//             setAdmissionSchool({...addAdmissionSchool, admission_id: index})
//         }
//     }, [index])
//     const saveAdmissionSchool = async () => {
//         // if(admissionSchool.school_id.trim() === "")return setErrorMessage("First Name is required!")
//         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
//         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
//         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
//         // else if(admissionSchool.email.trim() === "")return setErrorMessage("Email id is required!")
//         // else{
//             // let newAdmissionSchool = {
//             //     "id": 7,
//             //     "email": admissionSchool.email,
//             //     "first_name": admissionSchool.first_name,
//             //     "last_name": admissionSchool.last_name,
//             //     "avatar": "https://reqres.in/img/faces/1-image.jpg"
//             // }
//             // setAdmissionSchool({...admissionSchool, admission_id: index})
//             console.log(admissionSchool)
            
//             const response = await addAdmissionSchool({newAdmissionSchool: admissionSchool})
//             console.log(response)
//             if(response.error){
//                 dispatch(showNotification({message : "Gagal Menambahkan Jenjang PSB!", status : 0}))

//             }else{
//                 dispatch(showNotification({message : "Berhasil Menambahkan Jenjang PSB!", status : 1}))
//             }
//             closeModal()
//         // }
//     }

//     const getSchoolsOptions = async () => {
//         let { data: schools, error } = await supabase
//             .from('schools')
//             .select('*')
//             console.log(schools)
//             if(!error){
//                 setSchoolOptions(schools)
//                 schools.map((e)=>(
//                         // setScheduleOptions( e => {
//                         schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
//                     ))
//                     console.log(schoolOptions)
//             // //     // schedulesOptions e.name

//             // }))
//             // name: schedule
//             // setScheduleOptions(schedule => {.})
//         }
//     }

//     const updateFormValue = ({updateType, nameInput=null, value}) => {
//         setErrorMessage("")
//         setAdmissionSchool({...admissionSchool, [updateType] : value})
//         console.log(admissionSchool)
//     }

//     return(
//         <>

//             <SelectBox 
//                             labelTitle="Jenjang"
//                             options={schoolOptions}
//                             placeholder="Pilih Jenjang"
//                             containerStyle="w-72"
//                             nameInput="school_id"
//                             updateType="school_id"
//                             // labelStyle="hidden"
//                             // defaultValue={schoolOptions.school_id}
//                             updateFormValue={updateFormValue}
//                         />
//             <InputDateTimePicker labelTitle="Waktu Mulai"  updateType="started_at" nameInput="started_at"  updateFormValue={updateFormValue}/>

//             <InputDateTimePicker labelTitle="Waktu Selesai" updateType="ended_at" nameInput="ended_at" updateFormValue={updateFormValue}/>


//             {/* <InputText type="text" defaultValue={admissionSchool.admission_id} updateType="admission_id" containerStyle="mt-4" labelTitle="Kuota" updateFormValue={updateFormValue}/> */}
//             <InputText type="number" defaultValue={admissionSchool.quota} updateType="quota" containerStyle="mt-4" labelTitle="Kuota" updateFormValue={updateFormValue}/>

//             <InputText type="number" defaultValue={admissionSchool.admission_fee} updateType="admission_fee" containerStyle="mt-4" labelTitle="Biaya Masuk" updateFormValue={updateFormValue}/>

//             <ToogleInput labelTitle="Status Pendaftaran" nameInput="admission_status" defaultValue="false" updateType="admission_status" containerStyle="flex flex-grow justify-between item-center mt-5" updateFormValue={updateFormValue}/>

//             <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
//             <div className="modal-action">
//                 <button  className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
//                 <button  className="btn btn-primary bg-green-500 text-gray-100 hover:bg-green-400 hover:text-gray-50 border-none px-6" onClick={() => saveAdmissionSchool()}>Simpan</button>
//             </div>
//         </>
//     )
// }

// export default AddAdmissionSchoolModalBody