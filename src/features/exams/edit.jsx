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
// import {updateExam} from "../../services/api/exams"

import supabase from "../../services/database-server"
import {updateExam} from "../../services/api/exams"

import DateTimePicker from 'react-datetime-picker'
import { useNavigate, useParams } from "react-router-dom"
import InputDateTimePicker from "../../components/Input/InputDateTimePicker"
// import DatePicker from 'rsuite/DatePicker';
// import 'rsuite/DatePicker/styles/index.css';
// importing styling datepicker
// import "./css/react-datepicker/react-datepicker.css"

import axios from "axios"
import schools from "../../services/api/schools"
import { type } from "@testing-library/user-event/dist/type"
// import supabase from "../services/database"

// type ValuePiece = Date | null

// type Value = ValuePiece | [ValuePiece, ValuePiece]

export const examSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),        
    subtitle: z.string().min(1, "Nama wajib diisi"),        
    started_at: z.string().min(1, "Waktu Mulai wajid diisi"),
    ended_at: z.string().min(1, "Waktu Selesai wajid diisi"),
    scheme: z.string().min(1, "Nama wajib diisi"),        
    question_type: z.string().min(1, "Nama wajib diisi"),        
    location: z.string().min(1, "Nama wajib diisi"),        
    room: z.string().min(1, "Nama wajib diisi")
})

export const examDefaultValues = {
  name: "",
  subtitle: "",
  started_at: "",
  ended_at: "",
  scheme: "",
  question_type: "",
  location: "",
  room: ""
};

