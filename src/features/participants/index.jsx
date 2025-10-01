import moment from "moment"
import { useEffect, useState } from "react"
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { showNotification } from '../common/headerSlice'
import SearchBar from "../../components/Input/SearchBar"
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon"
import { saveAs } from 'file-saver';

import supabase from "../../services/database-server"

const TopSideButtons = ({participants, removeFilter, applyFilter, applySearch}) => {

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()
    const participantFilters = ["Laki-Laki", "Perempuan"]
    

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
        if(searchText === ""){
            removeAppliedFilter()
        } else {
            applySearch(searchText)
        }
    }, [searchText])
    

    const addNewParticipant = () => {
        // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
    }

    const exportParticipants = () => {
        const clean_data = participants.map(value => ({
            NAMA : value.applicants.full_name,
            KK : value.kk_number,
            STATUS_PENDAFTARAN: value.is_complete === true ? 'Lulus' : 'Tidak Lulus',
            STATUS_SELEKSI: value.submission_status === true ? 'Tuntas' : 'Belum Tuntas',
            STATUS_PENGISIAN_FORMULIR: value.is_draft === true ? 'Lengkap' : 'Belum Lengkap',
            STATUS_PENGISIAN_UKURAN_SERAGAM: value.is_uniform_sizing === true ? 'Lengkap' : 'Belum Lengkap',
            ALAMAT: value.home_address,
            TEMPAT_LAHIR: value.pob,
            TANGGAL_LAHIR: value.dob,
            KATEGORI_SISWA: value.student_category,
            METODE_PEMBAYARAN_UANGPANGKAL: value.metode_uang_pangkal,
            CITA_CITA: value.aspiration,
        }))
        
        const fileName = 'Peserta'
        const worksheet = XLSX.utils.json_to_sheet(clean_data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
        saveAs(blob, `${fileName}.xlsx`);
    }

    return(
        <div className="inline-block float-right" style={{zIndex: '20'}}>
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewParticipant()}>Tambah Peserta</button>
            </div>
            <div className="inline-block float-right">
                <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => exportParticipants()}>Export Peserta</button>
            </div>

            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
            {filterParam !== "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {
                        participantFilters.map((l, k) => {
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

function Participants(){
    const [Participants, setParticipants] = useState([])
    const [originalParticipants, setOriginalParticipants] = useState([]) // Store original data

    useEffect(() => {
        getParticipantData()
    },[])

    const getParticipantData = async () => {
        let { data: Participants, error } = await supabase
            .from('participants')
            .select('*, applicants(*)')
            .is('deleted_at', null)

        if(!error){
            setParticipants(Participants)
            setOriginalParticipants(Participants) // Store original data
        }
    }

    const removeFilter = () => {
        setParticipants(originalParticipants) // Restore original data
    }

    const applyFilter = (params) => {
        const value = params === 'Laki-Laki' ? 'male' : 'female'
        let filteredTransactions = originalParticipants.filter((t) => {return t.applicants.gender === value })
        setParticipants(filteredTransactions)
    }

    // Search according to name
    const applySearch = (value) => {
        if(value === "" || value == null) {
            // When search is empty, show all data
            setParticipants(originalParticipants)
        } else {
            // Filter data based on search value
            let filteredTransactions = originalParticipants.filter((t) => {
                return t.regist_number.toLowerCase().includes(value.toLowerCase()) || 
                       t.phone_number.toLowerCase().includes(value.toLowerCase()) ||
                       t.applicants.full_name.toLowerCase().includes(value.toLowerCase())
            })
            setParticipants(filteredTransactions)
        }
    }

    const formatDateNew = (date) => {
        if (!date) return '-';
        
        const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        date = new Date(date);
        const dayName = dayNames[date.getDay()];
        const day = date.getDate();
        const monthName = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');

        const dateFormat = `${day}-${date.getMonth() + 1}-${year} ${hour}:${minute} WIB`;
        return dateFormat
    }

    return(
        <>
            <TitleCard 
                title="Peserta" 
                topMargin="mt-2" 
                TopSideButtons={
                    <TopSideButtons 
                        participants={Participants} 
                        applySearch={applySearch} 
                        applyFilter={applyFilter} 
                        removeFilter={removeFilter}
                    />
                }
            >
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>No. Registrasi</th>
                                <th>No. WhatsApp</th>
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
                                            <td>{l.applicants.full_name}</td>
                                            <td className="font-bold">{l.applicants.regist_number}</td>
                                            <td>{l.applicants.phone_number}</td>
                                            <td>{l.pob}</td>
                                            <td>
                                                <div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_complete === true ? 'bg-green-400' : 'bg-red-400'}`}>
                                                    {l.is_complete === true ? 'Lulus' : 'Tidak Lulus'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_settlement === true ? 'bg-green-400' : 'bg-red-400'}`}>
                                                    {l.is_settlement === true ? 'Sudah Bayar' : 'Belum Bayar'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_draft === true ? 'bg-green-400' : 'bg-red-400'}`}>
                                                    {l.is_draft === true ? 'Lengkap' : 'Belum Lengkap'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_uniform_sizing === true ? 'bg-green-400' : 'bg-red-400'}`}>
                                                    {l.is_uniform_sizing === true ? 'Selesai' : 'Belum Lengkap'}
                                                </div>
                                            </td>
                                            <td>{formatDateNew(l.updated_at)}</td>
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
// import moment from "moment"
// import { useEffect, useState } from "react"
// import * as XLSX from 'xlsx';
// import { useDispatch, useSelector } from "react-redux"
// import TitleCard from "../../components/Cards/TitleCard"
// import { showNotification } from '../common/headerSlice'
// import SearchBar from "../../components/Input/SearchBar"
// import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon"
// import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon"
// import { saveAs } from 'file-saver';
// // import XLSX from 'xlsx';

// import supabase from "../../services/database-server"

// const TopSideButtons = ({participants, removeFilter, applyFilter, applySearch}) => {

//     const [filterParam, setFilterParam] = useState("")
//     const [searchText, setSearchText] = useState("")
//     const dispatch = useDispatch()
//     const participantFilters = ["Laki-Laki", "Perempuan"]
    

//     const showFiltersAndApply = (params) => {
//         applyFilter(params)
//         setFilterParam(params)
//     }

//     const removeAppliedFilter = () => {
//         removeFilter()
//         setFilterParam("")
//         setSearchText("")
//     }

//     useEffect(() => {
        
//         if(searchText == ""){
//             removeAppliedFilter()
//         }else{
//             applySearch(searchText)
//         }
//     }, [participants, searchText])
    

//     const addNewParticipant = () => {
        
//         // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
//     }
//     const exportParticipants = () => {
//         // const exportToExcel = () => {
//     const clean_data = participants.map(value => ({
//         NAMA : value.applicants.full_name,
//         KK : value.kk_number,
//         STATUS_PENDAFTARAN: value.is_complete==true?'Lulus':'Tidak Lulus',
//         STATUS_SELEKSI:	value.submission_status==true?'Tuntas':'Belum Tuntas',
//         STATUS_PENGISIAN_FORMULIR:	value.is_draft==true?'Lengkap':'Belum Lengkap',
//         STATUS_PENGISIAN_UKURAN_SERAGAM: value.is_uniform_sizing==true?'Lengkap':'Belum Lengkap',
//         ALAMAT: value.home_address,
//         TEMPAT_LAHIR: value.pob,
//         TANGGAL_LAHIR: value.dob,
//         KATEGORI_SISWA: value.student_category,
//         METODE_PEMBAYARAN_UANGPANGKAL: value.metode_uang_pangkal,
//         CITA_CITA: value.aspiration,
//         // ALAMAT_SEKOLAH_SEBELUMNYA : value.prev_school_address,
//         // prev_school_address	kk_number	pob	dob	medical_history	sickness_history	home_address	child_status	child_number	live_with	parent_phone_number	distance	created_at	deleted_at	updated_at	student_category	metode_uang_pangkal	prev_school	nationality	province	region	postal_code	aspiration	id	nik	parent_email	is_complete	submission_status	is_draft	is_uniform_sizing
//     }))
//     // setParticipants
//             const fileName = 'Peserta'
//     const worksheet = XLSX.utils.json_to_sheet(clean_data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
//     saveAs(blob, `${fileName}.xlsx`);
// //   };

//         // dispatch(showNotification({message : "Add New Member clicked", status : 1}))
        
//     }

//     return(
//         <div className="inline-block float-right " z-index='20'>
//             <div className="inline-block float-right">
//                 <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewParticipant()}>Tambah Peserta</button>
//             </div>
//             <div className="inline-block float-right">
//                 <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => exportParticipants()}>Export Peserta</button>
//             </div>

//             <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
//             {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
//             <div className="dropdown dropdown-bottom dropdown-end">
//                 <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
//                 <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
//                     {
//                         participantFilters.map((l, k) => {
//                             return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
//                         })
//                     }
//                     <div className="divider mt-0 mb-0"></div>
//                     <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
//                 </ul>
//             </div>
//         </div>
//     )

//     // return(
//     //     <div className="inline-block float-right">
//     //         <div className="inline-block float-right">
//     //             <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewParticipant()}>Tambah Peserta</button>
//     //         {/* <div className="inline-block float-right"> */}
//     //             {/* <button className="btn px-6 btn-sm normal-case bg-green-700 text-gray-100 hover:bg-green-500 dark:text-gray-600" onClick={() => addNewTeamMember()}>Tambah Peserta</button> */}
//     //         </div>

//     //         <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
//     //         {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
//     //         <div className="dropdown dropdown-bottom dropdown-end">
//     //             <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
//     //             <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
//     //                 {
//     //                     participantFilters.map((l, k) => {
//     //                         return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
//     //                     })
//     //                 }
//     //                 <div className="divider mt-0 mb-0"></div>
//     //                 <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
//     //             </ul>
//     //         </div>
//     //     {/* </div> */}
//     //     </div>
//     // )
// }


// const TEAM_MEMBERS = [
//     {name : "Alex", avatar : "https://reqres.in/img/faces/1-image.jpg", email : "alex@dashwind.com", role : "Owner", joinedOn : moment(new Date()).add(-5*1, 'days').format("DD MMM YYYY"), lastActive : "5 hr ago"},
//     {name : "Ereena", avatar : "https://reqres.in/img/faces/2-image.jpg", email : "ereena@dashwind.com", role : "Admin", joinedOn : moment(new Date()).add(-5*2, 'days').format("DD MMM YYYY"), lastActive : "15 min ago"},
//     {name : "John", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "jhon@dashwind.com", role : "Admin", joinedOn : moment(new Date()).add(-5*3, 'days').format("DD MMM YYYY"), lastActive : "20 hr ago"},
//     {name : "Matrix", avatar : "https://reqres.in/img/faces/4-image.jpg", email : "matrix@dashwind.com", role : "Manager", joinedOn : moment(new Date()).add(-5*4, 'days').format("DD MMM YYYY"), lastActive : "1 hr ago"},
//     {name : "Virat", avatar : "https://reqres.in/img/faces/5-image.jpg", email : "virat@dashwind.com", role : "Support", joinedOn : moment(new Date()).add(-5*5, 'days').format("DD MMM YYYY"), lastActive : "40 min ago"},
//     {name : "Miya", avatar : "https://reqres.in/img/faces/6-image.jpg", email : "miya@dashwind.com", role : "Support", joinedOn : moment(new Date()).add(-5*7, 'days').format("DD MMM YYYY"), lastActive : "5 hr ago"},

// ]

// function Participants(){


//     const [members, setMembers] = useState(TEAM_MEMBERS)
//     const [Participants, setParticipants] = useState([])

//     useEffect(() => {
//         getParticipantData()
//         console.log(Participants)
//     },[])

//     const getRoleComponent = (role) => {
//         if(role  === "Admin")return <div className="badge badge-secondary">{role}</div>
//         if(role  === "Manager")return <div className="badge">{role}</div>
//         if(role  === "Owner")return <div className="badge badge-primary">{role}</div>
//         if(role  === "Support")return <div className="badge badge-accent">{role}</div>
//         else return <div className="badge badge-ghost">{role}</div>
//     }

//     const getParticipantData = async () => {
//         let { data: Participants, error } = await supabase
//             .from('participants')
//             .select('*, applicants(*)')
//             .is('deleted_at', null)

//         if(!error){
//             setParticipants(Participants)
//         }
//     }

//     const getEducationUnit = (value) => {
//         // if(value)
//         return value
//         // let { data: Participants, error } = await supabase
//         //     .from('Participants')
//         //     .select('*')

//         // if(!error){
//         //     setParticipants(Participants)
//         // }
//     }

//     const removeFilter = () => {
//         setParticipants(Participants)
//     }

//     const applyFilter = (params) => {
//         let value =''
//         params=='Laki-Laki'?value='male':value='female'
//         let filteredTransactions = Participants.filter((t) => {return t.applicants.gender == value })
//         setParticipants(filteredTransactions)
//     }

//     // Search according to name
//     const applySearch = (value) => {
//         let filteredTransactions = Participants.filter((t) => {return t.regist_number.toLowerCase().includes(value.toLowerCase()) ||  t.phone_number.toLowerCase().includes(value.toLowerCase())})
//         setParticipants(filteredTransactions)
//     }

//     const formatDateNew = (date) => {
//     const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
//     const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

//     date = new Date(date);
//     const dayName = dayNames[date.getDay()];
//     const day = date.getDate();
//     const month = date.getMonth();
//     const monthName = monthNames[date.getMonth()];
//     const year = date.getFullYear();
//     const hour = date.getHours();
//     const minute = date.getMinutes();
//     const second = date.getSeconds();

//     const dateFormat = `${day}-${month}-${year} ${hour}:${minute} WIB`;
//     // const indonesianFormat = `${dayName}, ${day} ${monthName} ${year} ${hour}:${minute} WIB`;
//     return dateFormat
//   }

//     return(
//         <>
            
//             <TitleCard title="Peserta" topMargin="mt-2" TopSideButtons={<TopSideButtons participants={Participants} applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter}/>}>

//                 {/* Team Member list in table format loaded constant */}
//             <div className="overflow-x-auto w-full">
//                 <table className="table w-full">
//                     <thead>
//                     <tr>
//                         <th>Nama</th>
//                         <th>No. Registrasi</th>
//                         <th>No. WhatsApp</th>
//                         <th>Tempat Lahir</th>
//                         <th>Status Seleksi</th>
//                         <th>Pembayaran</th>
//                         <th>Kelengkapan Formulir</th>
//                         <th>Kelengkapan Pengukuran Seragam</th>
//                         <th>Update Terakhir</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                         {
//                             Participants.map((l, k) => {
//                                 return(
//                                     <tr key={k}>
//                                     {/* <td>
//                                         <div className="flex items-center space-x-3">
//                                             <div className="avatar">
//                                                 <div className="mask mask-circle w-12 h-12">
//                                                     <img src={l.avatar} alt="Avatar" />
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <div className="font-bold">{l.name}</div>
//                                             </div>
//                                         </div>
//                                     </td> */}
//                                     <td >{l.applicants.full_name}</td>
//                                     <td className="font-bold ">{l.applicants.regist_number}</td>
//                                     <td>{l.applicants.phone_number}</td>
//                                     <td>{l.pob}</td>
//                                     <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_complete==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_complete==='true'?'Lulus':'Tidak Lulus'}</div></td>
//                                     <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_settlement==='true'?'Sudah Bayar':'Belum Bayar'}</div></td>
//                                     {/* className={`rounded-2xl w-32 py-1 px-2 text-gray-100 badge ${l.is_settlement==true? 'bg-orange-400': 'bg-green-400'}`} */}
//                                     <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_draft==='true'?'Lengkap':'Belum Lengkap'}</div></td>
//                                     {/* className={`rounded-2xl w-24 py-1 px-2 text-gray-100 badge ${l.is_draft==true? 'bg-blue-400': 'bg-gray-400'}`} */}
//                                     <td><div className={`rounded-2xl w-32 py-2 px-2 text-gray-100 badge ${l.is_uniform_sizing==true? 'bg-green-400': 'bg-red-400'}`}>{l.is_uniform_sizing==='true'?'Selesai':'Belum Lengkap'}</div></td>
//                                     {/* className={`rounded-2xl w-24 py-1 px-2 text-gray-100 badge ${l.is_uniform_sizing==true? 'bg-yellow-400': 'bg-cyan-400'}`} */}
//                                     {/* <td>{getEducationUnit(l.Participant_name)}</td>
//                                     <td>{l.address}</td> */}
//                                     <td>{formatDateNew(l.updated_at) }</td>
//                                     {/* <td>{getRoleComponent(l.role)}</td> */}
//                                     {/* <td>{l.lastActive}</td> */}
//                                     </tr>
//                                 )
//                             })
//                         }
//                     </tbody>
//                 </table>
//             </div>
//             </TitleCard>
//         </>
//     )
// }


// export default Participants