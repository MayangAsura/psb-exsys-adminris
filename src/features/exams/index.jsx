import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification } from "../common/headerSlice"
import TitleCard from "../../components/Cards/TitleCard"
import { RECENT_TRANSACTIONS } from "../../utils/dummyData"
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import EyeIcon from "@heroicons/react/24/outline/EyeIcon"
import { FaTasks } from "react-icons/fa";
import { openModal } from "../common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'

import SearchBar from "../../components/Input/SearchBar"
import supabase from "../../services/database-server"
import { useNavigate } from "react-router-dom"

const TopSideButtons = ({removeFilter, applyFilter, applySearch}) => {

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const examFilters = ["Online", "Offline"]
    

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
    }, [searchText])
    

    const addNewExam = () => {

        navigate("/ad/exams/create")
        
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    return(
        <div className="inline-block float-right">
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewExam()}>Tambah Ujian</button>
            </div>

            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
            {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {
                        examFilters.map((l, k) => {
                            return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Hapus Filter</a></li>
                </ul>
            </div>
        </div>
    )
}

// const TopSideButtons = () => {


// }




function Exams(){


    const [trans, setTrans] = useState(RECENT_TRANSACTIONS)
    const [examData, setExamData] = useState([])
    const {newNotificationStatus} = useSelector(state => state.header)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        getExamData()
        console.log(examData)
    },[])

    const getExamData = async() => {
    
        let { data: exam_tests, error } = await supabase
            .from('exam_tests')
            .select('*, exam_schedule_tests(exam_schedules(name))')
            .is('deleted_at', null)
            .order('created_at', 'desc')
        // let { data: exam_tests, error } = await supabase
        //     .from('exam_schedule_tests')
        //     .select('exam_schedules(name), exam_tests(*)')

        if(!error){
        setExamData(exam_tests)
        }
            
    }
    const removeFilter = () => {
        setTrans(examData)
    }

    const applyFilter = (params) => {
        let filteredTransactions = examData.filter((t) => {return t.scheme == params.toLowerCase()})
        setTrans(filteredTransactions)
    }

    // Search according to name
    const applySearch = (value) => {
        let filteredTransactions = examData.filter((t) => {return t.name.toLowerCase().includes(value.toLowerCase()) ||  t.exam_schedule_tests[0]?.exam_schedules?.name.toLowerCase().includes(value.toLowerCase()) || t.location.toLowerCase().includes(value.toLowerCase()) || t.room.toLowerCase().includes(value.toLowerCase())})
        setTrans(filteredTransactions)
    }

    const deleteCurrentData = async (index) => {
            console.log(index)
            dispatch(openModal({title : "Konfirmasi", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
            extraObject : { message : `Apakah Anda yakin menghapus ujian ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_DELETE, index}}))

            if(newNotificationStatus==1){
                getExamData()
            }
            // const {schedule_id, ...newExam} = exam
    }
    
    const editCurrentData = (index) => {
        navigate(`/ad/exams/edit/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_EDIT}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }
    const detailCurrentExam = (index) => {
        navigate(`/ad/exams/detail/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_DETAIL}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }
    // const deleteExam = async (e) => {
    //         // e.preventDefault()
    //         console.log(exam)
    //         const {schedule_id, ...newExam} = exam
    //         const response = await addExam({newExam, schedule_id})
    //         // const {error, message, data} = await addExam({exam})
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
    //     }

    return(
        <>
            
            <TitleCard title="Ujian" topMargin="mt-2" TopSideButtons={<TopSideButtons applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter}/>}>
            {/* UJIAN */}
                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Icon</th>
                        <th>Nama</th>
                        <th>Skema</th>
                        <th>Jadwal</th>
                        <th>Lokasi</th>
                        <th>Update Terakhir</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            examData.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                {/* <div className="mask mask-circle w-12 h-12"> */}
                                                    <FaTasks className="rounded-lg bg-green-100 p-2 font-bold w-8 h-8 text-green-300"></FaTasks>
                                                    {/* <img src= alt="Avatar" /> */}
                                                {/* </div> */}
                                            </div>
                                            {/* <div>
                                                <div className="font-bold">{l.name}</div>
                                            </div> */}
                                        </div>
                                    </td>
                                    <td><div className="font-bold dark:text-gray-200">{l.name}</div></td>
                                    {/* text-gray-500 */}
                                    <td><div className={`badge-primary ${l.scheme=='Online'? 'bg-green-400' : 'bg-orange-400'}  font-semibold text-gray-50 rounded-2xl w-16 py-1 px-2`}>{l.scheme}</div> </td>
                                    {/* <td>{l.test_schedule}</td> */}
                                    {/* <td>Ujian Seleksi Jenjang SDIT</td> */}
                                    {/* <td>{l.exam_schedules_test[0].exam_schedules.name}</td> */}
                                    <td>{l.exam_schedule_tests[0]?.exam_schedules?.name}</td>
                                    <td>{l.location}</td>
                                    <td>{l.updated_at??'-'}</td>
                                    <td>
                                        <button className="btn btn-square btn-ghost" onClick={() => detailCurrentExam(l.id)}><EyeIcon className="w-5"/></button>
                                        <button className="btn btn-square btn-ghost" onClick={() => editCurrentData(l.id)}><PencilIcon className="w-5"/></button>
                                        <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentData(l.id)}><TrashIcon className="w-5"/></button>
                                    </td>
                                    {/* <td>{moment(l.date).format("D MMM")}</td> */}
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


export default Exams