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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import supabase from "../../services/database-server"
import {addExam} from "../../services/api/exams"

import DateTimePicker from 'react-datetime-picker'
import { useNavigate, useParams } from "react-router-dom"
import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
// import DatePicker from 'rsuite/DatePicker';
// import 'rsuite/DatePicker/styles/index.css';
// importing styling datepicker
// import "./css/react-datepicker/react-datepicker.css"

import axios from "axios"
import schools from "../../services/api/schools"
import { root } from "postcss"
// import supabase from "../services/database"

// type ValuePiece = Date | null

// type Value = ValuePiece | [ValuePiece, ValuePiece]
export const scheduleSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),        
    subtitle: z.string().min(1, "Deskripsi wajib diisi"),        
    icon: z.string().min(1, "Ikon wajib diupload"),        
    // started_at: z.string().min(1, "Waktu Mulai wajid diisi"),
    ended_at: z.string().min(1, "Waktu Selesai wajid diisi"),
    scheme: z.string().min(1, "Deskripsi wajib diisi"),        
    question_type: z.string().min(1, "Deskripsi wajib diisi"),        
    location: z.string().min(1, "Deskripsi wajib diisi"),        
    room: z.string().min(1, "Deskripsi wajib diisi"),
    schedule_id: z.string().min(1, "Jenjang wajib diisi")
})

export const scheduleDefaultValues = {
  name: "",
  subtitle: "",
//   icon: "",
  scheme: "",
  question_type: "",
  location: "",
  room: "",
  started_at: "",
  ended_at: "",
  schedule_id: ""  
};


function ExamCreate(){

    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date())
    
    const [exam, setExam] = useState({name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "", schedule_id: "" })
    // exam_category_id: "",
    // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
    const [schemeOptions, setSchemeOptions] = useState([{label: "Online", value: "online"},{label: "Offline", value: "offline"}])
    const [typeOptions, setTypeOptions] = useState([{label: "Pilihan Ganda", value: "MC"},{label: "Benar Salah", value: "BS"},{label: "Essay Singkat", value: "ES"},{label: "Essay", value: "E"}])
    const [schedulesOptions, setScheduleOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);
    const checked = false
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: scheduleDefaultValues,
      });
    // const {id} = useParams()


    useEffect( () => {
        getScheduleOptions()
        // getSchedule()
        // console.log(id)
        console.log(exam)
    },[])

    // Call API to update profile settings changes
    const saveExam = async (e) => {
        e.preventDefault()
        console.log('exam in ad', exam)
        const {schedule_id, ...newExam} = exam
        const response = await addExam({newExam, schedule_id})
        // const {error, message, data} = await addExam({exam})
        console.log('response', response)
        // console.log('message', message)
        if(!response || response==null || response.error){
            dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
        }else if(!response.error) {
            console.log("masuk")
            dispatch(showNotification({message : response.message, status : 1}))
        navigate("/ad/exams/detail/"+response.data)
        }else{
            dispatch(showNotification({message : "Gagal Menambahkan Ujian", status : 0}))
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

    const getScheduleOptions = async () => {
        let { data: exam_schedules, error } = await supabase
            .from('exam_schedules')
            .select('*')
            console.log(exam_schedules)
            if(!error){
                setScheduleOptions(exam_schedules.map(e => ({value: e.id, label: e.name})))
                // exam_schedules.map((e)=>(
                //         // setScheduleOptions( e => {
                //         schedulesOptions.push({ name:e.id, value: e.name})
                        
                //     ))
                    console.log('schedulesOptions', schedulesOptions)
            //     // schedulesOptions e.name

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
                <form onSubmit={saveExam}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                    <InputText labelTitle="Nama" register={register} registerName="name" nameInput="name" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Deskripsi" register={register} registerName="subtitle" nameInput="subtitle" updateFormValue={updateFormValue}/>
                    {/* <InputText labelTitle="Skema Ujian" defaultValue={exam.scheme} updateFormValue={updateFormValue}/> */}
                    {/* <SelectBox labelTitle="Jadwal" defaultValue="" updateFormValue={updateFormValue}/> */}
                    <SelectBox
                        nameInput="scheme"
                        options={schemeOptions}
                        labelTitle="Skema Ujian"
                        placeholder="Pilih Skema"
                        containerStyle="w-72"
                        // defaultValue=
                        // labelStyle="hidden"
                        // defaultValue="TODAY"
                        updateFormValue={updateFormValue}
                    />
                    <InputTextRadio labelTitle="Tipe" register={register} registerName="question_type" nameInput="question_type" type="radio" options={typeOptions} defaultValue={'MC'} updateFormValue={updateFormValue}/>
                    {/* <SelectBox 
                    options={schedulesOptions}
                    labelTitle="Period"
                    placeholder="Select date range"
                    containerStyle="w-72"
                    labelStyle="hidden"
                    // defaultValue="TODAY"
                    updateFormValue={updateSelectBoxValue}
                /> */}
                    <InputDateTimePicker labelTitle="Waktu Mulai" register={register} registerName="started_at" nameInput="started_at" updateFormValue={updateFormValue}/>
                    <InputDateTimePicker labelTitle="Waktu Selesai" register={register} registerName="ended_at" nameInput="ended_at" updateFormValue={updateFormValue}/>
                    
                    {/* <InputText labelTitle="Waktu Mulai" type="date" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/> */}
                    {/* <InputText labelTitle="Waktu Selesai" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/> */}
                    <InputText labelTitle="Lokasi" register={register} registerName="location" nameInput="location" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Ruangan" register={register} registerName="room" nameInput="room" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="randomQuestion" register={register} registerName="is_random_question" nameInput="is_random_question" labelTitle="Acak Soal" defaultValue={true} updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="randomAnswer" register={register} registerName="is_random_answer" nameInput="is_random_answer" labelTitle="Acak Jawaban" defaultValue={true} updateFormValue={updateFormValue}/>
                    <SelectBox
                        nameInput="schedule_id"
                        options={schedulesOptions}
                        labelTitle="Jadwal Ujian"
                        placeholder="Pilih Jadwal"
                        containerStyle="w-72"
                        register={register}
                        registerName="schedule_id"
                        // labelStyle="hidden"
                        // defaultValue="TODAY"
                        updateFormValue={updateFormValue}
                    />
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
                {/* onClick={addExam}  */}
                {/* onClick={() => updateSchedules()} */}
            </TitleCard>
            
        </>
    )
}


export default ExamCreate