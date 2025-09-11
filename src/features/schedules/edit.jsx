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
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import supabase from "../../services/database-server"
import {updateSchedule} from "../../services/api/schedule"

import DateTimePicker from 'react-datetime-picker'
import { useNavigate, useParams } from "react-router-dom"
import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
import dayjs from 'dayjs';
// import DatePicker from 'rsuite/DatePicker';
// import 'rsuite/DatePicker/styles/index.css';
// importing styling datepicker
// import "./css/react-datepicker/react-datepicker.css"

import axios from "axios"
import schools from "../../services/api/schools"
// import supabase from "../services/database"

// type ValuePiece = Date | null

// type Value = ValuePiece | [ValuePiece, ValuePiece]

export const scheduleSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    started_at: z.string().datetime().refine(
                (val) => new Date(val) > new Date(),
                'Waktu mulai harus yang akan datang.'
            ),      
    // started_at: z.string().min(1, "Waktu Mulai wajid diisi"),
    ended_at: z.string().min(1, "Waktu Selesai wajid diisi"),
    max_participants: z.string().min(1, "Maksimal Peserta wajib diisi"),
    school_id: z.string().min(1, "Jenjang wajib diisi")
})

export const scheduleDefaultValues = {
  name: "",
//   started_at: "",
//   ended_at: "",
  max_participants: "",
  school_id: ""  
};

