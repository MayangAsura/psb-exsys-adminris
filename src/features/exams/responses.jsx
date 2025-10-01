// import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { setPageTitle } from '../common/headerSlice'
// import TitleCard from '../../components/Cards/TitleCard'
// import supabase from "../../services/database-server"
// import { openModal } from "../common/modalSlice"
// import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
// import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
// import EyeIcon from "@heroicons/react/24/outline/EyeIcon"
// import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
// import { useSelector } from 'react-redux'
// import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'
// import TabHeaderP from '../../components/TabHeader/TabHeaderP'
// import { useParams } from 'react-router-dom'

// function ExamResponses(){
//     const [trans, setTrans] = useState("")
//     const [ExamParticipants, setExamParticipants] = useState([])
//     const { newNotificationStatus } = useSelector((state) => state.modal)
//     const dispatch = useDispatch()
//     const options = [
//         {tab: 'Detail', selected: false },
//         {tab: 'Pertanyaan', selected: false },
//         {tab: 'Peserta', selected: false },
//         {tab: 'Jawaban Peserta', selected: true }
//     ]

//     const id = useParams().exam_id
    
//     useEffect(() => {
//         getExamParticipants(id)
//     },[id])

//     const getExamParticipants = async(id) => {
//         let { data: exam_responses, error } = await supabase
//             .from('exam_test_responses')
//             .select('*, exam_tests(name, exam_schedule_tests(exam_schedules(exam_schedule_schools(schools(school_name)) )), exam_profiles(full_name, regist_number)')
//             .eq('exam_test_id', id)

//         if(!error){
//             setExamParticipants(exam_responses || [])
//         } else {
//             console.error('Error fetching exam participants:', error)
//             setExamParticipants([])
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

//     const deleteCurrentResponse = async (index) => {
//         console.log(index)
//         dispatch(openModal({
//             title: "Konfirmasi", 
//             bodyType: MODAL_BODY_TYPES.CONFIRMATION, 
//             extraObject: { 
//                 message: `Apakah Anda yakin menghapus response ini?`, 
//                 type: CONFIRMATION_MODAL_CLOSE_TYPES.RESPONSE_DELETE, 
//                 index
//             }
//         }))

//         if(newNotificationStatus == 1){
//             getExamParticipants(index)
//         }
//     }
    
//     const detailCurrentResponse = (index) => {
//         console.log(index)
//         dispatch(openModal({
//             title: "Detail Jawaban", 
//             bodyType: MODAL_BODY_TYPES.EXAM_RESPONSE_DETAIL, 
//             extraObject: { 
//                 message: ``, 
//                 type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_RESPONSE_DETAIL, 
//                 id, 
//                 index
//             }
//         }))
//     }

//     // Safe function to get school name
//     const getSchoolName = (examResponse) => {
//         try {
//             // Safely navigate through the nested structure
//             const examTests = examResponse.exam_tests;
//             if (!examTests || !examTests.length) return "-";
            
//             const examScheduleTests = examTests[0]?.exam_schedule_tests;
//             if (!examScheduleTests || !examScheduleTests.length) return "-";
            
//             const examSchedules = examScheduleTests[0]?.exam_schedules;
//             if (!examSchedules || !examSchedules.length) return "-";
            
//             const examScheduleSchools = examSchedules[0]?.exam_schedule_schools;
//             if (!examScheduleSchools || !examScheduleSchools.length) return "-";
            
//             const schools = examScheduleSchools[0]?.schools;
//             if (!schools) return "-";
            
//             return schools.school_name || "-";
//         } catch (error) {
//             console.error('Error getting school name:', error);
//             return "-";
//         }
//     }

//     const formatDateNew = (date) => {
//         if (!date) return "-";
        
//         const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
//         const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

