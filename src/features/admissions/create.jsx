import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { showNotification } from '../common/headerSlice'
import InputText from '../../components/Input/InputText'
import SelectBox from "../../components/Input/SelectBox"
import TextAreaInput from '../../components/Input/TextAreaInput'
import ToogleInput from '../../components/Input/ToogleInput'
import InputDateTime from "../../components/Input/InputDateTime"
import { useForm } from "react-hook-form"

import supabase from "../../services/database-server"
import { addAdmissionAys } from "../../services/api/admissions"
// import {addadmission_ays} from "../../../services/api/admission_ays"

import DateTimePicker from 'react-datetime-picker'
import { useNavigate, useParams } from "react-router-dom"
import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
// import DatePicker from 'rsuite/DatePicker';
// import 'rsuite/DatePicker/styles/index.css';
// importing styling datepicker
// import "./css/react-datepicker/react-datepicker.css"

import axios from "axios"
import schools from "../../services/api/schools"
// import supabase from "../services/database"

// type ValuePiece = Date | null

// type Value = ValuePiece | [ValuePiece, ValuePiece]

function AdmissionAysCreate(){

    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date())
    
    const [admission_ays, setadmission_ays] = useState({title: "", started_at: new Date(), ended_at: new Date(), status: ""})
    // const [admission_ays, setadmission_ays] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
    const [schoolOptions, setSchoolOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);
    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()
    // const {id} = useParams()


    useEffect( () => {
        getSchoolsOptions()
        // getadmission_ays()
        // console.log(id)
        console.log(admission_ays)
    },[])

    // Call API to update profile settings changes
    const saveAdmissionAys = async (e) => {

        e.preventDefault()
        console.log('admission_ays', admission_ays)
        // const { ...newadmission_ays} = admission_ays
        const response = await addAdmissionAys({newAdmission_ays: admission_ays})
        // const {error, message, data} = await addExam({exam})
        console.log('response', response)
        // console.log('message', message)
        if(!response || response==null || response.error){
            dispatch(showNotification({message : "Gagal Menambahkan Seleksi", status : 0}))
        }else if(!response.error) {
            console.log("masuk")
            dispatch(showNotification({message : response.message, status : 1}))
            navigate("/ad/admission_ayss/detail/"+response.data)
        }else{
            dispatch(showNotification({message : "Gagal Menambahkan Seleksi", status : 0}))
        }
        // e.preventDefault()
        // console.log(admission_ays)
        // const {school_id, ...newadmission_ays} = admission_ays
        // const {error, message, data} = addadmission_ays({newadmission_ays, school_id: admission_ays.school_id})
        // if(!error){
        
        //     dispatch(showNotification({message : message, status : 1}))    
        // }
    }

 
    // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
    //     setadmission_ays((admission_ays) =>({...admission_ays, [nameInput]: value}))
    //     // console.log(updateType)
    // }
    const updateFormValue = ({updateType, nameInput, value}) => {
        console.log('nameInput', nameInput, value)
        admission_ays[nameInput] = value
        console.log('admission_ays>', admission_ays)
        // setadmission_ays( (data) =>  ({...data, [nameInput]: value}))

        // console.log(updateType)
    }

    const getSchoolsOptions = async () => {
        let { data: schools, error } = await supabase
            .from('schools')
            .select('*')
            console.log(schools)
            if(!error){
                setSchoolOptions(schools)
                schools.map((e)=>(
                        // setadmission_aysOptions( e => {
                        schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
                    ))
                    console.log(schoolOptions)
            // //     // admission_ayssOptions e.name

            // }))
            // name: admission_ays
            // setadmission_aysOptions(admission_ays => {.})
        }
    }

    // const handledSubmit = (e) => {
    //     e.preventDefault()


    // }



    const admission_ayssOptions2 = [
        {name : "Today", value : "TODAY"},
        {name : "Yesterday", value : "YESTERDAY"},
        {name : "This Week", value : "THIS_WEEK"},
        {name : "Last Week", value : "LAST_WEEK"},
        {name : "This Month", value : "THIS_MONTH"},
        {name : "Last Month", value : "LAST_MONTH"},
    ]

    return(
        <>
            
            <TitleCard title="Tambah Seleksi" topMargin="mt-2">
                <form onSubmit={() => saveAdmissionAys()}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <InputText labelTitle="Nama" nameInput="title"  required={true} containerStyle="w-120" defaultValue={admission_ays.title} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Nama" nameInput="id"  required={true} containerStyle="w-120" defaultValue={admission_ays.id} updateFormValue={updateFormValue}/>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <InputDateTimePicker labelTitle="Waktu Mulai"  required={true} nameInput="started_at" containerStyle="w-52" defaultValue={admission_ays.started_at} updateFormValue={updateFormValue}/>
                        <InputDateTimePicker labelTitle="Waktu Selesai" nameInput="ended_at" defaultValue={admission_ays.ended_at} containerStyle="w-52" updateFormValue={updateFormValue}/>
                        {/* defaultValue={admission_ays.started_at?admission_ays.started_at:new Date()} */}
                        
                        {/* <InputText labelTitle="Maksimal Peserta" type="number" name="max_participants" defaultValue={admission_ays.description} updateFormValue={updateFormValue}/> */}
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
                        {/* <InputText labelTitle="Status Pendaftaran" nameInput="status"  required={true} defaultValue={admission_ays.status} updateFormValue={updateFormValue}/> */}
                        {/* <InputText labelTitle="Kuota Pendaftaran"  type="number" nameInput="max_participants" defaultValue={admission_ays.max_participants} updateFormValue={updateFormValue} containerStyle="w-72"/> */}
                        {/* <InputDateTime labelTitle="Waktu Mulai" name="started_at" defaultValue={admission_ays.started_at} updateFormValue={updateFormValue}/>
                        <InputDateTime labelTitle="Waktu Selesai" name="ended_at" defaultValue={admission_ays.ended_at} updateFormValue={updateFormValue}/> */}
                        {/* <InputText labelTitle="Skema" name="scheme" defaultValue={admission_ays.scheme} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Tipe" name="type" defaultValue={admission_ays.type} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Lokasi" name="location" defaultValue={admission_ays.location} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Ruangan" name="room" defaultValue={admission_ays.room} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Acak Soal" name="is_random_question" defaultValue={true} type="radio" updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Acak Jawaban" name="is_random_answer" defaultValue={true}  type="radio" updateFormValue={updateFormValue}/> */}

                        {/* <SelectBox labelTitle="Jadwal" defaultValue="" updateFormValue={updateFormValue}/> */}
                    {/* <InputText labelTitle="Waktu Mulai" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Waktu Selesai" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/>
                    <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/> */}
                </div>
                {/* <InputText labelTitle="Tahun Ajaran" nameInput="ta"  required={true} containerStyle="w-120" placeholder="2025/2026" defaultValue={admission_ays.ta} updateFormValue={updateFormValue}/> */}
                <ToogleInput  labelTitle="Status Pendaftaran" nameInput="status" defaultValue={false} containerStyle="flex flex-grow justify-between item-center" updateFormValue={updateFormValue}/>
                </div>
                <div className="divider" ></div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
                    </div> */}

                <div className="mt-16"><button className="btn btn-primary float-right bg-green-700 hover:bg-green-600 text-gray-50 dark:text-gray-100" type="submit">Simpan</button></div>
                </form>
                {/* onClick={() => updateadmission_ayss()} */}
            </TitleCard>
            
        </>
    )
}


export default AdmissionAysCreate