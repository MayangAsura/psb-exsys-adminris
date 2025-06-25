import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { showNotification } from '../common/headerSlice'
import InputText from '../../components/Input/InputText'
import InputTextRadio from '../../components/Input/InputTextRadio'
import SelectBox from "../../components/Input/SelectBox"
import TextAreaInput from '../../components/Input/TextAreaInput'
import ToogleInput from '../../components/Input/ToogleInput'
import InputDateTime from "../../components/Input/InputDateTime"
import { useForm } from "react-hook-form"

import supabase from "../../services/database-server"
import {updateExam} from "../../services/api/exams"

import DateTimePicker from 'react-datetime-picker'
import { useParams } from "react-router-dom"
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

function ScheduleEdit(){

    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date())
    
    const [exam, setExam] = useState({name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "" })
    // exam_category_id: "",
    // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
    const [schemeOptions, setSchemeOptions] = useState([{name: "Online", value: "online"},{name: "Offline", value: "offline"}])
    const [typeOptions, setTypeOptions] = useState([{name: "Pilihan Ganda", value: "MC"},{name: "Benar Salah", value: "BS"},{name: "Essay Singkat", value: "ES"},{name: "Essay", value: "E"}])
    const [selectedOption, setSelectedOption] = useState(null);
    const checked = false
    const {register, handleSubmit} = useForm()
    const {id} = useParams()


    useEffect( () => {
        // getSchoolsOptions()
        // getSchedule()
        getExam(id)
        // console.log(id)
        console.log(exam)
    },[id])

    // Call API to update profile settings changes
    const updateExam = async (e) => {
        // e.preventDefault()
        console.log(exam)
        // const {school_id, ...newSchedule} = exa
        const response = await updateExam({exam})
        // const {error, message, data} = await addExam({exam})
        console.log('response', response)
        // console.log('message', message)
        if(!response || response==null || response.error){
            dispatch(showNotification({message : "Gagal Memperbarui Ujian", status : 0}))
        }else if(!response.error) {
            console.log("masuk")
            dispatch(showNotification({message : response.message, status : 1}))
        }else{
            dispatch(showNotification({message : "Gagal Memperbarui Ujian", status : 0}))
        }
    }
 
    // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
    //     setSchedule((schedule) =>({...schedule, [nameInput]: value}))
    //     // console.log(updateType)
    // }
    const updateFormValue = ({updateType, nameInput, value}) => {
        console.log('nameInput', nameInput, value)
        exam[nameInput] = value
        console.log('exam>', exam)
        // setSchedule( (data) =>  ({...data, [nameInput]: value}))

        // console.log(updateType)
    }

    const getExam = async (id) => {
        let { data: exam, error } = await supabase
            .from('exam_tests')
            .select('*')
            .eq('id', id)
            console.log(exam[0])
            if(!error){
                // name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "" 
                setExam((prev) => ({...prev, name: exam[0].name, subtitle: exam[0].subtitle, icon: exam[0], started_at: exam[0].started_at, ended_at: exam[0].ended_at, scheme: exam[0].scheme, question_type: exam[0].question_type, location: exam[0].location, room: exam[0].room}))
                console.log(exam)
            }
    } 

    const getSchoolsOptions = async () => {
        let { data: schools, error } = await supabase
            .from('schools')
            .select('*')
            console.log(schools)
            if(!error){
                // setSchoolOptions(schools)
                // schools.map((e)=>(
                //         // setScheduleOptions( e => {
                //         schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
                //     ))
                    // console.log(schoolOptions)
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
            
            <TitleCard title="Tambah Ujian" topMargin="mt-2">
                <form onSubmit={handleSubmit(updateExam)}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                    <InputText labelTitle="Nama" nameInput="name" defaultValue={exam.name} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Deskripsi" nameInput="subtitle" defaultValue={exam.subtitle} updateFormValue={updateFormValue}/>
                    {/* <InputText labelTitle="Skema Ujian" defaultValue={exam.scheme} updateFormValue={updateFormValue}/> */}
                    {/* <SelectBox labelTitle="Jadwal" defaultValue="" updateFormValue={updateFormValue}/> */}
                    <SelectBox
                        nameInput="scheme"
                        options={schemeOptions}
                        labelTitle="Skema Ujian"
                        placeholder="Pilih Skema"
                        containerStyle="w-72"
                        // labelStyle="hidden"
                        // defaultValue="TODAY"
                        updateFormValue={updateFormValue}
                    />
                    <InputTextRadio labelTitle="Tipe" nameInput="question_type" type="radio" options={typeOptions} defaultValue={exam.type?exam.type:'MC'} updateFormValue={updateFormValue}/>
                    {/* <SelectBox 
                    options={schedulesOptions}
                    labelTitle="Period"
                    placeholder="Select date range"
                    containerStyle="w-72"
                    labelStyle="hidden"
                    // defaultValue="TODAY"
                    updateFormValue={updateSelectBoxValue}
                /> */}
                    <InputDateTimePicker labelTitle="Waktu Mulai" nameInput="started_at" updateFormValue={updateFormValue}/>
                    <InputDateTimePicker labelTitle="Waktu Selesai" nameInput="ended_at" updateFormValue={updateFormValue}/>
                    
                    {/* <InputText labelTitle="Waktu Mulai" type="date" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/> */}
                    {/* <InputText labelTitle="Waktu Selesai" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/> */}
                    <InputText labelTitle="Lokasi" nameInput="location" defaultValue={exam.location} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Ruangan" nameInput="room" defaultValue={exam.room} updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="randomQuestion" nameInput="is_random_question" labelTitle="Acak Soal" defaultValue={true} updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="randomAnswer" nameInput="is_random_answer" labelTitle="Acak Jawaban" defaultValue={true} updateFormValue={updateFormValue}/>
                    {/* <InputText labelTitle="Acak Soal" type="radio" defaultValue={exam.is_random_question} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Acak Jawaban" defaultValue={exam.is_random_answer} updateFormValue={updateFormValue}/> */}
                    {/* <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/> */}
                </div>
                <div className="divider" ></div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
                    </div> */}

                <div className="mt-16"><button className="btn btn-primary float-right" type="submit" >Simpan</button></div>
                </form>
                {/* onClick={() => updateSchedules()} */}
            </TitleCard>
            
        </>
    )
}


export default ScheduleEdit