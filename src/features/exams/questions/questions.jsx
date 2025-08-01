import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../common/headerSlice'
import TitleCard from '../../../components/Cards/TitleCard'
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import SearchBar from "../../../components/Input/SearchBar"
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import { openModal } from "../../common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil'
import supabase from "../../../services/database-server"

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeaderP from '../../../components/TabHeader/TabHeaderP'
import { useNavigate, useParams } from 'react-router-dom'

const TopSideButtons = ({id, removeFilter, applyFilter, applySearch}) => {

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
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
    

    const addNewQuestionImportModal = () => {
        
        dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.QUESTION_ADD_IMPORT, 
            extraObject: {message: "", type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_QUESTION_IMPORT, index: id, sid: ""}
        }))
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }
    const addNewQuestionModal = () => {
        navigate('/ad/exams/'+id+'/questions/add')
        
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.QUESTION_ADD_MANUAL, 
        //     extraObject: {message: "", type: CONFIRMATION_MODAL_CLOSE_TYPES.EXAM_QUESTION_ADD_MANUAL, index: id, sid: ""}
        // }))
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }
    const openAddNewLeadModal = () => {
    }

    return(
        <div className="inline-block float-right">
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case btn-primary bg-orange-800 hover:bg-orange-600 text-gray-200 dark:text-gray-100" onClick={() => addNewQuestionImportModal()}>Import Pertanyaan</button>
            </div>
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case btn-primary bg-green-800 hover:bg-green-600 text-gray-200 dark:text-gray-100" onClick={() => addNewQuestionModal()}>Tambah Pertanyaan</button>
            </div>

            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
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
        </div>
    )
}

function ExamQuestions(){


    const [trans, setTrans] = useState("")
    const [examQuestions, setExamQuestions] = useState([])
    const dispatch = useDispatch()
    const options = [
        {tab: 'Detail', selected: false },
        {tab: 'Pertanyaan', selected: true },
        {tab: 'Peserta', selected: false },
        {tab: 'Respon Peserta', selected: false }
    ]

    const id = useParams().exam_id

    useEffect(() => {
        getExamQuestions(id)
        console.log(ExamQuestions)
    },[id])

    const getExamQuestions = async(id) => {
    
        let { data: exam_test_contents, error } = await supabase
            .from('exam_test_contents')
            .select('* ')
            .eq('exam_test_id', id)
            // exam_tests(name, exam_schedule_tests(exam_schedules(exam_schedule_schools(schools(school_name)))))

        if(!error){
        setExamQuestions(exam_test_contents)
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

    const deleteCurrentQuestion = (index) => {
        dispatch(openModal({title : "Konfirmasi", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }
    const editCurrentQuestion = (index) => {
        dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.QUESTION_EDIT}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }
    const detailCurrentQuestion = (index) => {
        // navigate(`/admin/exams/${index}/question/detail/`)
        dispatch(openModal({title : "Detail Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_DETAIL}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }

    return(
        <>
            
                <TabHeaderP id={id} activeKey="Pertanyaan" options={options}></TabHeaderP>
            <TitleCard title="Pertanyaan" topMargin="mt-2" TopSideButtons={<TopSideButtons id ={id} applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter}/>}>
            {/* UJIAN */}
                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        {/* <th>Icon</th> */}
                        <th>Pertanyaan</th>
                        <th>Tipe</th>
                        <th>Kode Soal</th>
                        <th>Skor</th>
                        {/* <th>Tanggal Submit</th> */}
                        {/* <th>Lokasi</th>
                        <th>Update Terakhir</th> */}
                    </tr>
                    </thead>
                    <tbody>
                        {
                            examQuestions.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td><div className="font-bold">{l.question }</div></td>
                                    <td><div className="font-bold">{l.question_type }</div></td>
                                    <td><div className="font-bold">{l.bank_code }</div></td>
                                    <td><div className="font-bold">{l.score }</div></td>
                                    <td>
                                        <button className="btn btn-square btn-ghost" onClick={() => detailCurrentQuestion(l.id)}><EyeIcon className="w-5"/></button>
                                        <button className="btn btn-square btn-ghost" onClick={() => editCurrentQuestion(l.id)}><PencilIcon className="w-5"/></button>
                                        <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentQuestion(l.id)}><TrashIcon className="w-5"/></button>
                                    </td>
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


export default ExamQuestions