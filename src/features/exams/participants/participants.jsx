import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../common/headerSlice'
import TitleCard from '../../../components/Cards/TitleCard'
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import supabase from "../../../services/database-server"
import { openModal } from "../../common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil'

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeaderP from '../../../components/TabHeader/TabHeaderP'
import { useParams } from 'react-router-dom'

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

function ExamParticipants(){



    const [trans, setTrans] = useState("")
    const [examParticipants, setExamParticipants] = useState([])
    const [examSch, setExamSch] = useState("")

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()
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
        {tab: 'Pertanyaan', selected: false },
        {tab: 'Peserta', selected: true },
        {tab: 'Respon Peserta', selected: false }
    ]
    

    const id = useParams().exam_id
    useEffect(() => {
        getExamParticipants(id)
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
    setExamSch(exam_schedule_tests[0].exam_schedule_id)
  }
          
    }

    const getExamParticipants = async(id) => {
    
        let { data: exam_responses, error } = await supabase
            .from('exam_test_participants')
            .select('*, exam_tests(id, name, exam_schedule_tests(exam_schedule_id)), exam_profiles(full_name, regist_number, phone_number)')
            .eq('exam_tests.id', id)

        if(!error){
        setExamParticipants(exam_responses)
        console.log('ExamParticipants', examParticipants)
        // setExamSch(ExamParticipants.exam_tests.exam_schedule_tests[0]?.exam_schedule_id)
        // console.log(exam_responses[0]?.exam_tests?.exam_schedule_tests[0]?.exam_schedule_id)
        // examSch=exam_responses[0]?.exam_tests?.exam_schedule_tests[0]?.exam_schedule_id
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
  const addNewPartModal = () => {
        
        dispatch(openModal({title : "Import Peserta", bodyType : MODAL_BODY_TYPES.EXAM_PARTIC_IMPORT,
            extraObject : {message : "", type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_PARTIC_IMPORT_SUCCESS, index: id, sid: examSch }
        },
            
        ))
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    return(
        <>
            
                <TabHeaderP id = {id} sid={examSch} options={options} activeKey='Peserta' ></TabHeaderP>
            <TitleCard title="Peserta" topMargin="mt-2" TopSideButtons={TopSideButtons}>

            {/* UJIAN */}
                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <div className="inline-block float-right">
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-300 hover:bg-green-500 dark:text-gray-600 " onClick={() => addNewPartModal()}  >Import Peserta </button>
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
                </ul>
            </div> */}
        </div>
                <table className="table w-full">
                    <thead>
                    <tr>
                        {/* <th>Icon</th> */}
                        <th>No. Registrasi</th>
                        <th>Nama</th>
                        <th>No. WhatsApp</th>
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
                                    <td><div className="font-bold">{l.exam_profiles?.regist_number }</div></td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-circle w-12 h-12">
                                                    {/* <img src={l.icon} alt="Avatar" /> */}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{l.exam_profiles?.full_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><div className="font-bold">{l.exam_profiles?.phone_number}</div></td>
                                    {/* <td><div className="font-bold">{l.exam_schedule_tests[0].exam_schedule_schools[0].schools.school_name}</div></td> */}
                                    {/* <td><div className="font-bold">{formatDateNew(l.submit_at) }</div></td> */}
                                    {/* <td><div className="badge-primary font-semibold rounded-2xl w-16 py-1 px-2">{l.test_scheme}</div> </td> */}
                                    {/* <td>{l.test_schedule}</td> */}
                                    {/* <td>Ujian Seleksi Jenjang SDIT</td> */}
                                    {/* <td>{l.exam_schedules_test[0].exam_schedules.name}</td> */}
                                    {/* <td>{l.score}</td> */}
                                    {/* <td>{l.updated_at}</td> */}
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


export default ExamParticipants