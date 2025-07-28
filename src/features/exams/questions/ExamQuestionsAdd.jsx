import React, { useEffect, useRef, useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
// import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification } from '../../common/headerSlice'
import InputText from '../../../components/Input/InputText'
import InputTextRadio from '../../../components/Input/InputTextRadio'
import SelectBox from "../../../components/Input/SelectBox"
import TextAreaInput from '../../../components/Input/TextAreaInput'
import ToogleInput from '../../../components/Input/ToogleInput'
import InputDateTime from "../../../components/Input/InputDateTime"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import {ClassicEditor} from 'ckeditor5'
import CustomUploadAdapterPlugin from "./CustomUpload"
import { useForm } from "react-hook-form"

import supabase from "../../../services/database-server"
import {addQuestion} from "../../../services/api/questions"

import DateTimePicker from 'react-datetime-picker'
import { useNavigate, useParams } from "react-router-dom"
import InputDateTimePicker from "../../../components/Input/InputDateTimePicker"
// import {}
// import addQuestion


const ExamQuestionAdd = () => {

    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date())
    const btnAddQuestion = useRef(null)
    const btnAddOption = useRef(null)
    
    const [exam, setExam] = useState({name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "", schedule_id: "" })
    // exam_category_id: "",
    // const [schedule, setSchedule] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
    const [schemeOptions, setSchemeOptions] = useState([{name: "Online", value: "online"},{name: "Offline", value: "offline"}])
    const [typeOptions, setTypeOptions] = useState([{name: "Pilihan Ganda", value: "MC"},{name: "Benar Salah", value: "BS"},{name: "Essay Singkat", value: "ES"},{name: "Essay", value: "E"}])
    const [schedulesOptions, setScheduleOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState(null);
    const checked = false
    const navigate = useNavigate()
    const {register, handleSubmit} = useForm()

    const updateFormValue = ({updateType, nameInput, value}) => {
        console.log('nameInput', nameInput, value)
        exam[nameInput] = value
        console.log('exam>', exam)
        // setSchedule( (data) =>  ({...data, [nameInput]: value}))

        // console.log(updateType)
    }

    const addQuestion_ = () => {

    }
    const addOption_ = () => {

    }

    const saveQuestion = async (e) => {
        e.preventDefault()

        console.log('exam in ad', exam)
        const {schedule_id, ...newExam} = exam
        const response = await addQuestion({newExam, schedule_id})
        // const {error, message, data} = await addExam({exam})
        console.log('response', response)
        // console.log('message', message)
        if(!response || response==null || response.error){
            dispatch(showNotification({message : "Gagal Menambahkan data Ujian", status : 0}))
        }else if(!response.error) {
            console.log("masuk")
            dispatch(showNotification({message : response.message, status : 1}))
        navigate("/ad/exams/detail/"+response.data)
        }else{
            dispatch(showNotification({message : "Gagal Menambahkan data Ujian", status : 0}))
        }
    }

    
    
    
return (
    <><TitleCard title="Tambah Soal" topMargin="mt-2">
                <form onSubmit={saveQuestion}>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
                        <h5 className="flex flex-row w-1/6">No.</h5>
                        <h5 className="flex flex-row w-3/6 justify-items-center items-center">Soal</h5>
                        <h5 className="flex flex-row w-2/6 justify-items-center items-center" >Jawaban</h5>
                    </div>
                    <div className="divider"></div>
                    <div className="grid grid-cols-3 md:grid-cols-2 gap-6">
                        <InputText labelTitle="" nameInput={`order`+1} updateFormValue={updateFormValue} containerStyle={' w-1/6'}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 w-3/6 gap-6">
                         <CKEditor
                            editor={ClassicEditor}
                            config={{
                                extraPlugins: [CustomUploadAdapterPlugin],
                                toolbar: {
                                items: [
                                    // ... other toolbar items
                                    'imageUpload', // Ensure imageUpload button is in the toolbar
                                    // ...
                                ],
                                },
                            }}
                            data="<p>Hello from CKEditor 5!</p>"
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                console.log({ event, editor, data });
                            }}
                            /> 
                        {/* <div className="flex flex-row w-1/6"> */}
                        {/* <InputText labelTitle="" nameInput={`order`+1} updateFormValue={updateFormValue} containerStyle={' w-1/6'}/> */}

                        {/* </div> */}
                        <div className="flex flex-row  ">
                            <button ref={btnAddQuestion} onClick={()=>addQuestion_()} className="btn flex bg-green-600 text-gray-200 dark:bg-green-500 dark:text-gray-200 ">Tambah Soal</button>
                            <button ref={btnAddOption} onClick={()=>addOption_()} className="btn flex-grow bg-green-600 text-gray-200 dark:bg-green-500 dark:text-gray-200 ">Tambah Jawaban</button>
                            
                        </div>

                </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                        <div className="flex flex-row">
                            <InputText labelTitle="" nameInput="oporderA" updateFormValue={updateFormValue}/>
                            {/* <InputText labelTitle="Ruangan" nameInput="room" updateFormValue={updateFormValue}/> */}
                        </div>
                        <div className="flex">
                            <InputText labelTitle="" nameInput="oporderB" updateFormValue={updateFormValue}/>
                        </div>
                    </div>
                        
                    <div className="divider" ></div>
                    <InputText labelTitle="Nama" nameInput="name" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Deskripsi" nameInput="subtitle" updateFormValue={updateFormValue}/>
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
                    <InputTextRadio labelTitle="Tipe" nameInput="question_type" type="radio" options={typeOptions} defaultValue={'MC'} updateFormValue={updateFormValue}/>
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
                    <InputText labelTitle="Lokasi" nameInput="location" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Ruangan" nameInput="room" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="randomQuestion" nameInput="is_random_question" labelTitle="Acak Soal" defaultValue={true} updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="randomAnswer" nameInput="is_random_answer" labelTitle="Acak Jawaban" defaultValue={true} updateFormValue={updateFormValue}/>
                    <SelectBox
                        nameInput="schedule_id"
                        options={schedulesOptions}
                        labelTitle="Jadwal Ujian"
                        placeholder="Pilih Jadwal"
                        containerStyle="w-72"
                        
                        // labelStyle="hidden"
                        // defaultValue="TODAY"
                        updateFormValue={updateFormValue}
                    />
                    {/* <InputText labelTitle="Acak Soal" type="radio" defaultValue={exam.is_random_question} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Acak Jawaban" defaultValue={exam.is_random_answer} updateFormValue={updateFormValue}/> */}
                    {/* <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/> */}
                {/* </div>
                <div className="divider" ></div> */}

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
                    </div> */}

                <div className="mt-16"><button className="btn btn-primary float-right" type="submit" >Simpan</button></div>
                </form>
                {/* onClick={addExam}  */}
                {/* onClick={() => updateSchedules()} */}
            </TitleCard></>
)
}

export default ExamQuestionAdd
