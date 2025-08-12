import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { useSelector } from 'react-redux'
import { setPageTitle } from '../common/headerSlice'
import TitleCard from '../../components/Cards/TitleCard'
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import supabase from "../../services/database-server"
import { openModal } from "../common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'


import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeaderSE from '../../components/TabHeader/TabHeaderSE'
import { useNavigate, useParams } from 'react-router-dom'

const TopSideButtons = ({removeFilter, applyFilter, applySearch, sid}) => {

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()
    const locationFilters = ["Paris", "London", "Canada", "Peru", "Tokyo"]
    

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
    

    const addNewPartModal = () => {
        
        dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_PARTIC_IMPORT,
            // extraObject : {message : "", type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_IMPORT}
        },
            
        ))
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }
    // onClick={() => addNewPartModal()}
    const openAddNewLeadModal = () => {
    }

    return(
        <div className="inline-block float-right">
            {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {
                        locationFilters.map((l, k) => {
                            return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>
            </div>
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => addNewPartModal()}>Import Peserta </button>
            </div>

            {/* <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
            {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {
                        locationFilters.map((l, k) => {
                            return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>
            </div> */}
        </div>
    )
}

function AdmissionSchools(){



    const [trans, setTrans] = useState("")
    const {newNotificationMessage, newNotificationStatus} = useSelector(state => state.header)
    const [examParticipants, setExamParticipants] = useState([])
    const [examSch, setExamSch] = useState("")

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [scheduleFilter, setScheduleFilter] = useState([])
    // const scheduleFilters = ["Paris", "London", "Canada", "Peru", "Tokyo"]
    // const dispatch = useDispatch()

    const showFiltersAndApply = (params) => {
        applyFilter(params)
        setFilterParam(params)
    }

    const removeAppliedFilter = () => {
        removeFilter()
        setFilterParam("")
        setSearchText("")
    }

    const options = [
        {tab: 'Detail', selected: false },
        {tab: 'Jenjang', selected: true },
        {tab: 'Report', selected: false }
        // {tab: 'Jawaban Peserta', selected: false }
    ]
    
    const id = useParams().admission_id
    useEffect(() => {
        getAdmissionSchoolData()
        getSchedule(id)
        getScheduleFilter()
        // console.log(ExamParticipants)
    },[id])

    const getScheduleFilter = () => {

    }

    const getSchedule = async () => {

let { data: exam_schedule_tests, error } = await supabase
  .from('exam_schedule_tests')
  .select(`
    exam_test_id,
    exam_schedule_id
  `)
  .eq('exam_test_id',id)
//   .eq('deleted_at', )

  if(!error){
    // setExamSch(exam_schedule_tests[0].exam_schedule_id)
  }
          
    }

    const getAdmissionSchoolData = async () => {
    
        let { data: admission_schools, error } = await supabase
            .from('admission_schools')
            .select('*, schools(school_id, school_name, address), admissions(*))')
            .eq('admission_id', id)
            .is('deleted_at', null)

        if(!error){
        setExamParticipants(admission_schools)
        const data = admission_schools.map((value) => (
            examParticipants.push({
            
            school_id: value.schools.school_id,
            school_name: value.schools.school_name,
            started_at: value.started_at,
            ended_at: value.ended_at,
            status: value.admission_status,
            quota: value.quota,
            address: value.schools.address
        
        })
        ))
        console.log(data)
        // setExamParticipants(data)
        // setExamParticipants(value => ({
        //     school_name: value
        // }))
        console.log('ExamParticipants', examParticipants)
        // setExamSch(ExamParticipants.exam_tests.exam_schedule_tests[0]?.exam_schedule_id)
        // console.log(exam_responses[0]?.exam_tests?.exam_schedule_tests[0]?.exam_schedule_id)
        // examSch=exam_responses[0]?.exam_tests?.exam_schedule_tests[0]?.exam_schedule_id
        }
            
    }

    const getRemindQuota = (quota, sch_id) => {
        
        const participants = getCurQuota(sch_id)
        const curParts = participants.length  
        return curParts - quota
        // return 
        // setRemidQuota(curParts - quota)                                  
    }

    const getCurQuota = async (sch_id) =>{
        const {data: participants, error} = await supabase.from('exam_test_participants')
                                            .select('id, exam_tests(exam_schedule_tests(exam_schedules(admission_id, exam_schedule_schools(school_id))))')
                                            .eq('exam_tests.exam_schedule_tests.exam_schedules.exam_schedule_schools.school_id', sch_id)
                                            .eq('exam_tests.exam_schedule_tests.exam_schedules.admission_id', id)
                                            .is('deleted_at', null)

                                            return participants
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
  const addAdmissionSchool = () => {
        
        dispatch(openModal({title : "Tambah Jenjang", bodyType : MODAL_BODY_TYPES.ADMISSION_SCHOOLS_CREATE,
            extraObject : {message : "", type: CONFIRMATION_MODAL_CLOSE_TYPES.ADMISSION_SCHOOLS_CREATE_SAVE, index: id }
        },
            
        ))
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    // const deleteCurrentData = async (index) => {
    //         console.log(index)
    //         dispatch(openModal({title : "Konfirmasi", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
    //         extraObject : { message : `Apakah Anda yakin menghapus data ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_DELETE, index: index, oid:id }}))
    //         // const {schedule_id, ...newExam} = exam
    // }
    const deleteCurrentSchedule = (index) => {
                dispatch(openModal({title : "Konfirmasi", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
                extraObject : { message : `Apakah Anda yakin menghapus jadwal ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.ADMISSION_SCHOOLS_DELETE, index}}))
                
        if(newNotificationStatus==1){
            getAdmissionSchoolData()
        }
    }

    const editCurrentSchedule = (index) => {
        dispatch(openModal({title : "Edit Jenjang", bodyType : MODAL_BODY_TYPES.ADMISSION_SCHOOLS_EDIT,
            extraObject : {message : "", type: CONFIRMATION_MODAL_CLOSE_TYPES.ADMISSION_SCHOOLS_EDIT_SAVE, index: id, sch_id: index }
        },
            
        ))
        // navigate(`/ad/admissions/schools/edit/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.SCHEDULE_EDIT}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }
    const detailCurrentSchedule = (index) => {
        navigate(`/ad/admissions/${id}/schools/detail/${index}`)
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_DETAIL}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }

    return(
        <>
            
                <TabHeaderSE id = {id} sid={examSch} options={options} activeKey='Jenjang' ></TabHeaderSE>
            <TitleCard title="Jenjang" topMargin="mt-2" TopSideButtons={TopSideButtons}>

            {/* UJIAN */}
                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <div className="inline-block float-right">
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600 " onClick={() => addAdmissionSchool()}  >Tambah Jenjang </button>
            </div>
            {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {
                        scheduleFilter.map((l, k) => {
                            return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>
            </div>

            {/* <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
            {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {
                        locationFilters.map((l, k) => {
                            return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>
            </div> */}
        </div>
                <table className="table w-full">
                    <thead>
                    <tr>
                        {/* <th>Icon</th> */}
                        <th>Nama Jenjang</th>
                        <th>Alamat</th>
                        <th>Tanggal Mulai</th>
                        <th>Tanggal Selesai</th>
                        <th>Status</th>
                        <th>Biaya Masuk</th>
                        <th>Kuota</th>
                        <th>Sisa Kuota</th>
                        {/* <th>Skor</th>
                        <th>Tanggal Submit</th> */}
                        {/* <th>Lokasi</th>
                        <th>Update Terakhir</th> */}
                    </tr>
                    </thead>
                    <tbody>
                        {
                            examParticipants.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td><div className="font-bold">{l.schools?.school_name??"SDIT" }</div></td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-circle w-12 h-12">
                                                    {/* <img src={l.icon} alt="Avatar" /> */}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{l.schools?.address}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><div className="font-bold">{formatDateNew(l.started_at) }</div></td>
                                    <td><div className="font-bold">{formatDateNew(l.ended_at) }</div></td>
                                    <td><div className="font-bold">{l.status??'Aktif'}</div></td>
                                    <td><div className="font-bold">{l.admission_fee??'Rp.125.000'}</div></td>
                                    <td><div className="font-bold">{l.quota}</div></td>
                                    <td><div className="font-bold">{getRemindQuota(l.quota, l.schools?.school_id)?? l.quota}</div></td>
                                    {/* <td><div className="font-bold">{l.exam_schedule_tests[0].exam_schedule_schools[0].schools.school_name}</div></td> */}
                                    {/* <td><div className="font-bold">{formatDateNew(l.submit_at) }</div></td> */}
                                    {/* <td><div className="badge-primary font-semibold rounded-2xl w-16 py-1 px-2">{l.test_scheme}</div> </td> */}
                                    {/* <td>{l.test_schedule}</td> */}
                                    {/* <td>Ujian Seleksi Jenjang SDIT</td> */}
                                    {/* <td>{l.exam_schedules_test[0].exam_schedules.name}</td> */}
                                    {/* <td>{l.score}</td> */}
                                    {/* <td>{l.updated_at}</td> */}
                                    {/* <td>{moment(l.date).format("D MMM")}</td> */}
                                    <tr>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-green-200" onClick={() => detailCurrentSchedule(l.school_id)}><EyeIcon className="w-5"/></button>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-orange-200" onClick={() => editCurrentSchedule(l.school_id)}><PencilIcon className="w-5"/></button>
                                        <button className="btn btn-sm btn-square btn-ghost hover:bg-red-200" onClick={() => deleteCurrentSchedule(l.school_id)}><TrashIcon className="w-5"/></button>
    {/* <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentData(l.appl_id)}><TrashIcon className="w-5"/></button> */}
                                    </tr>
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


export default AdmissionSchools