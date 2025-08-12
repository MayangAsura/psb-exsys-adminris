import moment from "moment"
import { useEffect, useState } from "react"
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

import supabase from "../../services/database-server"
import { updateAdmissionSchool} from "../../services/api/admissions"
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

function AdmissionEdit(){

    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date())
    
    const [admission, setAdmission] = useState({title: "", started_at: new Date(), ended_at: new Date(), status: "", ta: "" })
    // admission_category_id: "",
    // const [admission, setadmission] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
    const [schemeOptions, setSchemeOptions] = useState([{name: "Online", value: "online"},{name: "Offline", value: "offline"}])
    const [typeOptions, setTypeOptions] = useState([{name: "Pilihan Ganda", value: "MC"},{name: "Benar Salah", value: "BS"},{name: "Essay Singkat", value: "ES"},{name: "Essay", value: "E"}])
    const [selectedOption, setSelectedOption] = useState(null);
    const [schoolOptions, setSchoolOptions] = useState([])
    // const [admission, setadmission] = useState({name: "", started_at: new Date(), ended_at: new Date(), max_participants: "", school_id: "" })
    const checked = false
    const {register, handleSubmit} = useForm()
    const id = useParams().admission_id
    const sch_id = useParams().school_id


    useEffect( () => {
        dispatch(setPageTitle({ title : "Edit"}))
        getSchoolsOptions()
        // getadmission()
        if(id)
            getAdmission(id)
        // console.log(id)
        console.log(id)
    },[id])

    // Call API to update profile settings changes
    const saveAdmissions = async (e) => {
        e.preventDefault()
        console.log(admission)
        // const {school_id, ...newadmission} = admission
        const response = await updateAdmissionSchool({newAdmissionSchool: admission, id, sch_id})
        // const {error, message, data} = await addadmission({admission})
        console.log('response', response)
        // console.log('message', message)
        if(!response || response==null || response.error){
            dispatch(showNotification({message : "Gagal Memperbarui data PSB", status : 0}))
        }else if(!response.error) {
            console.log("masuk")
            dispatch(showNotification({message : response.message, status : 1}))
        }else{
            dispatch(showNotification({message : "Gagal Memperbarui data PSB", status : 0}))
        }
    }

    // const updateAdmissions = async (e) => {
    
    //         // e.preventDefault()
    //         console.log(admission)
    //         // const {school_id, ...newadmission} = exa
    //         const response = await addadmission({admission})
    //         // const {error, message, data} = await addadmission({admission})
    //         console.log('response', response)
    //         // console.log('message', message)
    //         if(!response || response==null || response.error){
    //             dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
    //         }else if(!response.error) {
    //             console.log("masuk")
    //             dispatch(showNotification({message : response.message, status : 1}))
    //         }else{
    //             dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
    //         }
    //         // e.preventDefault()
    //         // console.log(admission)
    //         // const {school_id, ...newadmission} = admission
    //         // const {error, message, data} = addadmission({newadmission, school_id: admission.school_id})
    //         // if(!error){
            
    //         //     dispatch(showNotification({message : message, status : 1}))    
    //         // }
    //     }
 
    // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
    //     setadmission((admission) =>({...admission, [nameInput]: value}))
    //     // console.log(updateType)
    // }
    const updateFormValue = ({updateType, nameInput, value}) => {
        console.log('nameInput', nameInput, value)
        admission[nameInput] = value
        console.log('admission>', admission)
        // setadmission( (data) =>  ({...data, [nameInput]: value}))

        // console.log(updateType)
    }

    const getAdmission = async (id) => {
        let { data: admissions, error } = await supabase
            .from('admission_schools')
            .select('*')
            .eq('id', id)
            console.log(admissions[0])
            if(!error){
                // name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "" 
                setAdmission((prev) => ({...prev, title: admissions[0].title, code: admissions[0].code, started_at: admissions[0].started_at, ended_at: admissions[0].ended_at, status: admissions[0].status}))
                console.log('admission', admission)
            }
    } 

    // const getSchoolsOptions = async () => {
    //     let { data: schools, error } = await supabase
    //         .from('schools')
    //         .select('*')
    //         console.log(schools)
    //         if(!error){
    //             // setSchoolOptions(schools)
    //             // schools.map((e)=>(
    //             //         // setadmissionOptions( e => {
    //             //         schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
    //             //     ))
    //                 // console.log(schoolOptions)
    //         // //     // admissionsOptions e.name

    //         // }))
    //         // name: admission
    //         // setadmissionOptions(admission => {.})
    //     }
    // }

    // const handledSubmit = (e) => {
    //     e.preventDefault()


    // }



    const admissionsOptions2 = [
        {name : "Today", value : "TODAY"},
        {name : "Yesterday", value : "YESTERDAY"},
        {name : "This Week", value : "THIS_WEEK"},
        {name : "Last Week", value : "LAST_WEEK"},
        {name : "This Month", value : "THIS_MONTH"},
        {name : "Last Month", value : "LAST_MONTH"},
    ]

    const getSchoolsOptions = async () => {
        let { data: schools, error } = await supabase
            .from('schools')
            .select('*')
            console.log(schools)
            if(!error){
                setSchoolOptions(schools)
                schools.map((e)=>(
                        // setadmissionOptions( e => {
                        schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
                    ))
                    console.log('schoolOptions', schoolOptions)
            // //     // admissionsOptions e.name

            // }))
            // name: admission
            // setadmissionOptions(admission => {.})
        }
    }

    return(
        <>
            <TitleCard title="Edit Seleksi" topMargin="mt-2">
                <form onSubmit={saveAdmissions}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <InputText labelTitle="Nama" nameInput="title"  required={true} containerStyle="w-120" defaultValue={admission.title} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Kode" nameInput="code"  required={true} containerStyle="w-120" defaultValue={admission.code} updateFormValue={updateFormValue}/>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <InputDateTimePicker labelTitle="Waktu Mulai"  required={true} nameInput="started_at" containerStyle="w-52" defaultValue={admission.started_at} updateFormValue={updateFormValue}/>
                        <InputDateTimePicker labelTitle="Waktu Selesai" nameInput="ended_at" defaultValue={admission.ended_at} containerStyle="w-52" updateFormValue={updateFormValue}/>
                        {/* defaultValue={admission.started_at?admission.started_at:new Date()} */}
                        
                        {/* <InputText labelTitle="Maksimal Peserta" type="number" name="max_participants" defaultValue={admission.description} updateFormValue={updateFormValue}/> */}
                        {/* <SelectBox 
                            labelTitle="Statu"
                            options={schoolOptions}
                            placeholder="Pilih Jenjang"
                            containerStyle="w-72"
                            nameInput="school_id"
                            // labelStyle="hidden"
                            // defaultValue={schoolOptions.school_id}
                            updateFormValue={updateFormValue}
                        /> */}
                        {/* <InputText labelTitle="Status Pendaftaran" nameInput="status"  required={true} defaultValue={admission.status} updateFormValue={updateFormValue}/> */}
                        {/* <InputText labelTitle="Kuota Pendaftaran"  type="number" nameInput="max_participants" defaultValue={admission.max_participants} updateFormValue={updateFormValue} containerStyle="w-72"/> */}
                        {/* <InputDateTime labelTitle="Waktu Mulai" name="started_at" defaultValue={admission.started_at} updateFormValue={updateFormValue}/>
                        <InputDateTime labelTitle="Waktu Selesai" name="ended_at" defaultValue={admission.ended_at} updateFormValue={updateFormValue}/> */}
                        {/* <InputText labelTitle="Skema" name="scheme" defaultValue={admission.scheme} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Tipe" name="type" defaultValue={admission.type} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Lokasi" name="location" defaultValue={admission.location} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Ruangan" name="room" defaultValue={admission.room} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Acak Soal" name="is_random_question" defaultValue={true} type="radio" updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Acak Jawaban" name="is_random_answer" defaultValue={true}  type="radio" updateFormValue={updateFormValue}/> */}

                        {/* <SelectBox labelTitle="Jadwal" defaultValue="" updateFormValue={updateFormValue}/> */}
                    {/* <InputText labelTitle="Waktu Mulai" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Waktu Selesai" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/>
                    <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/> */}
                </div>
                <InputText labelTitle="Tahun Ajaran" nameInput="ta"  required={true} containerStyle="w-120" placeholder="2025/2026" defaultValue={admission.ta} updateFormValue={updateFormValue}/>
                <ToogleInput  labelTitle="Status Pendaftaran" nameInput="status" defaultValue={admission.status} containerStyle="flex flex-grow justify-between item-center" updateFormValue={updateFormValue}/>
                </div>
                <div className="divider" ></div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
                    </div> */}

                <div className="mt-16"><button className="btn btn-primary float-right bg-green-700 hover:bg-green-600 text-gray-50 dark:text-gray-100" type="submit">Simpan</button></div>
                </form>
                {/* onClick={() => updateadmissions()} */}
            </TitleCard>
            
            
            
        </>
    )
}


export default AdmissionEdit