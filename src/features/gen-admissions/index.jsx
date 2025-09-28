import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { setPageTitle } from "../common/headerSlice"
import { showNotification } from '../common/headerSlice'
import InputText from '../../components/Input/InputText'
import InputTextRadio from '../../components/Input/InputTextRadio'
import SelectBox from "../../components/Input/SelectBox"
import TextAreaInput from '../../components/Input/TextAreaInput'
import ToogleInput from '../../components/Input/ToogleInput'
import InputDateTime from "../../components/Input/InputDateTime"
import { useForm } from "react-hook-form"
import FileUploads from "./FileUploads"

import supabase from "../../services/database-server"
import { updateAdmissions } from "../../services/api/admissions"
// import {updateAdmission} from "../../services/api/admission"

import DateTimePicker from 'react-datetime-picker'
import { useParams } from "react-router-dom"
import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
// import DatePicker from 'rsuite/DatePicker';
// import 'rsuite/DatePicker/styles/index.css';
// importing styling datepicker
// import "./css/react-datepicker/react-datepicker.css"

import axios from "axios"
import schools from "../../services/api/schools"
import { title } from "process"
// import supabase from "../services/database"

// type ValuePiece = Date | null

// type Value = ValuePiece | [ValuePiece, ValuePiece]

function Admissions(){

    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date())
    
    const [admission, setAdmission] = useState({
        id: "", 
        title: "", 
        cs_contact: "", 
        started_at: new Date(), 
        ended_at: new Date(), 
        is_active: "", 
        flows: []
    })
    
    const [schemeOptions, setSchemeOptions] = useState([{name: "Online", value: "online"},{name: "Offline", value: "offline"}])
    const [typeOptions, setTypeOptions] = useState([{name: "Pilihan Ganda", value: "MC"},{name: "Benar Salah", value: "BS"},{name: "Essay Singkat", value: "ES"},{name: "Essay", value: "E"}])
    const [selectedOption, setSelectedOption] = useState(null);
    const [schoolOptions, setSchoolOptions] = useState([])
    const [letter_1_url, setLetter1Url] = useState("")
    const [letter_2_url, setLetter2Url] = useState("")
    const [loading, setLoading] = useState(false)
    
    const checked = false
    const id = useParams().admission_id

    const [admissionFlow, setAdmissionFlow] = useState([{step: 1, description: "Pra pendaftaran"}, {step: 2, description: "Pay admission"}]);
    const flowRefs = useRef([]);

    useEffect( () => {
        dispatch(setPageTitle({ title : "Admission"}))
        getSchoolsOptions()
        if(id??"e63830b4-c751-4714-9279-fd57c4be5f10")
            getAdmission(id??"e63830b4-c751-4714-9279-fd57c4be5f10")
        console.log(id)
    },[id])

    // Call API to update profile settings changes
    const saveAdmission = async (e) => {
        e.preventDefault()
        console.log(admission)
        
        // Format admission flow data
        const formattedFlow = admissionFlow.map((flow, index) => ({
            [index + 1]: flow.description
        }));
        
        const updatedAdmission = {
            ...admission,
            flows: formattedFlow,
            template_letter_1: letter_1_url,
            template_letter_1: letter_2_url,
        };
        
        const response = await updateAdmissions({newAdmission: updatedAdmission, id})
        console.log('response', response)
        
        if(!response || response==null || response.error){
            dispatch(showNotification({message : "Gagal Memperbarui data PSB", status : 0}))
        }else if(!response.error) {
            console.log("masuk")
            dispatch(showNotification({message : response.message, status : 1}))
        }else{
            dispatch(showNotification({message : "Gagal Memperbarui data PSB", status : 0}))
        }
    }

    const updateFormValue = ({updateType, nameInput, value}) => {
        console.log('nameInput', nameInput, value)
        setAdmission(prev => ({...prev, [nameInput]: value}))
        console.log('admission>', admission)
    }

    const getAdmission = async (id) => {
        let { data: admissions, error } = await supabase
            .from('admissions')
            .select('*')
            .eq('id', id)
            
        if(!error && admissions.length > 0){
            const admissionData = admissions[0];
            setAdmission(prev => ({
                ...prev, 
                title: admissionData.title, 
                cs_contact: admissionData.cs_contact || "",
                started_at: admissionData.started_at, 
                ended_at: admissionData.ended_at, 
                is_active: admissionData.is_active
                // ta: admissionData.ta
            }))
            
            // Parse admission flow if it exists
            if (admissionData.flows) {
                try {
                    const flowData = Array.isArray(admissionData.flows) 
                        ? admissionData.flows 
                        : JSON.parse(admissionData.flows);
                    
                    const formattedFlow = flowData.map((item, index) => {
                        const key = Object.keys(item)[0];
                        return {
                            step: parseInt(key),
                            description: item[key]
                        };
                    }).sort((a, b) => a.step - b.step);
                    
                    setAdmissionFlow(formattedFlow);
                } catch (error) {
                    console.error("Error parsing admission flow:", error);
                    // Set default flow if parsing fails
                    setAdmissionFlow([{step: 1, description: "Pra pendaftaran"}, {step: 2, description: "Pay admission"}]);
                }
            }
        }
    } 

    const addFlowStep = () => {
        const newStep = admissionFlow.length + 1;
        setAdmissionFlow([...admissionFlow, {step: newStep, description: ""}]);
    }

    const removeFlowStep = (index) => {
        if (admissionFlow.length > 1) {
            const newFlow = admissionFlow.filter((_, i) => i !== index)
                .map((flow, i) => ({...flow, step: i + 1}));
            setAdmissionFlow(newFlow);
        }
    }
    // Upload image to Supabase
        const uploadImage = async (file, questionIndex) => {
            try {
                setLoading(true);
                
                const fileExt = file.name.split('.').pop();
                const fileName = `admissions/general/${questionIndex}`;
                // const fileName = `${admissionId}/question_${questionIndex + 1}_${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${fileName}`;
    
                const { error: uploadError } = await supabase.storage
                    .from(fileName)
                    .upload(filePath, file);
    
                if (uploadError) {
                    throw uploadError;
                }
    
                const { data: { publicUrl } } = supabase.storage
                    .from(fileName)
                    .getPublicUrl(filePath);
    
                // Add attachment to question
                // const newQuestions = [...questions];
                // newQuestions[questionIndex].attachments.push({
                //     url: publicUrl,
                //     filename: file.name,
                //     type: file.type
                // });
                // setQuestions(newQuestions);
    
                if(publicUrl){
                    if(questionIndex=='kesanggupan-fullday'){
                        setLetter1Url(publicUrl)
                    }
                    if(questionIndex=='kesanggupan-pesantren'){
                        setLetter2Url(publicUrl)
                    }
                }
                return publicUrl;
            } catch (error) {
                console.error('Error uploading image:', error);
                return null;
            } finally {
                setLoading(false);
            }
        };

    const updateFlowDescription = (index, description) => {
        const newFlow = [...admissionFlow];
        newFlow[index] = {...newFlow[index], description};
        setAdmissionFlow(newFlow);
    }

    const moveFlowStep = (index, direction) => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === admissionFlow.length - 1)) {
            return;
        }
        
        const newFlow = [...admissionFlow];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap steps
        [newFlow[index], newFlow[newIndex]] = [newFlow[newIndex], newFlow[index]];
        
        // Update step numbers
        const updatedFlow = newFlow.map((flow, i) => ({...flow, step: i + 1}));
        setAdmissionFlow(updatedFlow);
    }

    const getSchoolsOptions = async () => {
        let { data: schools, error } = await supabase
            .from('schools')
            .select('*')
        if(!error){
            setSchoolOptions(schools)
        }
    }

    const handleUploadFullDay = (data, nameInput) => {
        if(data){
            setLetter1Url(data)
        }
    }
    const handleUploadPesantren = (data, nameInput) => {
        if(data){
            setLetter2Url(data)
        }
    }

    return(
        <>
            <TitleCard title="Informasi PSB" topMargin="mt-2">
                <form onSubmit={saveAdmission}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <InputText 
                                labelTitle="Nama PSB" 
                                nameInput="title"  
                                required={true} 
                                containerStyle="w-120" 
                                defaultValue={admission.title} 
                                updateFormValue={updateFormValue}
                            />
                            <InputText 
                                labelTitle="" 
                                nameInput="id" 
                                hidden  
                                required={true} 
                                containerStyle="w-120" 
                                defaultValue={admission.id} 
                                updateFormValue={updateFormValue}
                            />
                            <InputText 
                                labelTitle="Kontak CS" 
                                nameInput="cs_contact"  
                                required={true} 
                                containerStyle="w-120" 
                                defaultValue={admission.cs_contact} 
                                updateFormValue={updateFormValue}
                            />
                            
                            {/* Admission Flow Section */}
                            <div className={`form-control w-full`}>
                                <label className="label">
                                    <span className={"label-text text-base-content "}>Alur Pendaftaran</span>
                                </label>
                                <div className="space-y-3">
                                    {admissionFlow.map((flow, index) => (
                                        <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-base-100">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-content rounded-full">
                                                {flow.step}
                                            </div>
                                            <input
                                                type="text"
                                                value={flow.description}
                                                onChange={(e) => updateFlowDescription(index, e.target.value)}
                                                className="flex-grow input input-bordered"
                                                placeholder={`Deskripsi langkah ${flow.step}`}
                                                ref={(el) => (flowRefs.current[index] = el)}
                                            />
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveFlowStep(index, 'up')}
                                                    disabled={index === 0}
                                                    className="btn btn-sm btn-ghost"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveFlowStep(index, 'down')}
                                                    disabled={index === admissionFlow.length - 1}
                                                    className="btn btn-sm btn-ghost"
                                                >
                                                    ↓
                                                </button>
                                                {admissionFlow.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFlowStep(index)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addFlowStep}
                                        className="btn btn-primary btn-outline w-full"
                                    >
                                        + Tambah Langkah
                                    </button>
                                </div>
                            </div>

                            {/* File Upload Sections */}
                            <div className={`form-control w-full`}>
                                <label className="label">
                                    <span className={"label-text text-base-content "}>Upload Template Surat Kesanggupan (FullDay)</span>
                                </label>
                                <FileUploads id={id} save={handleUploadFullDay} />
                            </div>
                            <div className={`form-control w-full`}>
                                <label className="label">
                                    <span className={"label-text text-base-content "}>Upload Template Surat Kesanggupan (Pesantren)</span>
                                </label>
                                <FileUploads id={id} save={handleUploadPesantren}/>
                            </div>
                            <ToogleInput updateType="is_active" defaultValue={admission.is_active} nameInput="is_active" labelTitle="Status" updateFormValue={updateFormValue}/>
                        </div>
                    </div>
                    
                    <div className="divider" ></div>

                    <div className="mt-16">
                        <button className="btn btn-primary float-right bg-green-700 hover:bg-green-600 text-gray-50 dark:text-gray-100" type="submit">
                            Simpan
                        </button>
                    </div>
                </form>
            </TitleCard>
        </>
    )
}

