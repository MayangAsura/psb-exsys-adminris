import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { showNotification } from '../common/headerSlice'
import { openModal } from "../common/modalSlice"
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'

import supabase from "../../services/database-server"
import { useNavigate } from "react-router-dom"
import EyeIcon from "@heroicons/react/24/outline/EyeIcon"

const TopSideButtons = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const []

    const addNewSchedule = () => {
        navigate('/ad/schedules/create')
        // const index= 2
        // dispatch(openModal({title : "Test Modal Title", bodyType : MODAL_BODY_TYPES.TEST_MODAL, 
        //     extraObject : { message : `Are you sure you want to delete this lead?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.TEST_MODAL_DELETE, index}}))
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case bg-green-800 text-gray-300" onClick={() => addNewSchedule()}>Tambah Jadwal</button>
        </div>
    )
}


const TEAM_MEMBERS = [
    {name : "Alex", avatar : "https://reqres.in/img/faces/1-image.jpg", email : "alex@dashwind.com", role : "Owner", joinedOn : moment(new Date()).add(-5*1, 'days').format("DD MMM YYYY"), lastActive : "5 hr ago"},
    {name : "Ereena", avatar : "https://reqres.in/img/faces/2-image.jpg", email : "ereena@dashwind.com", role : "Admin", joinedOn : moment(new Date()).add(-5*2, 'days').format("DD MMM YYYY"), lastActive : "15 min ago"},
    {name : "John", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "jhon@dashwind.com", role : "Admin", joinedOn : moment(new Date()).add(-5*3, 'days').format("DD MMM YYYY"), lastActive : "20 hr ago"},
    {name : "Matrix", avatar : "https://reqres.in/img/faces/4-image.jpg", email : "matrix@dashwind.com", role : "Manager", joinedOn : moment(new Date()).add(-5*4, 'days').format("DD MMM YYYY"), lastActive : "1 hr ago"},
    {name : "Virat", avatar : "https://reqres.in/img/faces/5-image.jpg", email : "virat@dashwind.com", role : "Support", joinedOn : moment(new Date()).add(-5*5, 'days').format("DD MMM YYYY"), lastActive : "40 min ago"},
    {name : "Miya", avatar : "https://reqres.in/img/faces/6-image.jpg", email : "miya@dashwind.com", role : "Support", joinedOn : moment(new Date()).add(-5*7, 'days').format("DD MMM YYYY"), lastActive : "5 hr ago"},

]

const formatDateNew = (date) => {
    const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    date = new Date(date);
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth();
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const dateFormat = `${day}-${month}-${year} ${hour}:${minute} WIB`;
    // const indonesianFormat = `${dayName}, ${day} ${monthName} ${year} ${hour}:${minute} WIB`;
    return dateFormat
  }

function Schedules(){


    const [members, setMembers] = useState(TEAM_MEMBERS)
    const [schedules, setSchedules] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const getRoleComponent = (role) => {
        if(role  === "Admin")return <div className="badge badge-secondary">{role}</div>
        if(role  === "Manager")return <div className="badge">{role}</div>
        if(role  === "Owner")return <div className="badge badge-primary">{role}</div>
        if(role  === "Support")return <div className="badge badge-accent">{role}</div>
        else return <div className="badge badge-ghost">{role}</div>
    }

    useEffect(() => {
        getSchedulesData()
        console.log(schedules)
    },[])

    const getSchedulesData = async () => {
        let { data: schedules, error } = await supabase
            .from('exam_schedules')
            .select('*')

        if(!error){
            setSchedules(schedules)
        }
    }

    const deleteCurrentSchedule = (index) => {
                dispatch(openModal({title : "Konfirmasi", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : `Apakah Anda yakin menghapus jadwal ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.SCHEDULE_DELETE, index}}))
                
        
    }

    const editCurrentSchedule = (index) => {
        navigate(`/ad/schedules/edit/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.SCHEDULE_EDIT}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }
    const detailCurrentSchedule = (index) => {
        navigate(`/ad/schedules/detail/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_DETAIL}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }

    return(
        <>
            {/* <TitleCard></TitleCard> */}
            {/* <TitleCard></TitleCard> */}
            {/* TitleCard */}
            <TitleCard title="Jadwal Ujian" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Waktu Mulai</th>
                        <th>Waktu Selesai</th>
                        <th>Jumlah Peserta</th>
                        <th>Jumlah Kehadiran</th>
                        <th>Update Terakhir</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            schedules.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td className="font-bold text-gray-500 dark:text-gray-200"> {l.name}</td>    
                                    {/* <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-circle w-12 h-12">
                                                    <img src={l.avatar} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{l.name}</div>
                                            </div>
                                        </div>
                                    </td> */}
                                    <td>{formatDateNew(l.started_at)}</td>
                                    <td>{formatDateNew(l.ended_at)}</td>
                                    <td>{l.max_participants}</td>
                                    <td>{l.max_participants}</td>
                                    {/* <td>{getRoleComponent(l.role)}</td> */}
                                    <td>{formatDateNew(l.updated_at)}</td>
                                    <td>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-green-200" onClick={() => detailCurrentSchedule(l.id)}><EyeIcon className="w-5"/></button>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-orange-200" onClick={() => editCurrentSchedule(l.id)}><PencilIcon className="w-5"/></button>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-red-200" onClick={() => deleteCurrentSchedule(l.id)}><TrashIcon className="w-5"/></button>
                                    </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            </TitleCard>
        </>
    )
}


export default Schedules