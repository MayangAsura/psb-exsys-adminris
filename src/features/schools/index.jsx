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
            <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewTeamMember()}>Tambah Jenjang</button>
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

function Schools(){


    const [members, setMembers] = useState(TEAM_MEMBERS)
    const [schools, setSchools] = useState([])

    useEffect(() => {
        getSchoolData()
        console.log(schools)
    },[])

    const getRoleComponent = (role) => {
        if(role  === "Admin")return <div className="badge badge-secondary">{role}</div>
        if(role  === "Manager")return <div className="badge">{role}</div>
        if(role  === "Owner")return <div className="badge badge-primary">{role}</div>
        if(role  === "Support")return <div className="badge badge-accent">{role}</div>
        else return <div className="badge badge-ghost">{role}</div>
    }

    const getSchoolData = async () => {
        let { data: schools, error } = await supabase
            .from('schools')
            .select('*')
            // .is('deleted_at', null)
            .order('created_at', 'desc')

        if(!error){
            setSchools(schools)
        }
    }

    const getEducationUnit = (value) => {
        // if(value)
        return value
        // let { data: schools, error } = await supabase
        //     .from('schools')
        //     .select('*')

        // if(!error){
        //     setSchools(schools)
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
            
            <TitleCard title="Jenjang" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Nama Sekolah</th>
                        <th>Satuan Pendidikan</th>
                        <th>Alamat</th>
                        <th>Update Terakhir</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            schools.map((l, k) => {
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
                                    <td>{l.school_name}</td>
                                    <td>{getEducationUnit(l.school_name)}</td>
                                    <td>{l.address}</td>
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


export default Schools