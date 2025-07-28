import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { showNotification } from '../common/headerSlice'

import supabase from "../../services/database-server"

const TopSideButtons = () => {

    const dispatch = useDispatch()

    const addNewTeamMember = () => {
        dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewTeamMember()}>Tambah Peserta</button>
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

function Participants(){


    const [members, setMembers] = useState(TEAM_MEMBERS)
    const [Participants, setParticipants] = useState([])

    useEffect(() => {
        getParticipantData()
        console.log(Participants)
    },[])

    const getRoleComponent = (role) => {
        if(role  === "Admin")return <div className="badge badge-secondary">{role}</div>
        if(role  === "Manager")return <div className="badge">{role}</div>
        if(role  === "Owner")return <div className="badge badge-primary">{role}</div>
        if(role  === "Support")return <div className="badge badge-accent">{role}</div>
        else return <div className="badge badge-ghost">{role}</div>
    }

    const getParticipantData = async () => {
        let { data: participants, error } = await supabase
            .from('participants')
            .select('*, applicants(*)')
            .is('deleted_at', null)

        if(!error){
            setParticipants(participants)
        }
    }

    const getEducationUnit = (value) => {
        // if(value)
        return value
        // let { data: Participants, error } = await supabase
        //     .from('Participants')
        //     .select('*')

        // if(!error){
        //     setParticipants(Participants)
        // }
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
            
            <TitleCard title="Peserta" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Nama</th>
                        <th>No Registrasi</th>
                        <th>No WhatsApp</th>
                        <th>Tempat Lahir</th>
                        <th>Status Seleksi</th>
                        <th>Pembayaran</th>
                        <th>Kelengkapan Formulir</th>
                        <th>Kelengkapan Pengukuran Seragam</th>
                        <th>Update Terakhir</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            Participants.map((l, k) => {
                                return(
                                    <tr key={k}>
                                    {/* <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-circle w-12 h-12">
                                                    <img src={l.avatar} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{l.name}</div>
                                            </div>
                                        </div>
                                    </td> */}
                                    <td>{l.applicants.full_name}</td>
                                    <td>{l.applicants.regist_number}</td>
                                    <td>{l.applicants.phone_number}</td>
                                    <td>{l.pob}</td>
                                    <td className={`rounded-2xl w-24 py-1 px-2 text-gray-100 badge ${l.is_complete==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_complete==='true'?'Lulus':'Tidak Lulus'}</td>
                                    <td >{l.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</td>
                                    {/* className={`rounded-2xl w-32 py-1 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-orange-400': 'bg-green-400'}`} */}
                                    <td >{l.is_draft==='true'?'Lengkap':'Belum Lengkap'}</td>
                                    {/* className={`rounded-2xl w-24 py-1 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-blue-400': 'bg-gray-400'}`} */}
                                    <td >{l.is_uniform_sizing==='true'?'Selesai':'Belum Lengkap'}</td>
                                    {/* className={`rounded-2xl w-24 py-1 px-2 text-gray-100 badge ${l.is_uniform_sizing==true? 'bg-yellow-400': 'bg-cyan-400'}`} */}
                                    {/* <td>{getEducationUnit(l.Participant_name)}</td>
                                    <td>{l.address}</td> */}
                                    <td>{formatDateNew(l.updated_at) }</td>
                                    {/* <td>{getRoleComponent(l.role)}</td> */}
                                    {/* <td>{l.lastActive}</td> */}
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


export default Participants