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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"

import supabase from "../../services/database-server"
import {addSchedule} from "../../services/api/schedule"

import DateTimePicker from 'react-datetime-picker'
import { useNavigate, useParams } from "react-router-dom"
import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
// import {
//   Input,
//   NumberInput,
//   DateInput,
//   SelectInput,
//   ReactSelectInput,
//   CheckboxInput,
//   SubmitInput,
// } from "../../components/NewInput/index";
// import DatePicker from 'rsuite/DatePicker';
// import 'rsuite/DatePicker/styles/index.css';
// importing styling datpepicker
// import "./css/react-datepicker/react-datepicker.css"

import axios from "axios"
import schools from "../../services/api/schools"
// import supabase from "../services/database"

// type ValuePiece = Date | null

// type Value = ValuePiece | [ValuePiece, ValuePiece]

export const scheduleSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),        
    // started_at: z.string().optional(),
    // ended_at: z.string().optional(),
    started_at: z.string().datetime().refine(
            (val) => new Date(val) > new Date(),
            'Waktu mulai harus yang akan datang.'
        ),
    ended_at: z.string().min(1, "Waktu Selesai wajib diisi"),
    max_participants: z.string().min(1, "Maksimal Peserta wajib diisi"),
    school_id: z.string().min(1, "Jenjang wajib diisi")
})

export const scheduleDefaultValues = {
  name: "",
  started_at: "",
  ended_at: "",
  max_participants: "",
  school_id: ""  
};

