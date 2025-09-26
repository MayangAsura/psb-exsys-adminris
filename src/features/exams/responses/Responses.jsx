
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../common/headerSlice'
import TitleCard from '../../../components/Cards/TitleCard'
import supabase from "../../../services/database-server"
import { openModal } from "../../common/modalSlice"
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import EyeIcon from "@heroicons/react/24/outline/EyeIcon"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil'
// import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeaderSR from '../../../components/TabHeader/TabHeaderSR'
import { useNavigate, useParams } from 'react-router-dom'

function ExamResponses(){

    const [trans, setTrans] = useState("")
    const { newNotificationStatus } = useSelector((state) => state.modal)
    const [ExamParticipants, setExamParticipants] = useState([])
    const dispatch = useDispatch()
    const navigate =useNavigate()

    const id = useParams().exam_id
    useEffect(() => {
        getExamParticipants(id)
        console.log(ExamParticipants)
    },[id])

    const getExamParticipants = async(id) => {
    
        let { data: exam_responses, error } = await supabase
            .from('exam_test_responses')
            .select('*, exam_tests!inner(name), exam_profiles!inner(full_name, regist_number), exam_schedule_tests!inner(exam_schedule_schools!inner(schools(school_name)))')
            .eq('exam_test_id', id)

        if(!error){
        setExamParticipants(exam_responses)
        }
            
    }
    const removeFilter = () => {
        setTrans("")
    }

    const applyFilter = (params) => {
        let filteredTransactions = "".filter((t) => {return t.location == params})
        setTrans(filteredTransactions)
    }

    // Search according to name
    const applySearch = (value) => {
        let filteredTransactions = "".filter((t) => {return t.email.toLowerCase().includes(value.toLowerCase()) ||  t.email.toLowerCase().includes(value.toLowerCase())})
        setTrans(filteredTransactions)
    }

    const deleteCurrentResponse = async (index) => {
            console.log(index)
            dispatch(openModal({title : "Konfirmasi", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
            extraObject : { message : `Apakah Anda yakin menghapus response ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.RESPONSE_DELETE, index}}))

            if(newNotificationStatus==1){
                getExamParticipants(index)
            }
            // const {schedule_id, ...newExam} = exam
    }
    
    // const editCurrentResponse = (index) => {
    //     navigate(`/ad/exams/edit/${index}`)
    //     // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_EDIT}))
    //     // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
    //     // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    // }
    const detailCurrentResponse = (index) => {
        console.log(index)
            dispatch(openModal({title : "Detail Jawaban", bodyType : MODAL_BODY_TYPES.EXAM_RESPONSE_DETAIL, 
            extraObject : { message : ``, type : CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_RESPONSE_DETAIL, id, index}}))
        // navigate(`/ad/exams/${id}/responses/detail${index}`)
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
            
                <TabHeaderSR></TabHeaderSR>
            <TitleCard title="Peserta" topMargin="mt-2" >
            {/* UJIAN */}
                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        {/* <th>Icon</th> */}
                        <th>No. Registrasi</th>
                        <th>Nama</th>
                        <th>Jenjang</th>
                        <th>Skor</th>
                        <th>Tanggal Submit</th>
                        <th></th>
                        {/* <th>Lokasi</th>
                        <th>Update Terakhir</th> */}
                    </tr>
                    </thead>
                    <tbody>
                        {
                            ExamParticipants.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td><div className="font-bold">{l.exam_profiles?.regist_number??"-" }</div></td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-circle w-12 h-12">
                                                    {/* <img src={l.icon} alt="Avatar" /> */}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{l.exam_profiles?.full_name??"-"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><div className="font-bold">{l.exam_schedule_tests[0].exam_schedule_schools[0].schools.school_name??"-"}</div></td>
                                    <td><div className="font-bold">{l.score??"0"}</div></td>
                                    <td><div className="font-bold">{l.submit_at?formatDateNew(l.submit_at):"-" }</div></td>
                                    {/* <td><div className="badge-primary font-semibold rounded-2xl w-16 py-1 px-2">{l.test_scheme}</div> </td> */}
                                    {/* <td>{l.test_schedule}</td> */}
                                    {/* <td>Ujian Seleksi Jenjang SDIT</td> */}
                                    {/* <td>{l.exam_schedules_test[0].exam_schedules.name}</td> */}
                                    <td>{l.score}</td>
                                    {/* <td>{l.updated_at}</td> */}
                                    {/* <td>{moment(l.date).format("D MMM")}</td> */}
                                    <td>
                                        <button className="btn btn-square btn-ghost" onClick={() => detailCurrentResponse(l.id)}><EyeIcon className="w-5"/></button>
                                        {/* <button className="btn btn-square btn-ghost" onClick={() => editCurrentResponse(l.id)}><PencilIcon className="w-5"/></button> */}
                                        <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentResponse(l.id)}><TrashIcon className="w-5"/></button>
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


export default ExamResponses
// import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { setPageTitle } from '../../common/headerSlice'
// import TitleCard from '../../../components/Cards/TitleCard'
// import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
// import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
// import SearchBar from "../../../components/Input/SearchBar"
// import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
// import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
// import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
// import { openModal } from "../../common/modalSlice"
// import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil'
// import supabase from "../../../services/database-server"

// import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

// import TabHeaderP from '../../../components/TabHeader/TabHeaderP'
// import { useNavigate, useParams } from 'react-router-dom'

// const TopSideButtons = ({id, removeFilter, applyFilter, applySearch}) => {

//     const [filterParam, setFilterParam] = useState("")
//     const [searchText, setSearchText] = useState("")
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const locationFilters = ["Paris", "London", "Canada", "Peru", "Tokyo"]
    
//     useEffect(() => {
//         console.log('id', id)
//     }, [id])

//     const showFiltersAndApply = (params) => {
//         applyFilter(params)
//         setFilterParam(params)
//     }

//     const removeAppliedFilter = () => {
//         removeFilter()
//         setFilterParam("")
//         setSearchText("")
//     }

//     useEffect(() => {
//         if(searchText == ""){
//             removeAppliedFilter()
//         }else{
//             applySearch(searchText)
//         }
//     }, [searchText])
    

//     const addNewQuestionImportModal = () => {
        
//         dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.QUESTION_ADD_IMPORT, 
//             extraObject: {message: "", type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_QUESTION_IMPORT, index: id, sid: ""}
//         }))
//         // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
//     }
//     const addNewQuestionModal = () => {
//         navigate('/ad/exams/'+id+'/questions/add')
        
//         // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.QUESTION_ADD_MANUAL, 
//         //     extraObject: {message: "", type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_QUESTION_ADD_MANUAL, index: id, sid: ""}
//         // }))
//         // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
//     }
//     const openAddNewLeadModal = () => {
//     }

//     return(
//         <div className="inline-block float-right">
//             <div className="inline-block float-right">
//                 <button className="btn px-6 btn-sm normal-case btn-primary bg-orange-800 hover:bg-orange-600 text-gray-200 dark:text-gray-100" onClick={() => addNewQuestionImportModal()}>Import Pertanyaan</button>
//             </div>
//             <div className="inline-block float-right">
//                 <button className="btn px-6 btn-sm normal-case btn-primary bg-green-800 hover:bg-green-600 text-gray-200 dark:text-gray-100" onClick={() => addNewQuestionModal()}>Tambah Pertanyaan</button>
//             </div>

//             <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
//             {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
//             <div className="dropdown dropdown-bottom dropdown-end">
//                 <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
//                 <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
//                     {
//                         locationFilters.map((l, k) => {
//                             return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
//                         })
//                     }
//                     <div className="divider mt-0 mb-0"></div>
//                     <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
//                 </ul>
//             </div>
//         </div>
//     )
// }

// function ExamResponses(){


//     const [trans, setTrans] = useState("")
//     const [ExamResponses, setExamResponses] = useState([])
//     const dispatch = useDispatch()
//     const options = [
//         {tab: 'Detail', selected: false },
//         {tab: 'Pertanyaan', selected: false },
//         {tab: 'Peserta', selected: false },
//         {tab: 'Respon Peserta', selected: true }
//     ]

//     const id = useParams().exam_id

//     useEffect(() => {
//         getExamResponses(id)
//         console.log(ExamResponses)
//     },[id])

//     const getExamResponses = async(id) => {
    
//         let { data: exam_test_responses, error } = await supabase
//             .from('exam_test_responses')
//             .select('* ')
//             .eq('exam_test_id', id)
//             .is('deleted_at', null)
//             // exam_tests(name, exam_schedule_tests(exam_schedules(exam_schedule_schools(schools(school_name)))))

//         if(!error){
//         setExamResponses(exam_test_responses)
//         }
            
//     }
//     const removeFilter = () => {
//         setTrans("")
//     }

//     const applyFilter = (params) => {
//         let filteredTransactions = "".filter((t) => {return t.location == params})
//         setTrans(filteredTransactions)
//     }

//     // Search according to name
//     const applySearch = (value) => {
//         let filteredTransactions = "".filter((t) => {return t.email.toLowerCase().includes(value.toLowerCase()) ||  t.email.toLowerCase().includes(value.toLowerCase())})
//         setTrans(filteredTransactions)
//     }

//     const formatDateNew = (date) => {
//     const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
//     const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

//     date = new Date(date);
//     const dayName = dayNames[date.getDay()];
//     const day = date.getDate();
//     const month = date.getMonth();
//     const monthName = monthNames[date.getMonth()];
//     const year = date.getFullYear();
//     const hour = date.getHours();
//     const minute = date.getMinutes();
//     const second = date.getSeconds();

//     const dateFormat = `${day}-${month}-${year} ${hour}:${minute} WIB`;
//     // const indonesianFormat = `${dayName}, ${day} ${monthName} ${year} ${hour}:${minute} WIB`;
//     return dateFormat
//     }

//     const deleteCurrentResponse = (index) => {
//         dispatch(openModal({title : "Konfirmasi", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
//         extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

//     }
//     const editCurrentResponse = (index) => {
//         dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.QUESTION_EDIT}))
//         // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
//         // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

//     }
//     const detailCurrentResponse = (index, name) => {
//         // navigate(`/admin/exams/${index}/question/detail/`)
//         dispatch(openModal({title : `Detail Jawaban ${name}`, bodyType : MODAL_BODY_TYPES.EXAM_RESPONSE_DETAIL}))
//         // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
//         // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

//     }

//     return(
//         <>
            
//                 <TabHeaderP id={id} activeKey="Jawaban Peserta" options={options}></TabHeaderP>
//             <TitleCard title="Jawaban Peserta" topMargin="mt-2" TopSideButtons={<TopSideButtons id ={id} applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter}/>}>
//             {/* UJIAN */}
//                 {/* Team Member list in table format loaded constant */}
//             <div className="overflow-x-auto w-full">
//                 <table className="table w-full">
//                     <thead>
//                     <tr>
//                         {/* <th>Icon</th> */}
//                         <th>No. Registrasi</th>
//                         <th>No. WhatsApp</th>
//                         <th>Nama</th>
//                         <th>Jadwal - Jenjang</th>
//                         <th>Skor</th>
//                         <th>Submit Pada</th>
//                         <th></th>
//                         {/* <th>Tanggal Submit</th> */}
//                         {/* <th>Lokasi</th>
//                         <th>Update Terakhir</th> */}
//                     </tr>
//                     </thead>
//                     <tbody>
//                         {
//                             ExamResponses.map((l, k) => {
//                                 return(
//                                     <tr key={k}>
//                                     <td><div className="font-bold">{l.exam_profiles?.regist_number?? '-' }</div></td>
//                                     <td><div className="font-bold">{l.exam_profiles?.phone_number?? '-' }</div></td>
//                                     <td><div className="font-bold">{l.exam_profiles?.full_name?? '-' }</div></td>
//                                     {/* <td><div className="font-bold">{l.exam_schedules?.name?? '-' - l.exam_schedules_schools[0]?.schools.school_name?? '-' }</div></td> */}
//                                     <td><div className="font-bold">{l.exam_profiles?.score?? '-' }</div></td>
//                                     <td><div className="font-bold">{l.submited_at?formatDateNew(l.submited_at):"-" }</div></td>
//                                     <td>
//                                         <button className="btn btn-square btn-ghost" onClick={() => detailCurrentResponse(l.id, l.full_name)}><EyeIcon className="w-5"/></button>
//                                         <button className="btn btn-square btn-ghost" onClick={() => editCurrentResponse(l.id)}><PencilIcon className="w-5"/></button>
//                                         <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentResponse(l.id)}><TrashIcon className="w-5"/></button>
//                                     </td>
//                                     {/* <td>{l.updated_at}</td> */}
//                                     {/* <td>{moment(l.date).format("D MMM")}</td> */}
//                                     </tr>
//                                 )
//                             })
//                         }
//                     </tbody>
//                 </table>
//             </div>
//             </TitleCard>
//         </>
//     )
// }


// export default ExamResponses