export default Admissions
// import moment from "moment"
// import { useEffect, useRef, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import TitleCard from "../../components/Cards/TitleCard"
// import { setPageTitle } from "../common/headerSlice"
// import { showNotification } from '../common/headerSlice'
// import InputText from '../../components/Input/InputText'
// import InputTextRadio from '../../components/Input/InputTextRadio'
// import SelectBox from "../../components/Input/SelectBox"
// import TextAreaInput from '../../components/Input/TextAreaInput'
// import ToogleInput from '../../components/Input/ToogleInput'
// import InputDateTime from "../../components/Input/InputDateTime"
// import { useForm } from "react-hook-form"
// import FileUploads from "./FileUploads"

// import supabase from "../../services/database-server"
// import { updateAdmissions } from "../../services/api/admissions"
// // import {updateAdmission} from "../../services/api/admission"

// import DateTimePicker from 'react-datetime-picker'
// import { useParams } from "react-router-dom"
// import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
// // import DatePicker from 'rsuite/DatePicker';
// // import 'rsuite/DatePicker/styles/index.css';
// // importing styling datepicker
// // import "./css/react-datepicker/react-datepicker.css"

// import axios from "axios"
// import schools from "../../services/api/schools"
// import { title } from "process"
// // import supabase from "../services/database"

