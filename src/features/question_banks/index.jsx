import moment from "moment"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import { openModal } from "../common/modalSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import { showNotification } from '../common/headerSlice'
import { TasksTable } from "./components/tasks-table"
import { DataTableSkeleton } from "../../components/DataTable/data-table-skeleton"
import { getAllQuestionBanks, getQBFemaleCounts, getQBMaleCounts } from "../../lib/queries"



import supabase from "../../services/database-server"
import { useNavigate } from "react-router-dom"

const TopSideButtons = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const addNewTeamMember = () => {
        dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewTeamMember()}>Tambah Bank Soal</button>
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

function QuestionBanks(){


    const {newNotificationStatus} = useSelector((state) => state.header)
    const [members, setMembers] = useState(TEAM_MEMBERS)
    const [search, setSearch] = useState("");
    const [validFilters, setValidFilter] = useState("");
    const [questionBanks, setQuestionBanks] = useState([])
    const dispatch = useDispatch()

    // const promises = Promise.all([
    //     getTasks({
    //     ...search,
    //     filters: validFilters,
    //     }),
    //     getTaskStatusCounts(),
    //     getTaskPriorityCounts(),
    //     getEstimatedHoursRange(),
    // ]);

    const getRoleComponent = (role) => {
        if(role  === "Admin")return <div className="badge badge-secondary">{role}</div>
        if(role  === "Manager")return <div className="badge">{role}</div>
        if(role  === "Owner")return <div className="badge badge-primary">{role}</div>
        if(role  === "Support")return <div className="badge badge-accent">{role}</div>
        else return <div className="badge badge-ghost">{role}</div>
    }

    useEffect(() => {
        getQuestionBanks()
        console.log(questionBanks)
    },[])

    const getQuestionBanks = async () => {
        let { data: questionBanks, error } = await supabase
            .from('exam_question_banks')
            .select('*')
            .is('deleted_at', null)

        if(!error){
            setQuestionBanks(questionBanks)
        }
    }

    const promises = Promise.all([
    getAllQuestionBanks({
      ...search,
      filters: validFilters,
    }),
    getQBFemaleCounts(),
    getQBMaleCounts(),
    // getEstimatedHoursRange(),
  ]);
//     const promises = Promise.all([
//     getTasks({
//       ...search,
//       filters: validFilters,
//     }),
//     getTaskStatusCounts(),
//     getTaskPriorityCounts(),
//     getEstimatedHoursRange(),
//   ]);
    
    const deleteCurrentQuestion = (index) => {
            dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
            extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_BANK_DELETE, index}}))

            if(newNotificationStatus==1){
                getQuestionBanks()
            }
        }
    const editCurrentQuestion = (index) => {
        navigate('/ad/question_bank')
        // dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_EDIT}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }
    const detailCurrentQuestion = (index) => {
        // navigate(`/admin/exams/detail/${index}`)
        dispatch(openModal({title : "Pertanyaan", bodyType : MODAL_BODY_TYPES.EXAM_DETAIL}))
        // dispatch(openModal({title : "Confirmation", bodyType : MODAL_BODY_TYPES.CONFIRMATION, 
        // extraObject : { message : `Apakah Anda yakin menghapus pertanyaan ini?`, type : CONFIRMATION_MODAL_CLOSE_TYPES.QUESTION_DELETE, index}}))

    }

    return(
        <>
            
            <TitleCard title="Bank Soal" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

            <div className="overflow-x-auto w-full">
                {/* <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={[
                "10rem",
                "30rem",
                "10rem",
                // "10rem",
                // "6rem",
                // "6rem",
                // "6rem",
              ]}
              shrinkZero
            />
          }
        >
          <TasksTable promises={promises} />
        </React.Suspense> */}
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Pertanyaan</th>
                        <th>Tipe</th>
                        <th>Kode Soal</th>
                        <th>Skor</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            questionBanks.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td><div className="font-bold">{l.question }</div></td>
                                    <td><div className="font-semibold">{l.type }</div></td>
                                    <td><div className="font-semibold">{l.bank_code }</div></td>
                                    <td><div className="font-semibold q">{l.score }</div></td>
                                    <td>
                                        <button className="btn btn-square btn-ghost" onClick={() => detailCurrentQuestion(l.id)}><EyeIcon className="w-5"/></button>
                                        <button className="btn btn-square btn-ghost" onClick={() => editCurrentQuestion(l.id)}><PencilIcon className="w-5"/></button>
                                        <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentQuestion(l.id)}><TrashIcon className="w-5"/></button>
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


export default QuestionBanks