//         date = new Date(date);
//         const dayName = dayNames[date.getDay()];
//         const day = date.getDate();
//         const month = date.getMonth();
//         const monthName = monthNames[date.getMonth()];
//         const year = date.getFullYear();
//         const hour = date.getHours();
//         const minute = date.getMinutes();
//         const second = date.getSeconds();

//         const dateFormat = `${day}-${month}-${year} ${hour}:${minute} WIB`;
//         return dateFormat
//     }

//     return(
//         <>
//             <TabHeaderP id={id} options={options} activeKey='Jawaban Peserta' />
//             <TitleCard title="Jawaban Peserta" topMargin="mt-2">
//                 <div className="overflow-x-auto w-full">
//                     <table className="table w-full">
//                         <thead>
//                             <tr>
//                                 <th>No. Registrasi</th>
//                                 <th>Nama</th>
//                                 <th>Jenjang</th>
//                                 <th>Skor</th>
//                                 <th>Tanggal Submit</th>
//                                 <th></th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {ExamParticipants.map((l, k) => {
//                                 return(
//                                     <tr key={k}>
//                                         <td>
//                                             <div className="font-bold">{l.exam_profiles?.regist_number ?? "-"}</div>
//                                         </td>
//                                         <td>
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="avatar">
//                                                     <div className="mask mask-circle w-12 h-12">
//                                                         {/* <img src={l.icon} alt="Avatar" /> */}
//                                                     </div>
//                                                 </div>
//                                                 <div>
//                                                     <div className="font-bold">{l.exam_profiles?.full_name ?? "-"}</div>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td>
//                                             <div className="font-bold">{getSchoolName(l)}</div>
//                                         </td>
//                                         <td>
//                                             <div className="font-bold">{l.score || "0"}</div>
//                                         </td>
//                                         <td>
//                                             <div className="font-bold">{l.submit_at ? formatDateNew(l.submit_at) : "-"}</div>
//                                         </td>
//                                         <td>
//                                             <button className="btn btn-square btn-ghost" onClick={() => detailCurrentResponse(l.id)}>
//                                                 <EyeIcon className="w-5"/>
//                                             </button>
//                                             <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentResponse(l.id)}>
//                                                 <TrashIcon className="w-5"/>
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 )
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </TitleCard>
//         </>
//     )
// }

// export default ExamResponses

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../common/headerSlice'
import TitleCard from '../../components/Cards/TitleCard'
import supabase from "../../services/database-server"
import { openModal } from "../common/modalSlice"
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import EyeIcon from "@heroicons/react/24/outline/EyeIcon"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
// import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeaderP from '../../components/TabHeader/TabHeaderP'
import { useParams } from 'react-router-dom'

function ExamResponses(){


    const [trans, setTrans] = useState("")
    const [ExamParticipants, setExamParticipants] = useState([])
    const { newNotificationStatus } = useSelector((state) => state.modal)
    const dispatch = useDispatch()
    const options = [
        {tab: 'Detail', selected: false },
        {tab: 'Pertanyaan', selected: false },
        {tab: 'Peserta', selected: false },
        {tab: 'Jawaban Peserta', selected: true }
    ]

    const id = useParams().exam_id
    useEffect(() => {
        getExamParticipants(id)
        console.log(ExamParticipants)
    },[id])

    const getExamParticipants = async(id) => {
    
        let { data: exam_responses, error } = await supabase
            .from('exam_test_responses')
            .select('*, exam_tests(name, exam_schedule_tests(exam_schedules(exam_schedule_schools(schools(school_name)) ) )), exam_profiles(full_name, regist_number)')
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
            
                <TabHeaderP id={id}  options={options} activeKey='Jawaban Peserta'  />
            <TitleCard title="Jawaban Peserta" topMargin="mt-2" >
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
                                    <td><div className="font-bold">{l.exam_tests[0]?.exam_schedule_tests[0]?.exam_schedules[0]?.exam_schedule_schools[0].schools.school_name??"-"}</div></td>
                                    <td><div className="font-bold">{l.score || "0"}</div></td>
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