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
import {addSchedule} from "../../services/api/schedule"

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

function ScheduleCreate(){

    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date())
    
    const [schedule, setSchedule] = useState({name: "", started_at: new Date(), ended_at: new Date(), max_participants: "", school_id: "" })
    // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
    const [schoolOptions, setSchoolOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);
    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()
    // const {id} = useParams()


    useEffect( () => {
        getSchoolsOptions()
        // getSchedule()
        // console.log(id)
        console.log(schedule)
    },[])

    // Call API to update profile settings changes
    const saveSchedules = async (e) => {

        e.preventDefault()
        console.log('schedule', schedule)
        const {school_id, ...newSchedule} = schedule
        const response = await addSchedule({newSchedule, school_id})
        // const {error, message, data} = await addExam({exam})
        console.log('response', response)
        // console.log('message', message)
        if(!response || response==null || response.error){
            dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
        }else if(!response.error) {
            console.log("masuk")
            dispatch(showNotification({message : response.message, status : 1}))
            navigate("/ad/schedules/detail/"+response.data)
        }else{
            dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
        }
        // e.preventDefault()
        // console.log(schedule)
        // const {school_id, ...newSchedule} = schedule
        // const {error, message, data} = addSchedule({newSchedule, school_id: schedule.school_id})
        // if(!error){
        
        //     dispatch(showNotification({message : message, status : 1}))    
        // }
    }

 
    // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
    //     setSchedule((schedule) =>({...schedule, [nameInput]: value}))
    //     // console.log(updateType)
    // }
    const updateFormValue = ({updateType, nameInput, value}) => {
        console.log('nameInput', nameInput, value)
        schedule[nameInput] = value
        console.log('schedule>', schedule)
        // setSchedule( (data) =>  ({...data, [nameInput]: value}))

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
                        // setScheduleOptions( e => {
                        schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
                    ))
                    console.log(schoolOptions)
            // //     // schedulesOptions e.name

            // }))
            // name: schedule
            // setScheduleOptions(schedule => {.})
        }
    }

    // const handledSubmit = (e) => {
    //     e.preventDefault()


    // }



    const schedulesOptions2 = [
        {name : "Today", value : "TODAY"},
        {name : "Yesterday", value : "YESTERDAY"},
        {name : "This Week", value : "THIS_WEEK"},
        {name : "Last Week", value : "LAST_WEEK"},
        {name : "This Month", value : "THIS_MONTH"},
        {name : "Last Month", value : "LAST_MONTH"},
    ]

    return(
        <>
            
            <TitleCard title="Tambah Jadwal" topMargin="mt-2">
                <form onSubmit={saveSchedules}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <InputText labelTitle="Nama" nameInput="name"  required={true} defaultValue={schedule.name} updateFormValue={updateFormValue}/>
                        <InputDateTimePicker labelTitle="Waktu Mulai"  required={true} nameInput="started_at"  updateFormValue={updateFormValue}/>
                        {/* defaultValue={schedule.started_at?schedule.started_at:new Date()} */}
                        <SelectBox 
                            labelTitle="Jenjang"
                            options={schoolOptions}
                            placeholder="Pilih Jenjang"
                            containerStyle="w-72"
                            nameInput="school_id"
                            // labelStyle="hidden"
                            // defaultValue={schoolOptions.school_id}
                            updateFormValue={updateFormValue}
                        />
                        
                        {/* <InputText labelTitle="Maksimal Peserta" type="number" name="max_participants" defaultValue={schedule.description} updateFormValue={updateFormValue}/> */}
                        <InputDateTimePicker labelTitle="Waktu Selesai" nameInput="ended_at" updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Maksimal Peserta"  type="number" nameInput="max_participants" defaultValue={schedule.max_participants} updateFormValue={updateFormValue} containerStyle="w-72"/>
                        {/* <InputDateTime labelTitle="Waktu Mulai" name="started_at" defaultValue={schedule.started_at} updateFormValue={updateFormValue}/>
                        <InputDateTime labelTitle="Waktu Selesai" name="ended_at" defaultValue={schedule.ended_at} updateFormValue={updateFormValue}/> */}
                        {/* <InputText labelTitle="Skema" name="scheme" defaultValue={schedule.scheme} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Tipe" name="type" defaultValue={schedule.type} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Lokasi" name="location" defaultValue={schedule.location} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Ruangan" name="room" defaultValue={schedule.room} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Acak Soal" name="is_random_question" defaultValue={true} type="radio" updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Acak Jawaban" name="is_random_answer" defaultValue={true}  type="radio" updateFormValue={updateFormValue}/> */}

                        {/* <SelectBox labelTitle="Jadwal" defaultValue="" updateFormValue={updateFormValue}/> */}
                    {/* <InputText labelTitle="Waktu Mulai" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Waktu Selesai" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/>
                    <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/> */}
                </div>
                <div className="divider" ></div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
                    </div> */}

                <div className="mt-16"><button className="btn btn-primary float-right bg-green-700 hover:bg-green-600 text-gray-50 dark:text-gray-100" type="submit">Simpan</button></div>
                </form>
                {/* onClick={() => updateSchedules()} */}
            </TitleCard>
            
        </>
    )
}


export default ScheduleCreate