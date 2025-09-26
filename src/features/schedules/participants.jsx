import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TitleCard from '../../components/Cards/TitleCard'
import supabase from "../../services/database-server"

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeaderE from '../../components/TabHeader/TabHeaderE'
import { useParams } from 'react-router-dom'

function ScheduleParticipants(){


    const [trans, setTrans] = useState("")
    const [ExamParticipants, setExamParticipants] = useState([])

    const id = useParams().schedule_id
    const options = [
        {tab: 'Detail', selected: false },
        {tab: 'Ujian', selected: false },
        {tab: 'Peserta', selected: true },
        {tab: 'Presensi', selected: false }
    ]
    useEffect(() => {
        getExamParticipants(id)
        console.log(ExamParticipants)
    },[id])

    const getExamParticipants = async(id) => {
    
        let { data: exam_responses, error } = await supabase
            .from('exam_test_participants')
            .select('*, exam_tests!inner(name, exam_schedule_tests!inner(exam_schedule_id)), exam_profiles!inner(full_name, father_name, mother_name, last_login, regist_number, phone_number, created_at, completion_status))')
            .eq('exam_tests.exam_schedule_tests.exam_schedule_id', id)
            .is('deleted_at', null)

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

  const getStatus = (status) => {
    if(status=='ongoing'){
        return 'Belum Tuntas'
    }
    if(status=='complete'){
        return 'Tuntas'
    }
  }

    return(
        <>
            
                <TabHeaderE id = {id} options={options} activeKey='Peserta'></TabHeaderE>
            <TitleCard title="Peserta" topMargin="mt-2" >
            {/* UJIAN */}
                {/* Team Member list in table format loaded constant */}
                {/* <TabHeaderE></TabHeaderSP> */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        {/* <th>Icon</th> */}
                        <th>No. Registrasi</th>
                        <th>Nama</th>
                        <th>Bergabung</th>
                        <th>Status Asesmen</th>
                        {/* <th>Tanggal Submit</th> */}
                        {/* <th>Lokasi</th>
                        <th>Update Terakhir</th> */}
                    </tr>
                    </thead>
                    <tbody>
                        {
                            ExamParticipants.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td><div className="font-bold">{l.exam_profiles.regist_number }</div></td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            {/* <div className="avatar">
                                                <div className="mask mask-circle w-12 h-12">
                                                    <img src={l.icon} alt="Avatar" />
                                                </div>
                                            </div> */}
                                            <div>
                                                <div className="font-bold">{l.exam_profiles.full_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* <td><div className="font-bold">{l.exam_schedule_tests[0].exam_schedule_schools[0].schools.school_name}</div></td> */}
                                    {/* <td><div className="font-bold">{l.score}</div></td> */}
                                    <td><div className="">{formatDateNew(l.created_at) }</div></td>
                                    {/* <td><div className="badge-primary font-semibold rounded-2xl w-16 py-1 px-2">{l.test_scheme}</div> </td> */}
                                    <td className={`${l.exam_profiles?.completion_status=='ongoing'? 'badge bg-red-400':' badge bg-blue-400'} font-bold`} >{getStatus(l.exam_profiles?.completion_status)}</td>
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


export default ScheduleParticipants