function ScheduleCreate(){

    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date())
    
    const [schedule, setSchedule] = useState({name: "", started_at: new Date(), ended_at: new Date(), max_participants: "", school_id: "" })
    // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
    const [schoolOptions, setSchoolOptions] = useState([])
    const [admissionsOptions, setAdmissionsOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);
    
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: scheduleDefaultValues,
  });
    const navigate = useNavigate()
    // const {id} = useParams()


    useEffect( () => {
        getSchoolsOptions()
        getAdmissionOptions()
        // getSchedule()
        // console.log(id)
        console.log(schedule)
    },[])

    // Call API to update profile settings changes
    const saveSchedules = async (e) => {

        e.preventDefault()
        console.log('schedule', schedule)
        // started_at: new Date(), ended_at: new Date(), max_participants: "", school_id: "" 
        if(schedule.name=="" || schedule.started_at=="" || schedule.ended_at=="" || schedule.max_participants=="" || schedule.school_id==""){
            dispatch(showNotification({message : "Gagal Menambahkan Jadwal. Data tidak valid.", status : 0}))
            return
        }
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
    const updateFormValue = ({updateType, nameInput, value, newValue=null}) => {
        console.log('nameInput', nameInput, value, newValue)
        schedule[nameInput] = value?value:newValue
        // setSchedule(prev => ({...prev, [nameInput]:value}))
        console.log('schedule>', schedule)
        // setSchedule( (data) =>  ({...data, [nameInput]: value}))

        // console.log(updateType)
    }

    const handleStartDateChange = (date) => {
        const formattedDate = date ? date.toISOString() : "";
        // setValue("started_at", formattedDate, { shouldValidate: true });
    }

    const handleEndDateChange = (date) => {
        const formattedDate = date ? date.toISOString() : "";
        // setValue("ended_at", formattedDate, { shouldValidate: true });
    }

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
                setSchoolOptions(
                    schools.map((e)=>(
                        // setScheduleOptions( e => {
                        { value:e.school_id, label: e.school_name}
                        
                    ))
                )
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
                {/* <FormProvider > */}
                    {/*<form onSubmit={handleSubmit(onSubmit)}>
                     <div className="grid grid-cols-3 gap-4">
                        <Input
                            type="text"
                            label="First Name"
                            placeholder="Enter your First Name"
                            name="firstName"
                            errors={errors}
                        />
                        <Input
                            type="text"
                            label="Middle Name"
                            placeholder="Enter your Middle Name"
                            name="middleName"
                            errors={errors}
                        />
                        <Input
                            type="text"
                            label="Last Name"
                            placeholder="Enter your Last Name"
                            name="lastName"
                            errors={errors}
                        />
                        <DateInput
                            label="Birth Date"
                            name="birthDate"
                            errors={errors}
                            placeholder="Enter your DOB"
                        />
                        <Input
                            type="email"
                            label="Email"
                            placeholder="Enter your email"
                            name="email"
                            errors={errors}
                        />
                        <Input
                            type="text"
                            label="Phone Number"
                            placeholder="Enter your phone number"
                            name="phoneNumber"
                            errors={errors}
                        />
                        <SelectInput
                            name="gender"
                            label="Select Gender"
                            errors={errors}
                            options={genderOptions}
                        />
                        <Input
                            type="time"
                            label="Start Time"
                            name="startAt"
                            errors={errors}
                            placeholder="Enter the start time"
                        />
                        <Input
                            type="time"
                            label="End Time"
                            name="endAt"
                            errors={errors}
                            placeholder="Enter the start time"
                        />
                        <Input
                            type="text"
                            label="Job Position"
                            name="jobPosition"
                            errors={errors}
                            placeholder="Enter the job position"
                        />
                        <ReactSelectInput
                            isMulti={true}
                            name="teams"
                            label="Select Teams"
                            errors={errors}
                            options={designationOptions}
                        />
                        <ReactSelectInput
                            isMulti={false}
                            name="designation"
                            label="Select Designation"
                            errors={errors}
                            options={designationOptions}
                        />
                        <NumberInput
                            label="Billable Hours"
                            placeholder="Enter the billable hours"
                            name="billableHours"
                            errors={errors}
                        />
                        <CheckboxInput
                            label="Is Billable"
                            name="billable"
                            errors={errors}
                        />
                        </div>
                        <div className="flex justify-center">
                        <SubmitInput />
                        </div>
                    </form> */}
                    <form onSubmit={saveSchedules}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <InputText labelTitle="Nama" nameInput="name" required={true} register={register} registerName="name" defaultValue={schedule.name} errors={errors.name} error_msg={errors.name?.message??null} updateFormValue={updateFormValue}/>
                            <InputDateTimePicker labelTitle="Waktu Mulai" required={true} register={register} registerName="started_at" errors={errors.started_at} error_msg={errors.started_at?.message??null} nameInput="started_at" handleStartDateChange={handleStartDateChange} updateFormValue={updateFormValue}/>
                            {/* {/* defaultValue={schedule.started_at?schedule.started_at:new Date()} */}
                            <InputText labelTitle="Maksimal Peserta" type="text" nameInput="max_participants" error={errors.max_participants} error_msg={errors.max_participants?.message} register={register} registerName="max_participants" defaultValue={schedule.max_participants||0} updateFormValue={updateFormValue}/> 
                            <InputDateTimePicker labelTitle="Waktu Selesai" nameInput="ended_at" error={errors.ended_at} error_msg={errors.ended_at?.message} register={register} registerName="ended_at" handleEndDateChange={handleEndDateChange} updateFormValue={updateFormValue}/>
                            <SelectBox 
                                labelTitle="Jenjang"
                                options={schoolOptions}
                                placeholder="Pilih Jenjang"
                                containerStyle="w-full"
                                register={register} 
                                registerName="school_id"
                                nameInput="school_id"
                                error={errors.name}
                                error_msg={errors.name?.message}
                                // placeholder={"Pilih Jadwa"}
                                // labelStyle="hidden"
                                // defaultValue={schoolOptions.school_id}
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
                            <InputText labelTitle="Acak Jawaban" name="is_random_answer" defaultValue={true}  type="radio" updateFormValue={updateFormValue}/>

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
                {/* </FormProvider> */}
                {/* onClick={() => updateSchedules()} */}
            </TitleCard>
            
        </>
    )
}


export default ScheduleCreate