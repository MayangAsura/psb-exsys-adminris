import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TitleCard from '../../components/Cards/TitleCard'
import supabase from "../../services/database-server"

import DocumentIcon  from '@heroicons/react/24/solid/DocumentIcon'

import TabHeaderSE from '../../components/TabHeader/TabHeaderSE'
import { useParams } from 'react-router-dom'

function ScheduleExams(){


    const [trans, setTrans] = useState("")
    const [scheduleExams, setScheduleExams] = useState([])

    const id = useParams().schedule_id
    useEffect(() => {
        getScheduleExams(id)
        console.log(scheduleExams)
    },[id])

    const getScheduleExams = async(id) => {
    
        let { data: exam_responses, error } = await supabase
            .from('exam_schedule_tests')
            .select('*, exam_tests(name, scheme, question_type))')
            .eq('exam_schedule_id', id)

        if(!error){
        setScheduleExams(exam_responses)
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
            
            <TitleCard title="Ujian" topMargin="mt-2" >
            {/* UJIAN */}
                {/* Team Member list in table format loaded constant */}
                <TabHeaderSE></TabHeaderSE>
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        {/* <th>Icon</th> */}
                        <th>Nama Ujian</th>
                        <th>Skema</th>
                        <th>Tipe</th>
                        {/* <th>Skor</th>
                        <th>Tanggal Submit</th> */}
                        {/* <th>Lokasi</th>
                        <th>Update Terakhir</th> */}
                    </tr>
                    </thead>
                    <tbody>
                        {
                            scheduleExams.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    <td><div className="font-bold">{l.exam_tests.name }</div></td>
                                    {/* <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-circle w-12 h-12">
                                                    <img src={l.icon} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{l.exam_profiles.full_name}</div>
                                            </div>
                                        </div>
                                    </td> */}
                                    {/* <td><div className="font-bold">{l.exam_schedule_tests[0].exam_schedule_schools[0].schools.school_name}</div></td>
                                    <td><div className="font-bold">{l.score}</div></td>
                                    <td><div className="font-bold">{formatDateNew(l.submit_at) }</div></td> */}
                                    {/* <td><div className="badge-primary font-semibold rounded-2xl w-16 py-1 px-2">{l.test_scheme}</div> </td> */}
                                    {/* <td>{l.test_schedule}</td> */}
                                    {/* <td>Ujian Seleksi Jenjang SDIT</td> */}
                                    {/* <td>{l.exam_schedules_test[0].exam_schedules.name}</td> */}
                                    <td>{l.exam_tests.scheme}</td>
                                    <td>{l.exam_tests.question_type}</td>
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


export default ScheduleExams