// // type ValuePiece = Date | null

// // type Value = ValuePiece | [ValuePiece, ValuePiece]

// function Admissions(){

//     const dispatch = useDispatch()
//     const [value, onChange] = useState(new Date())
    
//     const [admission, setAdmission] = useState({id: "", title: "", started_at: new Date(), ended_at: new Date(), status: "", fields: "" })
//     // admission_category_id: "",
//     // const [admission, setadmission] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
//     const [schemeOptions, setSchemeOptions] = useState([{name: "Online", value: "online"},{name: "Offline", value: "offline"}])
//     const [typeOptions, setTypeOptions] = useState([{name: "Pilihan Ganda", value: "MC"},{name: "Benar Salah", value: "BS"},{name: "Essay Singkat", value: "ES"},{name: "Essay", value: "E"}])
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [schoolOptions, setSchoolOptions] = useState([])
//     // const [admission, setadmission] = useState({name: "", started_at: new Date(), ended_at: new Date(), max_participants: "", school_id: "" })
//     const checked = false
//     // const {register, handleSubmit} = useForm()
//     const id = useParams().admission_id
//     // const useRef = useRef()

//     const [fields, setFields] = useState([]);
//     const fieldRefs = useRef([]);
//     const addButtonRef = useRef(null);


//     useEffect( () => {
//         dispatch(setPageTitle({ title : "Admission"}))
//         getSchoolsOptions()
//         // getadmission()
//         if(id??"e63830b4-c751-4714-9279-fd57c4be5f10")
//             getAdmission(id)
//         // console.log(id)
//         console.log(id)
//         if (fieldRefs.current.length > 0) {
//             fieldRefs.current[fieldRefs.current.length - 1]?.focus();
//         }
//     },[id, fields])

