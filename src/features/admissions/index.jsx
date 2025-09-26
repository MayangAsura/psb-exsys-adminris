import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { showNotification } from '../common/headerSlice'
import { openModal } from "../common/modalSlice"
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import EyeIcon from "@heroicons/react/24/outline/EyeIcon"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import { useNavigate } from "react-router-dom"

import supabase from "../../services/database-server"


const TopSideButtons = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()


    // const addNewTeamMember = () => {
    //     dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    // }
    const addNewAdmission = () => {
        // navigate('/ad/admissions/create')
        dispatch(openModal({title : "Tambah TA.", bodyType : MODAL_BODY_TYPES.ACADEMIC_YEAR_CREATE,
            extraObject : {message : "", type: CONFIRMATION_MODAL_CLOSE_TYPES.ACADEMIC_YEAR_CREATE_SAVE}
        },
            
        ))
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewAdmission()}>Tambah Seleksi</button>
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

function Admissions(){


    const [members, setMembers] = useState(TEAM_MEMBERS)
    const { newNotificationStatus } = useSelector((state) => state.modal)
    const [Admissions, setAdmissions] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        getSchoolData()
        console.log('Admissions', Admissions)
    },[])

    const getRoleComponent = (role) => {
        if(role  === "Admin")return <div className="badge badge-secondary">{role}</div>
        if(role  === "Manager")return <div className="badge">{role}</div>
        if(role  === "Owner")return <div className="badge badge-primary">{role}</div>
        if(role  === "Support")return <div className="badge badge-accent">{role}</div>
        else return <div className="badge badge-ghost">{role}</div>
    }

    const getSchoolData = async () => {
        let { data: admissions_ays, error } = await supabase
            .from('admission_ays')
            .select('*, admissions(*))')
            // .eq('admission_id', 'e63830b4-c751-4714-9279-fd57c4be5f10')
            .is('deleted_at', null)

        if(!error){
            setAdmissions(admissions_ays)
            // const {admissions, ...newAdmissions} = admissions_ays[0]
            // setAdmissions(newAdmissions)
            // setAdmissions(prev => ({...prev, admissions: admissions}))
            console.log(Admissions)
        }
    }

    const getEducationUnit = (value) => {
        // if(value)
        return value
        // let { data: Admissions, error } = await supabase
        //     .from('Admissions')
        //     .select('*')

        // if(!error){
        //     setAdmissions(Admissions)
        // }
    }

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
  const deleteCurrentAdmission = (index) => {
                dispatch(openModal({title : "Konfirmasi", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : `Apakah Anda yakin menghapus jadwal ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.ADMISSIONS_DELETE, index}}))
                
        if(newNotificationStatus==1){
            getSchoolData()
        }
    }

    const editCurrentAdmission = (index) => {
        // navigate(`/ad/academic-years/edit/${index}`)
         dispatch(openModal({title : "Edit TA.", bodyType : MODAL_BODY_TYPES.ACADEMIC_YEAR_EDIT,
            extraObject : {message : "", type: CONFIRMATION_MODAL_CLOSE_TYPES.ACADEMIC_YEAR_EDIT_SAVE, index: index}
        },
            
        ))
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.SCHEDULE_EDIT}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }
    const detailCurrentAdmission = (index) => {
        navigate(`/ad/academic-years/detail/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_DETAIL}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }

    return(
        <>
            
            <TitleCard title="PSB" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Judul Admissions</th>
                        <th>Tahun Ajaran</th>
                        <th>Tanggal Pendaftaran</th>
                        <th>Tanggal Akhir Pendaftaran</th>
                        <th>Status</th>
                        <th>Update Terakhir</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            Admissions.map((l, k) => {
                                return(
                                    <tr key={k}>
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
                                    <td>{l.admissions.title}</td>
                                    <td>{l.academic_year}</td>
                                    <td>{formatDateNew(l.started_at) }</td>
                                    <td>{formatDateNew(l.ended_at) }</td>
                                    <td><div className={`flex justify-center items-center badge ${l.status=='active'? 'bg-green-400' : 'bg-orange-400'}  font-semibold text-gray-50 rounded-2xl w-16 py-1 px-2`}>{getEducationUnit(l.status)}</div></td>
                                    <td>{formatDateNew(l.updated_at) }</td>
                                    <td>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-green-200" onClick={() => detailCurrentAdmission(l.id)}><EyeIcon className="w-5"/></button>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-orange-200" onClick={() => editCurrentAdmission(l.id)}><PencilIcon className="w-5"/></button>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-red-200" onClick={() => deleteCurrentAdmission(l.id)}><TrashIcon className="w-5"/></button>
                                    </td>
                                    {/* <td>{l.address}</td> */}
                                    {/* <td>{getRoleComponent(l.role)}</td> */}
                                    {/* <td>{l.lastActive}</td> */}
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


export default Admissions