import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../common/headerSlice'
import TitleCard from '../../components/Cards/TitleCard'
import supabase from "../../services/database-server"

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeaderE from '../../components/TabHeader/TabHeaderE'
import { useParams } from 'react-router-dom'

function SchedulePresences(){


    const [trans, setTrans] = useState("")
    const [ExamPresences, setExamPresences] = useState([])

    const id = useParams().schedule_id
    const options = [
        {tab: 'Detail', selected: false },
        {tab: 'Ujian', selected: false },
        {tab: 'Peserta', selected: false },
        {tab: 'Presensi', selected: true }
    ]
    useEffect(() => {
        getExamPresences(id)
        console.log(ExamPresences)
    },[])

    const getExamPresences = async(id) => {
    
        let { data: exam_responses, error } = await supabase
            .from('exam_presences')
            .select('*, exam_schedules(id,exam_schedule_schools(schools(school_name))), exam_profiles(full_name, regist_number, phone_number, completion_status)')
            // exam_tests(name, exam_schedule_tests(exam_schedules(exam_schedule_schools(schools(school_name))))), 
            .eq('exam_schedules.id', id)

        if(!error){
        setExamPresences(exam_responses)
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

    return(
        <>
            
                <TabHeaderE id = {id} options={options} activeKey='Peserta'></TabHeaderE>
            <TitleCard title="Presensi" topMargin="mt-2" >
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
                        <th>No. Wa</th>
                        <th>Tanggal Presensi</th>
                        <th>Status Seleksi</th>
                        {/* <th>Lokasi</th>
                        <th>Update Terakhir</th> */}
                    </tr>
                    </thead>
                    <tbody>
                        {
                            ExamPresences.map((l, k) => {
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
                                    <div className="">{l.exam_profiles.phone_number??'-'}</div>
                                    {/* <td><div className="">{l.exam_schedules.exam_schedule_schools[0].schools.school_name}</div></td> */}
                                    {/* <td><div className="font-bold">{l.score}</div></td>*/}
                                    <td><div className="">{formatDateNew(l.presence_at) }</div></td> 
                                    {/* <td><div className="badge-primary font-semibold rounded-2xl w-16 py-1 px-2">{l.test_scheme}</div> </td> */}
                                    <td className='flex justify-center items-center align-middle badge bg-red-400'>{l.exam_profiles.completion_status==='ongoing'?'Belum Tuntas': 'Tuntas'}</td>

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


export default SchedulePresences