//     // Call API to update profile settings changes
//     const saveAdmission = async (e) => {
//         e.preventDefault()
//         console.log(admission)
//         const {id, ...newAdmission} = admission
//         setAdmission(prev => ({...prev, fields:fields.join(',')}))
//         // setAdmission()
//         const response = await updateAdmissions({newAdmission: admission, id})
//         // const {error, message, data} = await addadmission({admission})
//         console.log('response', response)
//         // console.log('message', message)
//         if(!response || response==null || response.error){
//             dispatch(showNotification({message : "Gagal Memperbarui data PSB", status : 0}))
//         }else if(!response.error) {
//             console.log("masuk")
//             dispatch(showNotification({message : response.message, status : 1}))
//         }else{
//             dispatch(showNotification({message : "Gagal Memperbarui data PSB", status : 0}))
//         }
//     }

//     // const updateAdmissions = async (e) => {
    
//     //         // e.preventDefault()
//     //         console.log(admission)
//     //         // const {school_id, ...newadmission} = exa
//     //         const response = await addadmission({admission})
//     //         // const {error, message, data} = await addadmission({admission})
//     //         console.log('response', response)
//     //         // console.log('message', message)
//     //         if(!response || response==null || response.error){
//     //             dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
//     //         }else if(!response.error) {
//     //             console.log("masuk")
//     //             dispatch(showNotification({message : response.message, status : 1}))
//     //         }else{
//     //             dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
//     //         }
//     //         // e.preventDefault()
//     //         // console.log(admission)
//     //         // const {school_id, ...newadmission} = admission
//     //         // const {error, message, data} = addadmission({newadmission, school_id: admission.school_id})
//     //         // if(!error){
            
