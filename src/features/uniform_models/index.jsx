import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { showNotification } from '../common/headerSlice'
import SearchBar from "../../components/Input/SearchBar"
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon"
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import EyeIcon from "@heroicons/react/24/outline/EyeIcon"
import { openModal } from "../common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'

import supabase from "../../services/database-server"
import { useNavigate } from "react-router-dom"

const TopSideButtons = ({UniformModels, removeFilter, applyFilter, applySearch}) => {

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const uniformModelsFilters = ["Laki-Laki", "Perempuan"]
    

    const showFiltersAndApply = (params) => {
        applyFilter(params)
        setFilterParam(params)
    }

    const removeAppliedFilter = () => {
        removeFilter()
        setFilterParam("")
        setSearchText("")
    }

    useEffect(() => {
        
        if(searchText == ""){
            removeAppliedFilter()
        }else{
            applySearch(searchText)
        }
    }, [UniformModels, searchText])
    

    const addNewUniformModels = () => {
        navigate('/ad/uniform-models/create')
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    return(
        <div className="inline-block float-right">
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewUniformModels()}>Tambah Seragam</button>
            </div>

            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
            {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {
                        uniformModelsFilters.map((l, k) => {
                            return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>
            </div>
        </div>
    )

    // return(
    //     <div className="inline-block float-right">
    //         <div className="inline-block float-right">
    //             <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewParticipant()}>Tambah Peserta</button>
    //         {/* <div className="inline-block float-right"> */}
    //             {/* <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewTeamMember()}>Tambah Peserta</button> */}
    //         </div>

    //         <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
    //         {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
    //         <div className="dropdown dropdown-bottom dropdown-end">
    //             <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
    //             <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
    //                 {
    //                     uniformModelsFilters.map((l, k) => {
    //                         return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
    //                     })
    //                 }
    //                 <div className="divider mt-0 mb-0"></div>
    //                 <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
    //             </ul>
    //         </div>
    //     {/* </div> */}
    //     </div>
    // )
}


const TEAM_MEMBERS = [
    {name : "Alex", avatar : "https://reqres.in/img/faces/1-image.jpg", email : "alex@dashwind.com", role : "Owner", joinedOn : moment(new Date()).add(-5*1, 'days').format("DD MMM YYYY"), lastActive : "5 hr ago"},
    {name : "Ereena", avatar : "https://reqres.in/img/faces/2-image.jpg", email : "ereena@dashwind.com", role : "Admin", joinedOn : moment(new Date()).add(-5*2, 'days').format("DD MMM YYYY"), lastActive : "15 min ago"},
    {name : "John", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "jhon@dashwind.com", role : "Admin", joinedOn : moment(new Date()).add(-5*3, 'days').format("DD MMM YYYY"), lastActive : "20 hr ago"},
    {name : "Matrix", avatar : "https://reqres.in/img/faces/4-image.jpg", email : "matrix@dashwind.com", role : "Manager", joinedOn : moment(new Date()).add(-5*4, 'days').format("DD MMM YYYY"), lastActive : "1 hr ago"},
    {name : "Virat", avatar : "https://reqres.in/img/faces/5-image.jpg", email : "virat@dashwind.com", role : "Support", joinedOn : moment(new Date()).add(-5*5, 'days').format("DD MMM YYYY"), lastActive : "40 min ago"},
    {name : "Miya", avatar : "https://reqres.in/img/faces/6-image.jpg", email : "miya@dashwind.com", role : "Support", joinedOn : moment(new Date()).add(-5*7, 'days').format("DD MMM YYYY"), lastActive : "5 hr ago"},

]

function UniformModels(){


    const {newNotificationMessage, newNotificationStatus} = useSelector(state => state.header)
    const [members, setMembers] = useState(TEAM_MEMBERS)
    const [UniformModels, setUniformModels] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        getUniformModelsData()
        console.log(UniformModels)
    },[])

    const getRoleComponent = (role) => {
        if(role  === "Admin")return <div className="badge badge-secondary">{role}</div>
        if(role  === "Manager")return <div className="badge">{role}</div>
        if(role  === "Owner")return <div className="badge badge-primary">{role}</div>
        if(role  === "Support")return <div className="badge badge-accent">{role}</div>
        else return <div className="badge badge-ghost">{role}</div>
    }

    const getUniformModelsData = async () => {
        let { data: UniformModels, error } = await supabase
            .from('school_uniform_models')
            .select('*, schools(school_name)')
            // .eq('school_id', sch_id)
            .is('deleted_at', null)
            .order('created_at', 'desc')

        if(!error){
            setUniformModels(UniformModels)
        }
    }

    const getEducationUnit = (value) => {
        // if(value)
        return value
        // let { data: UniformModels, error } = await supabase
        //     .from('UniformModels')
        //     .select('*')

        // if(!error){
        //     setUniformModels(UniformModels)
        // }
    }

    const removeFilter = () => {
        setUniformModels(UniformModels)
    }

    const applyFilter = (params) => {
        let filteredTransactions = UniformModels.filter((t) => {return t.gender == params})
        setUniformModels(filteredTransactions)
    }

    // Search according to name
    const applySearch = (value) => {
        let filteredTransactions = UniformModels.filter((t) => {return t.name.toLowerCase().includes(value.toLowerCase()) ||  t.name.toLowerCase().includes(value.toLowerCase())})
        setUniformModels(filteredTransactions)
    }

    const deleteCurrentData = async (index) => {
            console.log(index)
            dispatch(openModal({title : "Konfirmasi", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
            extraObject : { message : `Apakah Anda yakin menghapus seragam ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_DELETE, index}}))

            if(newNotificationStatus==1){
                getUniformModelsData()
            }
            // const {schedule_id, ...newExam} = exam
    }
    
    const editCurrentData = (index) => {
        navigate(`/ad/uniform-models/edit/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_EDIT}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }
    const detailCurrentExam = (index) => {
        navigate(`/ad/uniform-models/detail/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_DETAIL}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

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

    return(
        <>
            
            <TitleCard title="Model Seragam" topMargin="mt-2" TopSideButtons={<TopSideButtons UniformModels={UniformModels} applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter}/>}>

                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Model</th>
                        <th>Kode</th>
                        <th>Jenis Kelamin</th>
                        <th>Jenjang</th>
                        {/* <th>Status Seleksi</th>
                        <th>Pembayaran</th>
                        <th>Kelengkapan Formulir</th>
                        <th>Kelengkapan Pengukuran Seragam</th> */}
                        <th>Update Terakhir</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            UniformModels.map((l, k) => {
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
                                    <td >{l.model_name}</td>
                                    <td >{l.model_code}</td>
                                    <td >{l.model_gender=='male'?'Laki-Laki':'Perempuan'}</td>
                                    <td >{l.schools?.school_name}</td>
                                    {/* <td className="font-bold ">{l.applicants.regist_number}</td>
                                    <td>{l.applicants.phone_number}</td>
                                    <td>{l.pob}</td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_complete==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_complete==='true'?'Lulus':'Tidak Lulus'}</div></td>
                                    <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</div></td> */}
                                    {/* className={`rounded-2xl w-32 py-1 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-orange-400': 'bg-green-400'}`} */}
                                    {/* <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_draft==='true'?'Lengkap':'Belum Lengkap'}</div></td> */}
                                    {/* className={`rounded-2xl w-24 py-1 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-blue-400': 'bg-gray-400'}`} */}
                                    {/* <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_uniform_Models==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_uniform_Models==='true'?'Selesai':'Belum Lengkap'}</div></td> */}
                                    {/* className={`rounded-2xl w-24 py-1 px-2 text-gray-100 badge ${l.is_uniform_Models==true? 'bg-yellow-400': 'bg-cyan-400'}`} */}
                                    {/* <td>{getEducationUnit(l.Participant_name)}</td>
                                    <td>{l.address}</td> */}
                                    <td>{l.updated_at?formatDateNew(l.updated_at):'-' }</td>
                                    <td>
                                        <button className="btn btn-square btn-ghost" onClick={() => detailCurrentExam(l.id)}><EyeIcon className="w-5"/></button>
                                        <button className="btn btn-square btn-ghost" onClick={() => editCurrentData(l.id)}><PencilIcon className="w-5"/></button>
                                        <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentData(l.id)}><TrashIcon className="w-5"/></button>
                                    </td>
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


export default UniformModels