function ScheduleEdit(){

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [value, onChange] = useState(new Date())
    
    const [schedule, setSchedule] = useState({name: "", started_at: dayjs(), ended_at: dayjs(), max_participants: "", school_id: "", admission_ays_id: "" })
    // schedule_category_id: "",
    // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
    const [schemeOptions, setSchemeOptions] = useState([{name: "Online", value: "online"},{name: "Offline", value: "offline"}])
    const [typeOptions, setTypeOptions] = useState([{name: "Pilihan Ganda", value: "MC"},{name: "Benar Salah", value: "BS"},{name: "Essay Singkat", value: "ES"},{name: "Essay", value: "E"}])
    const [selectedOption, setSelectedOption] = useState(null);
    const [schoolOptions, setSchoolOptions] = useState([])
    const [admissionsOptions, setAdmissionsOptions] = useState([])
    // const [schedule, setSchedule] = useState({name: "", started_at: new Date(), ended_at: new Date(), max_participants: "", school_id: "" })
    const checked = false
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: scheduleDefaultValues,
      });
    const id = useParams().schedule_id


    useEffect( () => {
        dispatch(setPageTitle({ title : "Edit"}))
        getSchoolsOptions()
        getAdmissionOptions()
        // getSchedule()
        if(id)
            getSchedule(id)
        // console.log(id)
        console.log(id)
    },[id])

    // Call API to update profile settings changes
    const saveSchedules = async (e) => {
        e.preventDefault()
        console.log(schedule)
        const {school_id, ...newSchedule} = schedule
    const response = await updateSchedule({newSchedule, id, school_id})
        // const {error, message, data} = await addschedule({schedule})
        console.log('response', response)
        // console.log('message', message)
        if(!response || response==null || response.error){
            dispatch(showNotification({message : "Gagal Memperbarui Jadwal", status : 0}))
        }else if(!response.error) {
            console.log("masuk")
            dispatch(showNotification({message : response.message, status : 1}))
            navigate('/ad/schedules/detail/'+id)
        }else{
            dispatch(showNotification({message : "Gagal Memperbarui Jadwal", status : 0}))
        }
    }

    // const updateSchedules = async (e) => {
    
    //         // e.preventDefault()
    //         console.log(schedule)
    //         // const {school_id, ...newSchedule} = exa
    //         const response = await addSchedule({schedule})
    //         // const {error, message, data} = await addschedule({schedule})
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
    //         // console.log(schedule)
    //         // const {school_id, ...newSchedule} = schedule
    //         // const {error, message, data} = addSchedule({newSchedule, school_id: schedule.school_id})
    //         // if(!error){
            
    //         //     dispatch(showNotification({message : message, status : 1}))    
    //         // }
    //     }
 
    // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
    //     setSchedule((schedule) =>({...schedule, [nameInput]: value}))
    //     // console.log(updateType)
    // }
    // const updateFormValue = ({updateType, nameInput, value, newValue=null}) => {
    //     console.log('nameInput', nameInput, value, newValue)
    //     schedule[nameInput] = value?value:newValue
    //     // setSchedule(prev => ({...prev, [nameInput]:value}))
    //     console.log('schedule>', schedule)
    //     // setSchedule( (data) =>  ({...data, [nameInput]: value}))

    //     // console.log(updateType)
    // }
    const updateFormValue = ({updateType, nameInput, value, newValue=null}) => {
        console.log('nameInput', nameInput, value, newValue)
        schedule[nameInput] = value?value:newValue

        console.log('schedule>', schedule)
        // setSchedule({...schedule, nameInput: value?value:newValue})
        // setSchedule( (data) =>  ({...data, [nameInput]: value}))

        // console.log(updateType)
    }

    const handleDateChange = (date, nameInput, newValue) =>{
    // const formatedDate = dayjs(date).format("MMMM DD, YYYY hh:mm A");
    // schedule[nameInput] = date
    // setFormValues({...formValues,[dateType]:date})

  }

    const handleStartDateChange = (date) => {
        const formattedDate = date ? date.toISOString() : "";
        // schedule["started_at"] = formattedDate
        // setValue("started_at", formattedDate, { shouldValidate: true });
    }

    const handleEndDateChange = (date) => {
        const formattedDate = date ? date.toISOString() : "";
        // schedule["ended_at"] = formattedDate
        // setValue("ended_at", formattedDate, { shouldValidate: true });
    }

    const getSchedule = async (id) => {
        let { data: exam_schedule, error } = await supabase
            .from('exam_schedules')
            .select('*, exam_schedule_schools(*)')
            .eq('id', id)
            console.log('exam_schedule[0]', exam_schedule[0])
            if(!error){
                // name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "" 
                setSchedule((prev) => ({...prev, name: exam_schedule[0].name, max_participants: exam_schedule[0].max_participants, 
                    started_at: exam_schedule[0].started_at, ended_at: exam_schedule[0].ended_at, school_id: exam_schedule[0].exam_schedule_schools[0]?.school_id?exam_schedule[0].exam_schedule_schools[0]?.school_id:exam_schedule[0].school_id , admission_ays_id: exam_schedule[0].admission_ays_id}))
                console.log('schedule', schedule)
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
    //             //         // setScheduleOptions( e => {
    //             //         schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
    //             //     ))
    //                 // console.log(schoolOptions)
    //         // //     // schedulesOptions e.name

    //         // }))
    //         // name: schedule
    //         // setScheduleOptions(schedule => {.})
    //     }
    // }

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

    const getAdmissionOptions = async () => {
        let { data: schools, error } = await supabase
            .from('admission_ays')
            .select('*')
            console.log(schools)
            if(!error){
                // setSchoolOptions(schools)
                setAdmissionsOptions(
                    schools.map((e)=>(
                        // setScheduleOptions( e => {
                        { value:e.id, label: e.academic_year}
                        
                    ))
                )
                    console.log(admissionsOptions)
            // //     // schedulesOptions e.name

            // }))
            // name: schedule
            // setScheduleOptions(schedule => {.})
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
                setSchoolOptions(schools.map((e) => {return { value:e.school_id, label: e.school_name}}))
                    console.log('schoolOptions', schoolOptions)
            // //     // schedulesOptions e.name

            // }))
            // name: schedule
            // setScheduleOptions(schedule => {.})
        }
    }

    return(
        <>
            <TitleCard title="Edit Jadwal" topMargin="mt-2">
                <form onSubmit={saveSchedules}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputText labelTitle="Nama" nameInput="name" required={true} register={register} registerName="name" defaultValue={schedule.name} errors={errors.name} error_msg={errors.name?.message??null} updateFormValue={updateFormValue}/>
                            <InputDateTimePicker labelTitle="Waktu Mulai" required={true} register={register} registerName="started_at" defaultValue={schedule.started_at} errors={errors.started_at} error_msg={errors.started_at?.message??null} nameInput="started_at" handleStartDateChange={handleStartDateChange} handleDateChange={handleDateChange} updateFormValue={updateFormValue}/>
                            {/* {/* defaultValue={schedule.started_at?schedule.started_at:new Date()} */}
                            <InputText labelTitle="Maksimal Peserta" type="text" nameInput="max_participants" error={errors.max_participants} error_msg={errors.max_participants?.message} register={register} registerName="max_participants" defaultValue={schedule.max_participants||0} updateFormValue={updateFormValue}/> 
                            <InputDateTimePicker labelTitle="Waktu Selesai" required={true} nameInput="ended_at" defaultValue={schedule.ended_at} error={errors.ended_at} error_msg={errors.ended_at?.message} register={register} registerName="ended_at" handleEndDateChange={handleEndDateChange} handleDateChange={handleDateChange} updateFormValue={updateFormValue}/>
                            <SelectBox 
                                labelTitle="Jenjang"
                                options={schoolOptions}
                                placeholder="Pilih Jenjang"
                                containerStyle="w-full"
                                register={register} 
                                registerName="school_id"
                                nameInput="school_id"
                                error={errors.school_id}
                                error_msg={errors.school_id?.message}
                                // placeholder={"Pilih Jadwa"}
                                // labelStyle="hidden"
                                defaultValue={schedule.school_id}
                                updateFormValue={updateFormValue}
                            /> 
                            
                            {/* <InputText labelTitle="Maksimal Peserta" type="number" name="max_participants" defaultValue={schedule.description} updateFormValue={updateFormValue}/> */}
                            {/* <SelectBox 
                                labelTitle="Jenjang"
                                options={schoolOptions}
                                placeholder="Pilih Jenjang"
                                containerStyle="w-full"
                                register={register} 
                                registerName="ta_id"
                                nameInput="ta_id"
                                // labelStyle="hidden"
                                // defaultValue={schoolOptions.school_id}
                                updateFormValue={updateFormValue}
                            /> */}
                            <SelectBox 
                                labelTitle="Tahun Ajaran"
                                options={admissionsOptions}
                                placeholder="Pilih TA."
                                containerStyle="w-full"
                                register={register} 
                                registerName="admission_ays_id"
                                nameInput="admission_ays_id"
                                defaultValue={schedule.admission_ays_id}
                                // labelStyle="hidden"
                                // defaultValue={schoolOptions.school_id}
                                updateFormValue={updateFormValue}
                            />
                        
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

                <div className="mt-16"><button className="btn btn-primary float-right bg-green-700 hover:bg-green-600 text-gray-50 dark:text-gray-100" type="submit" >Simpan</button></div>
                </form>
                {/* onClick={() => updateSchedules()} */}
            </TitleCard>
            
            
            
        </>
    )
}


export default ScheduleEdit