//     //         //     dispatch(showNotification({message : message, status : 1}))    
//     //         // }
//     //     }
 
//     // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
//     //     setadmission((admission) =>({...admission, [nameInput]: value}))
//     //     // console.log(updateType)
//     // }
//     const updateFormValue = ({updateType, nameInput, value}) => {
//         console.log('nameInput', nameInput, value)
//         admission[nameInput] = value
//         console.log('admission>', admission)
//         // setadmission( (data) =>  ({...data, [nameInput]: value}))

//         // console.log(updateType)
//     }

//     const getAdmission = async (id) => {

//         // if(id){
//             let { data: admissions, error } = await supabase
//                 .from('admissions')
//                 .select('*')
//                 .eq('id', id??!id)
//                 console.log(admissions[0])
//                 if(!error){
//                     // name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "" 
//                     setAdmission((prev) => ({...prev, title: admissions[0].title, started_at: admissions[0].started_at, ended_at: admissions[0].ended_at, status: admissions[0].status, ta: admissions[0].ta}))
//                     console.log('admission', admission)
//                 }
//         // }
//     } 

//     // const getSchoolsOptions = async () => {
//     //     let { data: schools, error } = await supabase
//     //         .from('schools')
//     //         .select('*')
//     //         console.log(schools)
//     //         if(!error){
//     //             // setSchoolOptions(schools)
//     //             // schools.map((e)=>(
//     //             //         // setadmissionOptions( e => {
//     //             //         schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
//     //             //     ))
//     //                 // console.log(schoolOptions)
//     //         // //     // admissionsOptions e.name

//     //         // }))
//     //         // name: admission
//     //         // setadmissionOptions(admission => {.})
//     //     }
//     // }

//     // const handledSubmit = (e) => {
//     //     e.preventDefault()


//     // }



//     const admissionsOptions2 = [
//         {name : "Today", value : "TODAY"},
//         {name : "Yesterday", value : "YESTERDAY"},
//         {name : "This Week", value : "THIS_WEEK"},
//         {name : "Last Week", value : "LAST_WEEK"},
//         {name : "This Month", value : "THIS_MONTH"},
//         {name : "Last Month", value : "LAST_MONTH"},
//     ]

//     const getSchoolsOptions = async () => {
//         let { data: schools, error } = await supabase
//             .from('schools')
//             .select('*')
//             console.log(schools)
//             if(!error){
//                 setSchoolOptions(schools)
//                 schools.map((e)=>(
//                         // setadmissionOptions( e => {
//                         schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
//                     ))
//                     console.log('schoolOptions', schoolOptions)
//             // //     // admissionsOptions e.name

//             // }))
//             // name: admission
//             // setadmissionOptions(admission => {.})
//         }
//     }
//     const addFlow = (value) => {
//         const newField = value
//         setFields([...fields, newField]);
//     //     const newId = Date.now();
//     //     setFields([...fields, { id: newId, value: '' }]);
//     }
//     const hapusField = (id) => {
//     if (fields.length > 1) {
//       setFields(fields.filter(field => field.id !== id));
//         }
//     };

