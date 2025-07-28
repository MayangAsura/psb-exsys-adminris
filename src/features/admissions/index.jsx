import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { showNotification } from '../common/headerSlice'

import supabase from "../../services/database-server"
import { useNavigate } from "react-router-dom"

const TopSideButtons = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // const addNewTeamMember = () => {
    //     dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    // }
    const addNewAdmission = () => {
        navigate('/ad/admissions/create')
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewAdmission()}>Tambah Seleksi</button>
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

function Admissions(){


    const [members, setMembers] = useState(TEAM_MEMBERS)
    const [Admissions, setAdmissions] = useState([])

    useEffect(() => {
        getSchoolData()
        console.log(Admissions)
    },[])

    const getRoleComponent = (role) => {
        if(role  === "Admin")return <div className="badge badge-secondary">{role}</div>
        if(role  === "Manager")return <div className="badge">{role}</div>
        if(role  === "Owner")return <div className="badge badge-primary">{role}</div>
        if(role  === "Support")return <div className="badge badge-accent">{role}</div>
        else return <div className="badge badge-ghost">{role}</div>
    }

    const getSchoolData = async () => {
        let { data: admissions, error } = await supabase
            .from('admissions')
            .select('*')
            .is('deleted_at', null)

        if(!error){
            setAdmissions(admissions)
        }
    }

    const getEducationUnit = (value) => {
        // if(value)
        return value
        // let { data: Admissions, error } = await supabase
        //     .from('Admissions')
        //     .select('*')

        // if(!error){
        //     setAdmissions(Admissions)
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
            
            <TitleCard title="PSB" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Judul</th>
                        <th>Tanggal Pendaftaran</th>
                        <th>Tanggal Akhir Pendaftaran</th>
                        <th>Status</th>
                        <th>Update Terakhir</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            Admissions.map((l, k) => {
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
                                    <td>{l.title}</td>
                                    <td>{formatDateNew(l.start_at) }</td>
                                    <td>{formatDateNew(l.end_at) }</td>
                                    <td>{getEducationUnit(l.status)}</td>
                                    <td>{formatDateNew(l.updated_at) }</td>
                                    {/* <td>{l.address}</td> */}
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


export default Admissions