function ExamEdit(){

    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date())
    const navigate = useNavigate()
    const [exam, setExam] = useState({name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "" })
    // exam_category_id: "",
    // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
    const [schemeOptions, setSchemeOptions] = useState([{name: "Online", value: "online"},{name: "Offline", value: "offline"}])
    const [typeOptions, setTypeOptions] = useState([{name: "Pilihan Ganda", value: "MC"},{name: "Benar Salah", value: "BS"},{name: "Essay Singkat", value: "ES"},{name: "Essay", value: "E"}])
    const [selectedOption, setSelectedOption] = useState(null);
    const [schedulesOptions, setScheduleOptions] = useState([])
    const [icon_file_url, setIconFileUrl] = useState("")
    const checked = false
    const {register, handleSubmit, formState: {errors}} = useForm()
    const id = useParams().exam_id


    useEffect( () => {
        dispatch(setPageTitle({ title : "Edit"}))
        getScheduleOptions()
        // getSchedule()
        getExam(id)
        // console.log(id)
        console.log('exam', exam)
    },[id])

    const registerOptions = {
    name: { required: "Harap isi Nama" },
    subtitle: { required: "Harap isi Deskripsi" },
    started_at: { required: "Harap isi Waktu mulai " },
    ended_at: { required: "Harap isi Waktu selesai" },
    schedule_id: { required: "Harap isi Skema" },
    question_type: { required: "Harap isi Tipe Pertanyaan" },
    location: { required: "Harap isi Tipe Lokasi" },
    room: { required: "Harap isi Ruangan" },
    is_random_answer: { required: "Harap isi Ruangan" },
    is_random_question: { required: "Harap isi Ruangan" }
    // is_random_answer: {
    //   required: "Password is required",
    //   minLength: {
    //     value: 8,
    //     message: "Password must have at least 8 characters"
    //   }
    // }
  };

  const getIconLink = async (file) => {
if(file){
        console.log('masuk')
        console.log(file)
        // if(props.options.is_image){
                // const upload = async (props.question.file, name ) => {
                const filepath = `examicon-${Date.now()}`
                // const pid = participant.id?participant.id:participant_id
                const { data_, error_ } = await supabase
                    .storage
                    .from('exams/uploads/exams/icon')
                    .upload("/" + filepath, file,
                    {cacheControl: '3600', upsert: true}
                    )
                if (error_) {
                console.error("Gagal Upload Gambar", error_.message)
                return null
                }
                const { data } = await supabase.storage.from("exams/uploads/exams/icons").getPublicUrl("/" +filepath)
                // const data_url = {
                // path: data.publicUrl
                // }
                
                console.log(data.publicUrl)
                setIconFileUrl(data.publicUrl)
                console.log(icon_file_url)
                // props.newData.icon = data.publicUrl
                // console.log('icon',props.newData.icon)

                // const { files, error } = await supabase
                // .from('exam_test_content_files')
                // .insert([
                //     { exam_test_id: exam_test_contents[0].exam_test_id, exam_test_content_id: exam_test_contents[0].id, exam_test_content_option_id: exam_test_content_options[0].id, file_url: data.publicUrl, file_type: props.question.file_type, is_question: false},
                // ])
                // .select()

                // if(error_ ){
                //     response.error= true
                // response.message= 'Gagal menambahkan data Pertanyaan. Upload gambar gagal.'
                // response.data= null
                // return response
                // }
          
            // }
    }

  }

  
    // Call API to update profile settings changes
    const saveExam = async (e) => {
        e.preventDefault()
        console.log('exam', exam)
        const {schedule_id, ...newExam} = exam
        // getIconLink(newExam.icon)
        // exam['icon'] = icon_file_url
        const response = await updateExam({newExam, schedule_id, id:id})
        // const response = await updateExam({exam})
        // const {error, message, data} = await addExam({exam})
        console.log('response', response)
        // console.log('message', message)
        if(!response || response==null || response.error){
            dispatch(showNotification({message : "Gagal Memperbarui Ujian", status : 0}))
        }else if(!response.error) {
            console.log("masuk")
            dispatch(showNotification({message : response.message, status : 1}))
            navigate("/ad/exams/detail/"+response.data)
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
            .select('*, exam_schedule_tests(exam_schedules(id, name)) ')
            .eq('id', id)
            console.log(exam[0])
            if(!error){
                // name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "" 
                // setExam(exam[0])
                setExam((prev) => ({...prev, name: exam[0].name, subtitle: exam[0].subtitle, icon: exam[0].icon, started_at: exam[0].started_at, ended_at: exam[0].ended_at, scheme: exam[0].scheme, question_type: exam[0].question_type, location: exam[0].location, room: exam[0].room}))
                console.log('exam>', exam)
            }
    } 

    const getScheduleOptions = async () => {
        let { data: schools, error } = await supabase
            .from('exam_schedules')
            .select('*')
            console.log(schools)
            if(!error){
                setScheduleOptions(schools)
                schools.map((e)=>(
                        // setScheduleOptions( e => {
                        schedulesOptions.push({ name:e.id, value: e.name})
                        
                    ))
                    console.log(schedulesOptions)
            // //     // schedulesOptions e.name

            // }))
            // name: schedule
            // setScheduleOptions(schedule => {.})
        }
    }

    const handleEdit = () => {
        console.log('data', exam)
        // e.preventDefault()


    }



    const schedulesOptions2 = [
        {name : "Today", value : "TODAY"},
        {name : "Yesterday", value : "YESTERDAY"},
        {name : "This Week", value : "THIS_WEEK"},
        {name : "Last Week", value : "LAST_WEEK"},
        {name : "This Month", value : "THIS_MONTH"},
        {name : "Last Month", value : "LAST_MONTH"},
    ]

    const handleError = (errors) => {

    }

    // const
    // handleSubmit(handleEdit, handleError)

    return(
        <>
            
            <TitleCard title="Edit Ujian" topMargin="mt-2">
                <form onSubmit={saveExam}>
                    {/* {exam.name} */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                    {/* <div className="">
                        sm:col-span-4
                        <label htmlFor="pas_photo" className="block text-sm/6 font-medium text-gray-900">Pas Photo Background Merah dan Putih (3x4 dan 2x3)
                            <span className="text-red-600">*</span>
                        </label>
                        <p className="text-xs/5 text-gray-600">PNG, JPG, maks 2MB</p>
                        <div className="relative inline-block">
                            <div className="mt-2">
                                <input id="pas_photo" name="pas_photo" onChange={(e) => validateImage(e.target.files[0], 2, 'Pas-Photo')} type="file" className="p-3 w-full text-slate-500 text-sm rounded-sm leading-6 file:absolute file:right-0 file:bg-violet-200 file:text-green-700 file:font-semibold file:border-none file:px-4 file:py-0 file:mr-2 file:rounded-sm hover:file:bg-violet-100 border border-gray-300"
                                accept="image/png, image/jpeg"/>
                                <input id="pas_photo" name="pas_photo" type="file" autoComplete="pas_photo" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                            </div>
                        </div>
                    </div> */}
                    {/* <div className={`form-control w-full rounded-3xl`}>
            <label className="label">
                <span className={"label-text text-base-content "}>Upload Ikon</span>
            </label>
            <div className="flex flex-grow">
            <input name="icon" type="file" onChange={(e) => updateFormValue({nameInput: 'icon', value: e.target.files[0]})} required  className={`input input-bordered w-1/2 text-slate-500 text-sm rounded-sm file:absolute  file:bg-violet-200 file:text-green-700 file:font-semibold file:border-none file:px-4 file:py-0 file:mr-2 file:rounded-sm hover:file:bg-violet-100 border border-gray-300` } 
            
            accept="image/png, image/jpeg" />
<div className="flex flex-1">

                <ul className="flex gap-3 ml-5 justify-center items-start text-center">
                    <li className="" onClick={updateFormValue({nameInput: 'icon', value: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="24" height="24" rx="4" fill="#e8f5e9"/>
  <path d="M7 7h14v2H7V7zm0 8v-2h14v2H7zm0 6v-2h14v2H7zM4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="#2e7d32"/>
</svg>})}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="24" height="24" rx="4" fill="#e8f5e9"/>
  <path d="M7 7h14v2H7V7zm0 8v-2h14v2H7zm0 6v-2h14v2H7zM4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="#2e7d32"/>
</svg></li>
                    <li className="" onClick={updateFormValue({nameInput:'icon', value: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="24" height="24" rx="4" fill="#e8f5e9"/>
  <path d="M7 7h14v2H7V7zm0 8v-2h14v2H7zm0 6v-2h14v2H7zM4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="#2e7d32"/>
</svg>})}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="24" height="24" rx="4" fill="#e8f5e9"/>
  <path d="M7 7h14v2H7V7zm0 8v-2h14v2H7zm0 6v-2h14v2H7zM4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="#2e7d32"/>
</svg></li>
                </ul>
</div>
            </div>
            <div className=" flex flex-grow justify-center items-start">
            </div>
            {...register(nameInput, {required})} 
            <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block" required>
                                            {error[nameInput] && error[nameInput].message}
                                        </span>
        </div>    */}
                    {/* <input type="file" /> */}
                    <InputText labelTitle="Nama" nameInput="name" register={register} registerName="name" defaultValue={exam.name} updateFormValue={updateFormValue}   error_msg={"Harap isi Nama"} required={"true"} inputStyle={" peer invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"}/>
                    <InputText labelTitle="Deskripsi" nameInput="subtitle" register={register} registerName="subtitle" defaultValue={exam.subtitle} updateFormValue={updateFormValue}/>
                    {/* <InputText labelTitle="Skema Ujian" defaultValue={exam.scheme} updateFormValue={updateFormValue}/> */}
                    {/* <SelectBox labelTitle="Jadwal" defaultValue="" updateFormValue={updateFormValue}/> */}
                    <SelectBox
                        nameInput="scheme"
                        options={schemeOptions}
                        labelTitle="Skema Ujian"
                        placeholder="Pilih Skema"
                        containerStyle="w-72"
                        register={register} 
                        registerName="scheme"
                        // labelStyle="hidden"
                        // defaultValue="TODAY"
                        updateFormValue={updateFormValue}
                    />
                    <InputTextRadio labelTitle="Tipe" nameInput="question_type" register={register} registerName="question_type" type="radio" options={typeOptions} defaultValue={exam.type?exam.type:'MC'} updateFormValue={updateFormValue} />
                    {/* <SelectBox 
                    options={schedulesOptions}
                    labelTitle="Period"
                    placeholder="Select date range"
                    containerStyle="w-72"
                    labelStyle="hidden"
                    // defaultValue="TODAY"
                    updateFormValue={updateSelectBoxValue}
                /> */}
                    <InputDateTimePicker labelTitle="Waktu Mulai" nameInput="started_at" register={register} registerName="started_at" defaultValue={exam.started_at} updateFormValue={updateFormValue} />
                    <InputDateTimePicker labelTitle="Waktu Selesai" nameInput="ended_at" register={register} registerName="ended_at" defaultValue={exam.ended_at} updateFormValue={updateFormValue} />
                    
                    {/* <InputText labelTitle="Waktu Mulai" type="date" defaultValue="alex@dashwind.com" updateFormValue={updateFormValue}/> */}
                    {/* <InputText labelTitle="Waktu Selesai" defaultValue="UI/UX Designer" updateFormValue={updateFormValue}/> */}
                    <InputText labelTitle="Lokasi" nameInput="location" register={register} registerName="location" defaultValue={exam.location} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Ruangan" nameInput="room" register={register} registerName="room" defaultValue={exam.room} updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="randomQuestion" nameInput="is_random_question" register={register} registerName="is_random_question" labelTitle="Acak Soal" defaultValue={exam.is_random_question} updateFormValue={updateFormValue} />
                    {/* register={register} registerOptions={registerOptions} error={errors}  */}
                    <ToogleInput updateType="randomAnswer" nameInput="is_random_answer" register={register} registerName="is_random_answer" labelTitle="Acak Jawaban" defaultValue={exam.is_random_answer} updateFormValue={updateFormValue} />
                    {/* {exam.exam_schedule_tests[0].exam_schedules?.id} */}
                    <SelectBox
                        nameInput="schedule_id"
                        // register={register}
                        // registerOptions={registerOptions}  
                        // error={errors}
                        options={schedulesOptions}
                        labelTitle="Pilih Jadwal"
                        placeholder="Pilih Jadwal"
                        containerStyle="w-72"
                        register={register}
                        registerName="schedule_id"
                        // defaultValue={exam.exam_schedule_tests[0]?.exam_schedules?.id}
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

                <div className="mt-16"><button className="btn btn-primary float-right bg-green-700 hover:bg-green-600 text-gray-50 dark:text-gray-100" type="submit">Simpan</button></div>
                </form>
                {/* onClick={() => updateSchedules()} */}
            </TitleCard>
            
        </>
    )
}


export default ExamEdit