//     const handleChange = (id, value) => {
//         setFields(fields.map(field => 
//         field.id === id ? { ...field, value } : field
//         ));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Submitted values:', fields);
//         // Process your form data here
//     };
//     return(
//         <>
//             <TitleCard title="Edit Seleksi" topMargin="mt-2">
//                 <form onSubmit={() => saveAdmission()}>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//                         <InputText labelTitle="Nama PSB" nameInput="title"  required={true} containerStyle="w-120" defaultValue={admission.title} updateFormValue={updateFormValue}/>
//                         <InputText labelTitle="" nameInput="id" hidden  required={true} containerStyle="w-120" defaultValue={admission.id} updateFormValue={updateFormValue}/>
//                         <InputText labelTitle="Kontak CS" nameInput="contact_cs"  required={true} containerStyle="w-120" defaultValue={admission.contact_cs} updateFormValue={updateFormValue}/>
//                         {/* <InputText labelTitle="Alu" nameInput="contact_cs"  required={true} containerStyle="w-120" defaultValue={admission.contact_cs} updateFormValue={updateFormValue}/> */}
//                         <div className={`form-control w-full`}>
//                         <label className="label">
//                             <span className={"label-text text-base-content "}>Alur Pendaftaran</span>
//                         </label>
//                         {fields.map((field, index) => (
//                             <div key={field.id} className="mb-3 flex items-center">
//                                 <input
//                                 ref={(el) => (fieldRefs.current[index] = el)}
//                                 type="text"
//                                 value={fields[index]}
//                                 onChange={(e) => handleChange(e.target.value)}
//                                 className="border p-2 rounded flex-grow"
//                                 placeholder={`Field ${index + 1}`}
//                                 />
//                                 {index === 0 ? (
//                                 <button
//                                     type="button"
//                                     onClick={addFlow}
//                                     ref={addButtonRef}
//                                     className="ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//                                 >
//                                     Tambah
//                                 </button>
//                                 ) : (
//                                 <button
//                                     type="button"
//                                     onClick={() => hapusField(field.id)}
//                                     className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
//                                 >
//                                     Hapus
//                                 </button>
//                                 )}
//                             </div>
//                             ))}
//                         {/* <table>
//                             <th>Ikon</th>
//                             <th>Nama</th>
//                             <th className="text-sm btn" onClick={()=>addFlow()}>Tambah</th>
//                             {admission.flows.split().map(flow => 
//                                 <tr>
//                                     <td>
//                                         <InputText labelTitle="Alu" nameInput="admission.flows[]"  required={true} containerStyle="w-120" defaultValue={flow} updateFormValue={updateFormValue}/>
//                                     </td>
//                                 </tr>

//                             )  
                            
//                             }
//                         </table> */}
//                         </div>
//                         <div className={`form-control w-full`}>
//                         <label className="label">
//                             <span className={"label-text text-base-content "}>Upload Template Surat Pengumuman</span>
//                         </label>
//                             <FileUploads id={id} ></FileUploads>
//                         </div>
//                         <div className={`form-control w-full`}>
//                         <label className="label">
//                             <span className={"label-text text-base-content "}>Upload Template Surat Kesanggupan</span>
//                         </label>
//                             <FileUploads id={id} ></FileUploads>
//                         </div>
//                         {/* <div className={`form-control w-full`}>
//                         <label className="label">
//                             <span className={"label-text text-base-content "}>Upload Template Surat Orang Tua / Wali</span>
//                         </label>
//                             <FileUploads id={id} sch_id={sch_id}></FileUploads>
//                         </div> */}
//                         {/* <InputText labelTitle="Alu" nameInput="contact_cs"  required={true} containerStyle="w-120" defaultValue={admission.contact_cs} updateFormValue={updateFormValue}/> */}

//                     </div>
//                 </div>
//                 <div className="divider" ></div>

//                 {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
//                     <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
//                     <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
//                     </div> */}

//                 <div className="mt-16"><button className="btn btn-primary float-right bg-green-700 hover:bg-green-600 text-gray-50 dark:text-gray-100" type="submit">Simpan</button></div>
//                 </form>
//                 {/* onClick={() => updateadmissions()} */}
//             </TitleCard>
            
            
            
//         </>
//     )
// }


// export default Admissions