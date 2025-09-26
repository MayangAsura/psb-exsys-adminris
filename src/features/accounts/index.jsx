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
import {updateSchedule} from "../../services/api/schedule"

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

function Account(){

    const dispatch = useDispatch()
    const [value, onChange] = useState(new Date())
    
    const [account, setAccount] = useState({name: "", started_at: new Date(), ended_at: new Date(), max_participants: "", school_id: "" })
    // account_category_id: "",
    // const [account, setaccount] = useState({name: "", description: "", started_at: "", ended_at: "", scheme: "", type: "", location: "", room: "", is_random_question: "", is_random_answer: "", max_participants: "" })
    const [schemeOptions, setSchemeOptions] = useState([{name: "Online", value: "online"},{name: "Offline", value: "offline"}])
    const [typeOptions, setTypeOptions] = useState([{name: "Pilihan Ganda", value: "MC"},{name: "Benar Salah", value: "BS"},{name: "Essay Singkat", value: "ES"},{name: "Essay", value: "E"}])
    const [selectedOption, setSelectedOption] = useState(null);
    const [schoolOptions, setSchoolOptions] = useState([])
    // const [account, setaccount] = useState({name: "", started_at: new Date(), ended_at: new Date(), max_participants: "", school_id: "" })
    const checked = false
    const {register, handleSubmit} = useForm()
    const id = useParams().account_id


    useEffect( () => {
        dispatch(setPageTitle({ title : "Info Akun"}))
        getSchoolsOptions()
        // getaccount()
        if(id)
            getaccount(id)
        // console.log(id)
        console.log(id)
        getAccount()
    },[id])

    const getAccount = async () => {
        const { data, error } = await supabase.auth.admin.getUserById()
    }

    // Call API to update profile settings changes
    const saveAccounts = async (e) => {
        e.preventDefault()
        console.log(account)
        const {school_id, ...newaccount} = account
        const response = await updateSchedule({newaccount, id})
        // const {error, message, data} = await addaccount({account})
        console.log('response', response)
        // console.log('message', message)
        if(!response || response==null || response.error){
            dispatch(showNotification({message : "Gagal Memperbarui Jadwal", status : 0}))
        }else if(!response.error) {
            console.log("masuk")
            dispatch(showNotification({message : response.message, status : 1}))
        }else{
            dispatch(showNotification({message : "Gagal Memperbarui Jadwal", status : 0}))
        }
    }

    // const updateaccounts = async (e) => {
    
    //         // e.preventDefault()
    //         console.log(account)
    //         // const {school_id, ...newaccount} = exa
    //         const response = await addaccount({account})
    //         // const {error, message, data} = await addaccount({account})
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
    //         // console.log(account)
    //         // const {school_id, ...newaccount} = account
    //         // const {error, message, data} = addaccount({newaccount, school_id: account.school_id})
    //         // if(!error){
            
    //         //     dispatch(showNotification({message : message, status : 1}))    
    //         // }
    //     }
 
    // const updateSelectBoxValue = ({updateType, nameInput, value}) => {
    //     setaccount((account) =>({...account, [nameInput]: value}))
    //     // console.log(updateType)
    // }
    const updateFormValue = ({updateType, nameInput, value}) => {
        console.log('nameInput', nameInput, value)
        account[nameInput] = value
        console.log('account>', account)
        // setaccount( (data) =>  ({...data, [nameInput]: value}))

        // console.log(updateType)
    }

    const getaccount = async (id) => {
        let { data: exam_account, error } = await supabase
            .from('exam_users')
            .select('*')
            .eq('id', id)
            console.log(exam_account[0])
            if(!error){
                // name: "", subtitle: "", icon: "", started_at: "", ended_at: "", scheme: "", question_type: "", location: "", room: "" 
                setAccount((prev) => ({...prev, name: exam_account[0].name, phone_number: exam_account[0].phone_number, email: exam_account[0].email, last_login: exam_account[0].last_login}))
                console.log('account', account)
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
    //             //         // setaccountOptions( e => {
    //             //         schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
    //             //     ))
    //                 // console.log(schoolOptions)
    //         // //     // accountsOptions e.name

    //         // }))
    //         // name: account
    //         // setaccountOptions(account => {.})
    //     }
    // }

    // const handledSubmit = (e) => {
    //     e.preventDefault()


    // }



    const accountsOptions2 = [
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
                        // setaccountOptions( e => {
                        schoolOptions.push({ name:e.school_id, value: e.school_name})
                        
                    ))
                    console.log('schoolOptions', schoolOptions)
            // //     // accountsOptions e.name

            // }))
            // name: account
            // setaccountOptions(account => {.})
        }
    }

    return(
        <>

            <TitleCard title="Profile Settings" topMargin="mt-2">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Nama" defaultValue={account.name} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="No. Telepon" defaultValue={account.phone_number} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Email" defaultValue={account.email} updateFormValue={updateFormValue}/>
                    {/* <InputText labelTitle="Lok" defaultValue={account.last_login} updateFormValue={updateFormValue}/> */}
                    {/* <InputText labelTitle="Place" defaultValue="California" updateFormValue={updateFormValue}/>
                    <TextAreaInput labelTitle="About" defaultValue="Doing what I love, part time traveller" updateFormValue={updateFormValue}/> */}
                </div>
                <div className="divider" ></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" defaultValue="English" updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" defaultValue="IST" updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={true} updateFormValue={updateFormValue}/>
                </div>

                <div className="mt-16"><button className="btn btn-primary float-right" >Update</button></div>
            </TitleCard>
            {/* <TitleCard title="Akun" topMargin="mt-2">
                <form onSubmit={saveAccounts}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <InputText labelTitle="Nama" nameInput="name" required defaultValue={account.name} updateFormValue={updateFormValue}/>
                        <InputDateTimePicker labelTitle="Waktu Mulai" nameInput="started_at" defaultValue={account.name}  updateFormValue={updateFormValue}/>
                        defaultValue={account.started_at?account.started_at:new Date()}
                        <SelectBox 
                            labelTitle="Jenjang"
                            options={schoolOptions}
                            placeholder="Pilih Jenjang"
                            containerStyle="w-72"
                            nameInput="school_id"
                            defaultValue={account.school_id}
                            // labelStyle="hidden"
                            // defaultValue={schoolOptions.school_id}
                            updateFormValue={updateFormValue}
                        />
                        
                        <InputText labelTitle="Maksimal Peserta" type="number" name="max_participants" defaultValue={account.description} updateFormValue={updateFormValue}/>
                        <InputDateTimePicker labelTitle="Waktu Selesai" nameInput="ended_at" defaultValue={account.ended_at} updateFormValue={updateFormValue}/>
                        <InputText labelTitle="Maksimal Peserta"  type="number" nameInput="max_participants" defaultValue={account.max_participants} updateFormValue={updateFormValue} containerStyle="w-72"/>
                </div>
                <div className="divider" ></div>

                <div className="mt-16"><button className="btn btn-primary float-right bg-green-700 hover:bg-green-600 text-gray-50 dark:text-gray-100" type="submit" >Simpan</button></div>
                </form>

            </TitleCard> */}
            
            
            
        </>
    )
}


export default Account
// import React from 'react'

// function Accounts() {
//   return (
//     // <div>akun</div>

//   )
// }

// export default Accounts